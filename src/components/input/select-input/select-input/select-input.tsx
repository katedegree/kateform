"use client";

import {
  Input,
  InputWrapper,
  SelectChevronIcon,
} from "@kateform/internal/components";
import { usePopover } from "@kateform/internal/hooks/use-popover";
import { SelectPopover } from "@kateform/internal/components/select-popover";
import { useEffect, useState } from "react";
import { inputProps } from "@kateform/internal/utils";

export interface SelectInputProps<T extends string | number>
  extends Omit<
    React.ComponentProps<"input">,
    "type" | "id" | "name" | "onChange" | "value"
  > {
  id: string;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onReadOnly?: () => void;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  actionContent?: (isOpen: boolean) => React.ReactNode;
  options?: { value: T; label: string }[];
  onChange?: (v: T | null) => void;
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
  actionContent = (isOpen) => <SelectChevronIcon isOpen={isOpen} />,
  options,
  onChange,
  value,
  popoverHeight = 160,
  ...props
}: SelectInputProps<T>) {
  const { isOpen, handleClose, inputRef, wrapperRef, popoverRef } = usePopover(
    props.ref,
    popoverHeight
  );

  const [search, setSearch] = useState("");
  useEffect(() => {
    if (value) setSearch("");
  }, [value]);

  return (
    <InputWrapper
      id={props.id}
      label={label}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      errorMessage={errorMessage}
      onReadOnly={onReadOnly}
    >
      <div ref={wrapperRef}>
        <Input
          {...props}
          startContent={startContent}
          endContent={endContent}
          actionContent={actionContent(isOpen)}
          renderInput={
            <div className="relative">
              <p className="absolute">
                {options?.find((o) => o.value === value)?.label}
              </p>
              <input
                {...inputProps({
                  ...props,
                  placeholder: value ? "" : props.placeholder,
                  type: "text",
                  value: search,
                  onChange: (e) => {
                    if (value) {
                      onChange?.(null);
                    }
                    setSearch(e.target.value);
                  },
                  onBlur: () => setSearch(""),
                })}
                ref={inputRef}
              />
            </div>
          }
        />
        {isOpen && (
          <SelectPopover
            popoverRef={popoverRef}
            options={options?.filter((o) => o.label.includes(search))}
            selected={value ? [value] : []}
            onSelect={(v) => {
              onChange?.(v === value ? null : v);
              handleClose();
            }}
          />
        )}
      </div>
    </InputWrapper>
  );
}
