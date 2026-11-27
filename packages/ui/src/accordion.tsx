import {
  Accordion as UiAccordion,
  AccordionHeader as UiAccordionHeader,
  AccordionItem as UiAccordionItem,
  AccordionPanel as UiAccordionPanel,
  AccordionTrigger as UiAccordionTrigger,
} from "@ui-sdk/react/accordion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { type NativeButtonProps, type NativeDivProps } from "./lib/as-child";
import { cn } from "./lib/cn";
import { focusRing } from "./lib/classes";

function toValues(value?: string | string[]) {
  if (value == null) return undefined;
  return Array.isArray(value) ? value : [value];
}

export function Accordion({
  children,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  children?: ReactNode;
}) {
  return (
    <UiAccordion
      value={toValues(value)}
      defaultValue={toValues(defaultValue)}
      multiple={multiple}
      onValueChange={
        onValueChange
          ? (next) => {
              onValueChange(next);
            }
          : undefined
      }
      className={cn("grid gap-2", className)}
      {...props}
    >
      {children}
    </UiAccordion>
  );
}

export function AccordionItem({
  className,
  value,
  ...props
}: NativeDivProps & { value: string }) {
  return (
    <UiAccordionItem
      value={value}
      className={cn("overflow-hidden rounded-lg border border-border", className)}
      {...props}
    />
  );
}

export function AccordionHeader({
  className,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return <UiAccordionHeader className={cn("m-0", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  ...props
}: NativeButtonProps) {
  return (
    <UiAccordionTrigger
      className={cn(
        "flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium",
        "hover:bg-accent hover:text-accent-foreground",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

export function AccordionPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <UiAccordionPanel
      className={cn("border-t border-border px-4 py-3 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
