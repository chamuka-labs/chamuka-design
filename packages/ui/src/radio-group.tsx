import { Radio, RadioGroup as UiRadioGroup, RadioIndicator } from "@ui-sdk/react/radio";
import type { NativeButtonProps, NativeDivProps } from "./lib/as-child";
import { cn } from "./lib/cn";
import { disabledControl, focusRing } from "./lib/classes";

export type RadioGroupProps = NativeDivProps & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
};

export function RadioGroup({
  className,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  required,
  ...props
}: RadioGroupProps) {
  return (
    <UiRadioGroup
      value={value}
      defaultValue={defaultValue}
      name={name}
      disabled={disabled}
      required={required}
      onValueChange={
        onValueChange
          ? (next) => {
              onValueChange(String(next));
            }
          : undefined
      }
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

export type RadioGroupItemProps = NativeButtonProps & {
  value: string;
};

export function RadioGroupItem({ className, value, disabled, id, ...props }: RadioGroupItemProps) {
  return (
    <Radio
      id={id}
      value={value}
      disabled={disabled}
      className={cn(
        "aspect-square size-4 rounded-full border border-input bg-raised",
        "data-checked:border-primary",
        "motion-reduce:transition-none",
        focusRing,
        disabledControl,
        className,
      )}
      {...props}
    >
      <RadioIndicator className="flex items-center justify-center">
        <span className="size-2 rounded-full bg-primary" />
      </RadioIndicator>
    </Radio>
  );
}
