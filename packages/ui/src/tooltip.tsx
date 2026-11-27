import {
  Tooltip as UiTooltip,
  TooltipContent as UiTooltipContent,
  TooltipTrigger as UiTooltipTrigger,
} from "@ui-sdk/react/tooltip";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { asChildRender, type NativeButtonProps } from "./lib/as-child";
import { cn } from "./lib/cn";
import { focusRing } from "./lib/classes";

export function TooltipProvider({ children }: { children?: ReactNode; delayDuration?: number }) {
  return <>{children}</>;
}

export function Tooltip({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <UiTooltip
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={
        onOpenChange
          ? (next) => {
              onOpenChange(next);
            }
          : undefined
      }
    >
      {children}
    </UiTooltip>
  );
}

export function TooltipTrigger({
  asChild,
  className,
  children,
  ...props
}: NativeButtonProps & { asChild?: boolean }) {
  const render = asChildRender(asChild, children);
  return (
    <UiTooltipTrigger
      className={cn(!render && focusRing, className)}
      render={render}
      {...props}
    >
      {render ? undefined : children}
    </UiTooltipTrigger>
  );
}

export function TooltipContent({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <UiTooltipContent
      sideOffset={6}
      className={cn(
        "z-tooltip overflow-hidden rounded-md border border-border-strong bg-raised px-3 py-1.5 text-xs text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function SimpleTooltip({
  content,
  children,
}: {
  content: ReactNode;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
