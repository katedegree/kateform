"use client";

import { cn } from "../utils";
import { useStore } from "../store";

export interface BaseTextInputProps
  extends Omit<React.ComponentProps<"input">, "id"> {
  id: string;
  startContent: React.ReactNode;
  endContent: React.ReactNode;
  actionContent?: React.ReactNode;
}

export function BaseTextInput({
  startContent,
  endContent,
  actionContent,
  ...props
}: BaseTextInputProps) {
  const { setErrorMessage } = useStore();

  return (
    <div className="rounded-input text-value bg-flat hover:bg-flat-hover overflow-hidden focus-within:bg-flat-hover">
      <div className="w-full px-lg flex items-center gap-md">
        {startContent && <div className="text-placeholder">{startContent}</div>}
        <input
          {...props}
          className={cn(
            "w-full py-md outline-none autofill:bg-transparent bg-clip-text",
            "placeholder:text-placeholder caret-value [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-value)]",
            props.className
          )}
          onChange={(e) => {
            setErrorMessage(props.id, "");
            props.onChange?.(e);
          }}
        />
        {endContent && <div className="text-placeholder">{endContent}</div>}
        {actionContent}
      </div>
    </div>
  );
}
