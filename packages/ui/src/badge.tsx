import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "./lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[0.75rem] font-medium uppercase leading-[1.4] tracking-[0.08em]",
  {
    variants: {
      variant: {
        default: "border-primary text-accent-text",
        secondary: "border-border-strong bg-secondary text-secondary-foreground",
        outline: "border-border-strong text-foreground",
        success:
          "border-border-strong text-foreground before:size-2 before:rounded-full before:bg-sig-forest before:content-['']",
        warning:
          "border-border-strong text-foreground before:size-2 before:rounded-full before:bg-sig-gold before:content-['']",
        danger:
          "border-primary text-accent-text before:size-2 before:rounded-full before:bg-primary before:content-['']",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = "Badge";

export { badgeVariants };
