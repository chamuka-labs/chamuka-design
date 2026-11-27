import {
  Select as UiSelect,
  SelectContent as UiSelectContent,
  SelectGroup as UiSelectGroup,
  SelectItem as UiSelectItem,
  SelectTrigger as UiSelectTrigger,
  SelectValue as UiSelectValue,
} from "@ui-sdk/react/select";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { type NativeButtonProps, type NativeDivProps } from "./lib/as-child";
import { cn } from "./lib/cn";
import { disabledControl, focusRing, itemInteractive, popupSurface } from "./lib/classes";

export function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  placeholder,
}: {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
}) {
  return (
    <UiSelect
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      name={name}
      placeholder={placeholder}
      onValueChange={
        onValueChange
          ? (next) => {
              onValueChange(String(next));
            }
          : undefined
      }
    >
      {children}
    </UiSelect>
  );
}

export function SelectValue({
  className,
  placeholder,
  ...props
}: Omit<ComponentPropsWithoutRef<"span">, "value" | "defaultValue" | "onChange" | "onSelect"> & {
  placeholder?: string;
}) {
  return (
    <UiSelectValue
      placeholder={placeholder}
      className={cn("line-clamp-1", className)}
      {...props}
    />
  );
}

export function SelectGroup({ className, ...props }: NativeDivProps) {
  return <UiSelectGroup className={className} {...props} />;
}

export function SelectTrigger({
  className,
  ...props
}: NativeButtonProps) {
  return (
    <UiSelectTrigger
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-raised px-3 py-2 text-base hover:border-border-hover",
        "data-placeholder:text-muted-foreground",
        "motion-reduce:transition-none",
        focusRing,
        disabledControl,
        className,
      )}
      {...props}
    />
  );
}

export function SelectContent({
  className,
  ...props
}: NativeDivProps) {
  return (
    <UiSelectContent
      className={cn(popupSurface, "z-dropdown p-1", className)}
      {...props}
    />
  );
}

export function SelectItem({
  className,
  children,
  value,
  disabled,
  ...props
}: NativeDivProps & { value: string; disabled?: boolean }) {
  return (
    <UiSelectItem
      value={value}
      label={typeof children === "string" ? children : undefined}
      disabled={disabled}
      className={cn(itemInteractive, className)}
      {...props}
    >
      {children}
    </UiSelectItem>
  );
}

export function SelectField({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium leading-none text-foreground">{label}</span>
      {children}
    </div>
  );
}
