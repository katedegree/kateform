"use client";

import { useState } from "react";
import {
  Input,
  InputWrapper,
  PasswordVisibilityIcon,
} from "@kateform/internal/components";

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "id" | "name"> {
  id: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  actionContent?: (isVisible: boolean) => React.ReactNode;
}

export function PasswordInput({
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  startContent,
  endContent,
  actionContent = (isVisible) => (
    <PasswordVisibilityIcon isVisible={isVisible} />
  ),
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputWrapper
      id={props.id}
      label={label}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      errorMessage={errorMessage}
      onReadOnly={onReadOnly}
    >
      <Input
        {...props}
        startContent={startContent}
        endContent={endContent}
        actionContent={
          <button onClick={() => setIsVisible(!isVisible)}>
            {actionContent(isVisible)}
          </button>
        }
        type={isVisible ? "text" : "password"}
      />
    </InputWrapper>
  );
}
