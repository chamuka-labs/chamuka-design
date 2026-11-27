import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { componentCatalog } from "../packages/ui/src/catalog.ts";
import { cssName } from "../packages/tokens/src/css-name.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = "chamuka-labs/chamuka-design";
const RAW = `https://raw.githubusercontent.com/${REPO}/main/registry`;
const REPO_URL = `https://github.com/${REPO}`;

type TokenNode = {
  $value?: unknown;
  $type?: string;
  $description?: string;
  $deprecated?: unknown;
  [key: string]: unknown;
};

type FlatToken = {
  path: string;
  cssVar: string;
  value: unknown;
  type?: string;
  description?: string;
  deprecated?: string | true;
};

function isToken(node: unknown): node is TokenNode {
  return Boolean(node && typeof node === "object" && "$value" in (node as object));
}

function walk(node: unknown, prefix: string[], acc: FlatToken[]): void {
  if (!node || typeof node === "object" === false) return;
  if (isToken(node)) {
    const path = prefix.join(".");
    acc.push({
      path,
      cssVar: cssName(path),
      value: node.$value,
      type: node.$type,
      description: node.$description,
      deprecated:
        node.$deprecated === undefined || node.$deprecated === false
          ? undefined
          : node.$deprecated === true
            ? true
            : String(node.$deprecated),
    });
    return;
  }
  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    if (key.startsWith("$")) continue;
    walk(child, [...prefix, key], acc);
  }
}

function loadTokens(): FlatToken[] {
  const dir = join(ROOT, "packages/tokens/src/tokens");
  const acc: FlatToken[] = [];
  for (const file of readdirSync(dir).sort()) {
    if (!file.endsWith(".json")) continue;
    walk(JSON.parse(readFileSync(join(dir, file), "utf8")), [], acc);
  }
  return acc;
}

function rewriteForRegistry(source: string): string {
  return source
    .replaceAll('from "./lib/cn"', 'from "@/lib/utils"')
    .replaceAll('from "./lib/classes"', 'from "@/lib/classes"')
    .replaceAll('from "./lib/as-child"', 'from "@/lib/as-child"')
    .replaceAll('from "./button"', 'from "@/components/ui/button"')
    .replaceAll('from "./label"', 'from "@/components/ui/label"');
}

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function fileEntry(path: string, type: string, target?: string) {
  const abs = join(ROOT, path);
  return {
    path,
    type,
    target,
    content: rewriteForRegistry(readFileSync(abs, "utf8")),
  };
}

function main() {
  const tokens = loadTokens();
  const components = componentCatalog.map((entry) => ({
    name: entry.name,
    slug: entry.slug,
    import: { named: entry.exports, from: "@chamuka/ui" },
    file: entry.file,
    description: entry.description,
    behaviour: entry.behaviour,
    behaviourReason: entry.behaviourReason,
    variants: entry.variants ?? {},
    props: entry.props ?? [],
    a11y: entry.a11y,
    example: entry.example,
    registry: `${RAW}/${entry.slug}.json`,
  }));

  const uiManifest = {
    name: "@chamuka/ui",
    repository: REPO_URL,
    components,
  };
  const tokensManifest = {
    name: "@chamuka/tokens",
    repository: REPO_URL,
    tokens: tokens.map((token) => ({
      path: token.path,
      cssVar: token.cssVar,
      value: token.value,
      type: token.type,
      description: token.description,
      deprecated: token.deprecated,
    })),
  };
  const rootManifest = {
    name: "chamuka-design",
    brand: "Daybreak",
    repository: REPO_URL,
    packages: ["@chamuka/tokens", "@chamuka/ui", "@chamuka/icons"],
    registry: `${RAW}/registry.json`,
    behaviour: {
      "ui-sdk": "Interactive components wrap @ui-sdk/react 0.1.0-beta.2. Do not import UI SDK types from @chamuka/ui.",
      radix: "Avatar and Separator still use Radix.",
      plain: "Presentational components are React + Tailwind + cva.",
    },
    components,
    tokens: tokensManifest.tokens,
  };

  writeJson(join(ROOT, "packages/ui/manifest.json"), uiManifest);
  writeJson(join(ROOT, "packages/tokens/manifest.json"), tokensManifest);
  writeJson(join(ROOT, "manifest.json"), rootManifest);

  const registryDir = join(ROOT, "registry");
  rmSync(registryDir, { recursive: true, force: true });
  mkdirSync(registryDir, { recursive: true });

  const utilsItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "utils",
    type: "registry:lib",
    title: "cn",
    description: "clsx + tailwind-merge helper used by every Chamuka component.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
        target: "@lib/utils.ts",
        content: `${readFileSync(join(ROOT, "packages/ui/src/lib/cn.ts"), "utf8").replace('from "./lib/cn"', 'from "@/lib/utils"')}`,
      },
    ],
  };

  const classesItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "classes",
    type: "registry:lib",
    title: "shared classes",
    description: "Focus ring and popup surfaces shared by Chamuka components.",
    files: [
      {
        path: "lib/classes.ts",
        type: "registry:lib",
        target: "@lib/classes.ts",
        content: readFileSync(join(ROOT, "packages/ui/src/lib/classes.ts"), "utf8"),
      },
    ],
  };

  const items = [
    {
      name: "utils",
      type: "registry:lib",
      title: "cn",
      description: utilsItem.description,
      files: [{ path: "lib/utils.ts", type: "registry:lib" }],
    },
    {
      name: "classes",
      type: "registry:lib",
      title: "shared classes",
      description: classesItem.description,
      files: [{ path: "lib/classes.ts", type: "registry:lib" }],
    },
  ];

  writeJson(join(registryDir, "utils.json"), utilsItem);
  writeJson(join(registryDir, "classes.json"), classesItem);

  for (const entry of componentCatalog) {
    const files = [
      fileEntry(entry.file, "registry:ui", `@ui/${entry.slug}.tsx`),
      ...(entry.extraFiles ?? []).map((path) => {
        const base = path.split("/").pop() ?? path;
        const type = path.includes("/lib/") ? "registry:lib" : "registry:ui";
        return fileEntry(path, type, path.includes("/lib/") ? `@lib/${base}` : `@ui/${base}`);
      }),
    ];
    const item = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: entry.slug,
      type: "registry:ui",
      title: entry.name,
      description: entry.description,
      meta: {
        behaviour: entry.behaviour,
        behaviourReason: entry.behaviourReason,
        a11y: entry.a11y,
        example: entry.example,
      },
      dependencies: entry.npmDependencies ?? [],
      registryDependencies: (entry.registryDependencies ?? []).map((dep) => `${RAW}/${dep}.json`),
      files,
    };
    writeJson(join(registryDir, `${entry.slug}.json`), item);
    items.push({
      name: entry.slug,
      type: "registry:ui",
      title: entry.name,
      description: entry.description,
      files: files.map(({ content: _content, ...rest }) => rest),
    });
  }

  writeJson(join(registryDir, "registry.json"), {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "chamuka",
    homepage: REPO_URL,
    items,
  });

  console.log(
    `wrote manifest.json, packages/ui/manifest.json, packages/tokens/manifest.json, registry (${items.length} items)`,
  );
}

main();
