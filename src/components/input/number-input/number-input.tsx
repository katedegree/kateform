"use client";

import type React from "react";
import { BaseTextInput, InputWrapper } from "@internal/components";

export interface NumberInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "id" | "type" | "value" | "onChange"
  > {
  id: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  value?: number | null | undefined;
  onChange?: (v: number) => void;
}

export function NumberInput({
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  startContent,
  endContent,
  ...props
}: NumberInputProps) {
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
        startContent={startContent}
        endContent={endContent}
        actionContent={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[24px] h-[24px] cursor-pointer"
            onClick={(e) => {
              const svg = e.currentTarget;
              const { top, height } = svg.getBoundingClientRect();
              const clickY = e.clientY - top;
              const current = props.value ?? 0;
              props.onChange?.(clickY < height / 2 ? current + 1 : current - 1);
            }}
          >
            {" "}
            <path d="m7 15 5 5 5-5" /> <path d="m7 9 5-5 5 5" />{" "}
          </svg>
        }
        className="[&::-webkit-inner-spin-button]:[-webkit-appearance:none]"
        onWheel={(e) => {
          e.currentTarget.blur();
          props.onWheel?.(e);
        }}
        onChange={(e) => {
          props.onChange?.(Number(e.target.value));
        }}
        type="number"
        inputMode="numeric"
        value={props.value || ""}
      />
    </InputWrapper>
  );
}
