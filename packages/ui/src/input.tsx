import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "./lib/cn";
import { disabledControl, focusRing } from "./lib/classes";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-raised px-3 py-2 text-base text-foreground hover:border-border-hover",
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
Input.displayName = "Input";
