"use client";

import { useStore } from "../store";
import { forwardRef, useEffect } from "react";
import { inputProps } from "@kateform/internal/utils";

export interface InputProps extends Omit<React.ComponentProps<"input">, "id"> {
  id: string;
  startContent: React.ReactNode;
  endContent: React.ReactNode;
  actionContent?: React.ReactNode;
  renderInput?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ startContent, endContent, actionContent, renderInput, ...props }, ref) => {
    const { setErrorMessage } = useStore();

    useEffect(() => {
      setErrorMessage(props.id, "");
    }, [props.value]);

    return (
      <div className="rounded-input text-value bg-flat hover:bg-flat-hover overflow-hidden focus-within:bg-flat-hover px-lg flex items-center gap-md">
        {startContent && <div className="text-placeholder">{startContent}</div>}
        <div className="w-full py-md">
          {renderInput ? (
            renderInput
          ) : (
            <input {...inputProps(props)} ref={ref} />
          )}
        </div>
        {endContent && <div className="text-placeholder">{endContent}</div>}
        {actionContent}
      </div>
    );
  }
);
