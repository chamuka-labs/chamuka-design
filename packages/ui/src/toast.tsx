import {
  Toast as UiToast,
  ToastClose as UiToastClose,
  ToastDescription as UiToastDescription,
  ToastRegion,
  ToastTitle as UiToastTitle,
  createToaster,
} from "@ui-sdk/react/toast";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "./lib/cn";

type ToastInput = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastApi = {
  toast: (input: ToastInput) => void;
};

type ToasterFn = ReturnType<typeof createToaster<ReactNode>>;

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toaster] = useState<ToasterFn>(() => createToaster());

  useEffect(() => () => toaster.dismiss(), [toaster]);

  const toast = useCallback(
    (input: ToastInput) => {
      const options = { title: input.title, description: input.description };
      if (input.variant === "destructive") {
        toaster.error(input.title, options);
      } else {
        toaster(input.title, options);
      }
    },
    [toaster],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion
        toaster={toaster}
        className="fixed bottom-4 right-4 z-toast flex max-h-screen w-full max-w-sm flex-col gap-2 outline-none"
      >
        {(item) => (
          <Toast
            className={
              item.type === "error"
                ? "border-primary"
                : undefined
            }
          >
            <ToastTitle />
            <ToastDescription />
          </Toast>
        )}
      </ToastRegion>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function Toast({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <UiToast
      className={cn(
        "pointer-events-auto relative flex w-full max-w-sm flex-col gap-1 rounded-lg border border-border-strong bg-card p-4",
        className,
      )}
    >
      {children}
    </UiToast>
  );
}

export function ToastTitle({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <UiToastTitle className={cn("text-sm font-medium", className)}>{children}</UiToastTitle>
  );
}

export function ToastDescription({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <UiToastDescription className={cn("text-sm opacity-90", className)}>
      {children}
    </UiToastDescription>
  );
}

export function ToastClose({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <UiToastClose className={cn("absolute right-2 top-2", className)}>{children}</UiToastClose>
  );
}

export function ToastViewport({
  className,
  ...props
}: ComponentPropsWithoutRef<"ol">) {
  return <ol className={className} {...props} />;
}
