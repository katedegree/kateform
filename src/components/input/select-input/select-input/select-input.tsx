"use client";

import { InputWrapper, BaseTextInput } from "@internal/components";
import { cn } from "@internal/utils";
import { useState } from "react";
import { motion } from "framer-motion";

export interface SelectInputProps<T extends string | number>
  extends Omit<
    React.ComponentProps<"input">,
    "type" | "id" | "onChange" | "value" | "onSelect"
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <InputWrapper
      id={props.id}
      label={label}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      errorMessage={errorMessage}
      onReadOnly={onReadOnly}
    >
      <div className="relative">
        {isOpen && (
          <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={{
              initial: {
                opacity: 0,
                transform: "scale(0.8)",
              },
              enter: {
                opacity: 1,
                transform: "scale(1)",
                transition: {
                  type: "spring",
                  bounce: 0,
                  duration: 0.3,
                },
              },
              exit: {
                opacity: 0,
                transform: "scale(0.96)",
                transition: {
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.15,
                },
              },
            }}
            style={{
              maxHeight: `${popoverHeight}px`,
            }}
            className="absolute top-[calc(100%_+_var(--spacing-sm))] w-full p-sm rounded-input bg-popover border border-popover-hover overflow-auto shadow shadow-popover-hover no-scrollbar"
          >
            {options?.map((option) => (
              <div
                className="flex justify-between items-center text-option hover:bg-popover-hover p-md rounded-[calc(var(--radius-input)_-_var(--spacing-sm))]"
                onClick={() => {
                  setIsOpen(false);
                  onSelect?.(option.value);
                }}
              >
                <p>{option.label}</p>
                {option.value === value && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="w-[1lh] h-[1lh]"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </div>
            ))}
          </motion.div>
        )}
        <BaseTextInput
          {...props}
          startContent={startContent}
          endContent={endContent}
          actionContent={
            <div
              className={cn(
                "transition duration-75 ease-in-out",
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
      </div>
    </InputWrapper>
  );
}
