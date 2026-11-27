import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "./lib/cn";
import { disabledControl, focusRing } from "./lib/classes";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-24 w-full rounded-md border border-input bg-raised px-3 py-2 text-base text-foreground hover:border-border-hover",
        "placeholder:text-muted-foreground",
        "aria-invalid:border-destructive",
        "motion-reduce:transition-none",
        focusRing,
        disabledControl,
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
