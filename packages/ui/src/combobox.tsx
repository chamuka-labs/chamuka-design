import {
  Combobox as UiCombobox,
  ComboboxContent as UiComboboxContent,
  ComboboxEmpty as UiComboboxEmpty,
  ComboboxInput as UiComboboxInput,
  ComboboxItem as UiComboboxItem,
  ComboboxList as UiComboboxList,
} from "@ui-sdk/react/combobox";
import type { ReactNode } from "react";
import { type NativeDivProps, type NativeInputProps } from "./lib/as-child";
import { cn } from "./lib/cn";
import { disabledControl, focusRing, itemInteractive, popupSurface } from "./lib/classes";

export function Combobox({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
}: {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
}) {
  return (
    <UiCombobox
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      name={name}
      onValueChange={
        onValueChange
          ? (next) => {
              onValueChange(String(next ?? ""));
            }
          : undefined
      }
    >
      {children}
    </UiCombobox>
  );
}

export function ComboboxInput({
  className,
  ...props
}: NativeInputProps) {
  return (
    <UiComboboxInput
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-raised px-3 py-2 text-base text-foreground hover:border-border-hover",
        "placeholder:text-muted-foreground",
        focusRing,
        disabledControl,
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxContent({
  className,
  ...props
}: NativeDivProps) {
  return (
    <UiComboboxContent className={cn(popupSurface, "z-dropdown p-1", className)} {...props} />
  );
}

export function ComboboxList({
  className,
  ...props
}: NativeDivProps) {
  return <UiComboboxList className={cn("max-h-64 overflow-auto", className)} {...props} />;
}

export function ComboboxEmpty({
  className,
  ...props
}: NativeDivProps) {
  return (
    <UiComboboxEmpty
      className={cn("px-2 py-1.5 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function ComboboxItem({
  className,
  children,
  value,
  disabled,
  ...props
}: NativeDivProps & { value: string; disabled?: boolean }) {
  return (
    <UiComboboxItem
      value={value}
      label={typeof children === "string" ? children : undefined}
      disabled={disabled}
      className={cn(itemInteractive, className)}
      {...props}
    >
      {children}
    </UiComboboxItem>
  );
}
