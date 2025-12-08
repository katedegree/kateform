"use client";

import { InputWrapper, BaseTextInput } from "@internal/components";

export interface TextInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "id" | "ref"> {
  id: string;
  ref?: React.RefObject<HTMLDivElement | null>;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export function TextInput({
  ref,
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  startContent,
  endContent,
  ...props
}: TextInputProps) {
  return (
    <InputWrapper
      id={props.id}
      label={label}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      errorMessage={errorMessage}
      onReadOnly={onReadOnly}
    >
      <BaseTextInput
        {...props}
        ref={ref}
        startContent={startContent}
        endContent={endContent}
        type="text"
      />
    </InputWrapper>
  );
}
