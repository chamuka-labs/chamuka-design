import {
  Tabs as UiTabs,
  TabsList as UiTabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/react/tabs";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { type NativeButtonProps, type NativeDivProps } from "./lib/as-child";
import { cn } from "./lib/cn";
import { focusRing } from "./lib/classes";

export function Tabs({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <UiTabs
      value={value}
      defaultValue={defaultValue}
      onValueChange={
        onValueChange
          ? (next) => {
              onValueChange(String(next));
            }
          : undefined
      }
      className={className}
      {...props}
    >
      {children}
    </UiTabs>
  );
}

export function TabsList({
  className,
  ...props
}: NativeDivProps) {
  return (
    <UiTabsList
      className={cn("inline-flex items-center gap-1 rounded-md border border-border bg-card p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  value,
  ...props
}: NativeButtonProps & { value: string }) {
  return (
    <TabsTab
      value={value}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-3 py-1.5 font-mono text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground",
        "data-selected:bg-raised data-selected:text-foreground",
        "motion-reduce:transition-none",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  value,
  children,
  ...props
}: NativeDivProps & { value: string; children?: ReactNode }) {
  return (
    <TabsPanel value={value} className={cn("mt-3", className)} {...props}>
      {children}
    </TabsPanel>
  );
}
