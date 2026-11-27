import {
  Checkbox as UiCheckbox,
  CheckboxIndicator,
} from "@ui-sdk/react/checkbox";
import type { NativeButtonProps } from "./lib/as-child";
import { cn } from "./lib/cn";
import { disabledControl, focusRing } from "./lib/classes";

export type CheckboxProps = NativeButtonProps & {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  name?: string;
  value?: string;
  required?: boolean;
};

export function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  value,
  required,
  id,
  ...props
}: CheckboxProps) {
  return (
    <UiCheckbox
      id={id}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      name={name}
      value={value}
      required={required}
      onCheckedChange={
        onCheckedChange
          ? (next) => {
              onCheckedChange(next);
            }
          : undefined
      }
      className={cn(
        "peer size-4 shrink-0 rounded-sm border border-input bg-raised",
        "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        "motion-reduce:transition-none",
        focusRing,
        disabledControl,
        className,
      )}
      {...props}
    >
      <CheckboxIndicator className="flex items-center justify-center text-current">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M2.5 6.2 5 8.7 9.5 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CheckboxIndicator>
    </UiCheckbox>
  );
}
