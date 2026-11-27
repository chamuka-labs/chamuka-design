import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "./lib/cn";

export type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Daybreak v2: dark is the default; "system" follows prefers-color-scheme (dark when unknown). */
function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  className,
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  className?: string;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolved, setResolved] = useState<"light" | "dark">(() =>
    resolveTheme(defaultTheme),
  );

  useEffect(() => {
    const apply = () => setResolved(resolveTheme(theme));
    apply();
    if (theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const value = useMemo(
    () => ({ theme, resolved, setTheme }),
    [theme, resolved, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={cn(
          "min-h-full bg-background font-sans text-base text-foreground antialiased",
          resolved === "dark" ? "dark" : "light",
          className,
        )}
        data-theme={resolved}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
