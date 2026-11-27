import {
  Dialog as UiDialog,
  DialogBackdrop as UiDialogBackdrop,
  DialogClose as UiDialogClose,
  DialogContent as UiDialogContent,
  DialogDescription as UiDialogDescription,
  DialogTitle as UiDialogTitle,
  DialogTrigger as UiDialogTrigger,
} from "@ui-sdk/react/dialog";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { asChildRender, type NativeButtonProps } from "./lib/as-child";
import { cn } from "./lib/cn";
import { focusRing } from "./lib/classes";

type OpenChangeHandler = (open: boolean) => void;

export function Dialog({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OpenChangeHandler;
}) {
  return (
    <UiDialog
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
    </UiDialog>
  );
}

export function DialogTrigger({
  asChild,
  className,
  children,
  ...props
}: NativeButtonProps & { asChild?: boolean }) {
  const render = asChildRender(asChild, children);
  return (
    <UiDialogTrigger
      className={cn(!render && focusRing, className)}
      render={render}
      {...props}
    >
      {render ? undefined : children}
    </UiDialogTrigger>
  );
}

export function DialogOverlay({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <UiDialogBackdrop
      className={cn("fixed inset-0 z-overlay bg-ink/70 motion-reduce:transition-none", className)}
      {...props}
    />
  );
}

export const DialogBackdrop = DialogOverlay;

export function DialogPortal({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function DialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <>
      <DialogOverlay />
      <UiDialogContent
        className={cn(
          "fixed left-1/2 top-1/2 z-modal w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-lg border border-border-strong bg-card p-6",
          "motion-reduce:transition-none",
          focusRing,
          className,
        )}
        {...props}
      >
        {children}
      </UiDialogContent>
    </>
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<"h2">) {
  return (
    <UiDialogTitle
      className={cn("font-display text-2xl font-extrabold uppercase leading-[1.05] tracking-[-0.01em] [font-stretch:72%]", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <UiDialogDescription
      className={cn("mt-2 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogClose({
  className,
  ...props
}: NativeButtonProps) {
  return <UiDialogClose className={cn(focusRing, className)} {...props} />;
}
