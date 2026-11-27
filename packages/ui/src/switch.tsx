import { Switch as UiSwitch, SwitchThumb } from "@ui-sdk/react/switch";
import type { NativeButtonProps } from "./lib/as-child";
import { cn } from "./lib/cn";
import { disabledControl, focusRing } from "./lib/classes";

export type SwitchProps = NativeButtonProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  required?: boolean;
};

export function Switch({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  required,
  id,
  ...props
}: SwitchProps) {
  return (
    <UiSwitch
      id={id}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      name={name}
      required={required}
      onCheckedChange={
        onCheckedChange
          ? (next) => {
              onCheckedChange(Boolean(next));
            }
          : undefined
      }
      className={cn(
        "peer relative inline-flex h-6 w-[44px] shrink-0 cursor-pointer items-center rounded-sm border border-input bg-raised",
        "data-checked:border-primary data-checked:bg-primary",
        "motion-reduce:transition-none",
        focusRing,
        disabledControl,
        className,
      )}
      {...props}
    >
      <SwitchThumb
        className={cn(
          "pointer-events-none block size-[18px] rounded-[1px] bg-fg-2 transition-transform data-checked:bg-primary-foreground",
          "data-checked:translate-x-5 translate-x-0.5",
          "motion-reduce:transition-none",
        )}
      />
    </UiSwitch>
  );
}
