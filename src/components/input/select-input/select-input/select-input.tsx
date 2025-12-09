"use client";

import { InputWrapper, BaseTextInput } from "@kateform/internal/components";
import { cn } from "@kateform/internal/utils";
import { usePopover } from "@kateform/internal/hooks/use-popover";
import { SelectPopover } from "@kateform/internal/components/select-popover";

export interface SelectInputProps<T extends string | number>
  extends Omit<
    React.ComponentProps<"input">,
    "type" | "id" | "onChange" | "value" | "onSelect" | "ref"
  > {
  id: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  options?: { value: T; label: string }[];
  onSelect?: (v: T) => void;
  value?: T | null;
  popoverHeight?: number;
}

export function SelectInput<T extends string | number>({
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  startContent,
  endContent,
  options,
  onSelect,
  value,
  popoverHeight = 160,
  ...props
}: SelectInputProps<T>) {
  const { isOpen, setIsOpen, inputRef, popoverRef } = usePopover(popoverHeight);

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
        ref={inputRef}
        startContent={startContent}
        endContent={endContent}
        actionContent={
          <div
            className={cn(
              "transition duration-200 ease-in-out",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          >
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
              className="w-[24px] h-[24px]"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        }
        type="text"
        readOnly
        value={options?.find((option) => option.value === value)?.label}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen && (
        <SelectPopover
          ref={popoverRef}
          options={options}
          value={value}
          onSelect={(v) => {
            setIsOpen(false);
            onSelect?.(v);
          }}
        />
      )}
    </InputWrapper>
  );
}
