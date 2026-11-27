import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "./lib/cn";

/** Status is an 8px signal dot plus the edge; never a tinted fill or a side bar. */
const dot =
  "pl-9 before:absolute before:left-4 before:top-[1.3rem] before:size-2 before:rounded-full before:content-['']";

const alertVariants = cva("relative w-full rounded-lg border bg-card p-4 text-card-foreground", {
  variants: {
    variant: {
      default: "border-border",
      success: `border-border-strong ${dot} before:bg-sig-forest`,
      warning: `border-border-strong ${dot} before:bg-sig-gold`,
      danger: `border-primary ${dot} before:bg-primary`,
      info: `border-border-strong ${dot} before:bg-sig-slate`,
    },
  },
  defaultVariants: { variant: "default" },
});

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    title?: ReactNode;
  };

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, children, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="grid gap-1">
        {title ? <p className="font-mono text-[0.8125rem] font-medium uppercase tracking-[0.08em]">{title}</p> : null}
        {children ? <div className="text-sm text-muted-foreground">{children}</div> : null}
      </div>
    </div>
  ),
);
Alert.displayName = "Alert";

export { alertVariants };
