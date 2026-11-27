import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "./lib/cn";
import { disabledControl, focusRing } from "./lib/classes";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent font-mono text-[0.8125rem] font-medium uppercase leading-none tracking-[0.08em] transition-colors duration-150 ease-[cubic-bezier(0.2,0.7,0.1,1)]",
    "motion-reduce:transition-none",
    focusRing,
    disabledControl,
  ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-press",
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-press",
        secondary: "border-border-strong bg-secondary text-secondary-foreground hover:border-border-hover",
        outline: "border-border-strong bg-transparent text-foreground hover:border-border-hover hover:bg-accent",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        destructive:
          "border-destructive bg-transparent text-accent-text hover:bg-destructive hover:text-destructive-foreground",
        link: "h-auto px-0 text-foreground underline decoration-border-hover underline-offset-[3px] hover:decoration-primary",
      },
      size: {
        default: "h-10 px-5",
        md: "h-10 px-5",
        sm: "h-8 px-3 text-[0.75rem]",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
