"use client";

import {
  Input,
  InputWrapper,
  MultiSelectRemoveIcon,
  SelectChevronIcon,
} from "@kateform/internal/components";
import { usePopover } from "@kateform/internal/hooks/use-popover";
import { SelectPopover } from "@kateform/internal/components/select-popover";
import { useEffect, useState } from "react";
import { inputProps } from "@kateform/internal/utils";

export interface MultiSelectInputProps<T extends string | number>
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
  onChange?: (v: T[]) => void;
  value?: T[];
  popoverHeight?: number;
}

export function MultiSelectInput<T extends string | number>({
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
  value = [],
  popoverHeight = 160,
  ...props
}: MultiSelectInputProps<T>) {
  const { isOpen, setIsOpen, inputRef, wrapperRef, popoverRef } = usePopover(
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
          type="text"
          renderInput={
            <div className="flex flex-wrap gap-sm">
              {options
                ?.filter((option) => value.includes(option.value))
                .map((option) => (
                  <div
                    className="flex items-center w-fit bg-popover whitespace-nowrap rounded-[calc(var(--radius-input)_-_var(--spacing-md))]"
                    key={option.value}
                  >
                    <p className="pl-md">{option.label}</p>
                    <button
                      className="px-sm hover:text-error h-full flex items-center cursor-pointer"
                      onClick={() => {
                        onChange?.(value.filter((v) => v !== option.value));
                      }}
                    >
                      <MultiSelectRemoveIcon />
                    </button>
                  </div>
                ))}
              <input
                {...inputProps({
                  ...props,
                  placeholder: value.length ? "" : props.placeholder,
                  type: "text",
                  value: search,
                  onChange: (e) => {
                    setSearch(e.target.value);
                  },
                  onBlur: () => setSearch(""),
                  onFocus: () => setIsOpen(true),
                  className: "flex-1",
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
            selected={value}
            onSelect={(v) =>
              onChange?.(
                value.includes(v) ? value.filter((i) => i !== v) : [...value, v]
              )
            }
          />
        )}
      </div>
    </InputWrapper>
  );
}
