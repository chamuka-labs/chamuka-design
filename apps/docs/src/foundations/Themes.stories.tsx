import type { Meta, StoryObj } from "@storybook/react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@chamuka/ui";

const meta: Meta = { title: "Foundations/Themes" };
export default meta;

function Sample() {
  return (
    <div className="grid gap-6">
      <p className="sb-label">
        <span className="text-accent-text">01</span>&nbsp;&nbsp;Experiments
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button>Hire us</Button>
        <Button variant="secondary">Read the spec</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Coming soon as open source</Badge>
        <Badge variant="outline">Apache-2.0</Badge>
        <Badge variant="success">Running</Badge>
        <Badge variant="warning">Draft</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>DrawIt</CardTitle>
          <CardDescription>A canvas you and the model both edit.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Label htmlFor="theme-sample-input">Name</Label>
          <Input id="theme-sample-input" placeholder="Swift" />
          <div className="flex items-center gap-3">
            <Switch aria-label="Agents can edit" defaultChecked />
            <span className="text-sm text-muted-foreground">Agents can edit</span>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="dark">
        <TabsList>
          <TabsTrigger value="dark">Dark</TabsTrigger>
          <TabsTrigger value="light">Light</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
      </Tabs>
      <Alert variant="danger" title="Could not save">
        Check the network and try again.
      </Alert>
    </div>
  );
}

/** Dark and light rendered together with nested `data-theme` scopes. Ignores the toolbar. */
export const SideBySide: StoryObj = {
  render: () => (
    <div className="grid gap-0 md:grid-cols-2">
      {(["dark", "light"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          className="bg-background p-8 text-foreground"
        >
          <Sample />
        </section>
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" },
};

/** Follows the Theme switch in the toolbar. */
export const Current: StoryObj = {
  render: () => <Sample />,
};
