import { useEffect } from "react";
import { cn } from "../utils";
import { useStore } from "../store";

export interface InputWrapperProps {
  id: string;
  label: string | undefined;
  children: React.ReactNode;
  onReadOnly: (() => void) | undefined;
  isDisabled: boolean;
  isReadOnly: boolean;
  errorMessage: string | undefined;
}

export function InputWrapper({
  id,
  label,
  children,
  onReadOnly,
  isDisabled,
  isReadOnly,
  errorMessage,
}: InputWrapperProps) {
  const { errorMessages, setErrorMessage } = useStore();

  useEffect(() => {
    setErrorMessage(id, errorMessage || "");
  }, [errorMessage]);

  return (
    <div>
      <label
        className="block pl-sm pb-sm font-bold text-label text-sm"
        htmlFor={isReadOnly || isDisabled ? undefined : id}
      >
        {label}
      </label>

      <div
        className={cn(
          "relative rounded-input outline-error",
          errorMessages[id] && "outline outline-offset-1",
          isDisabled && "opacity-80"
        )}
      >
        {children}
        {isReadOnly && (
          <div className="absolute inset-[0]" onClick={onReadOnly} />
        )}
        {isDisabled && (
          <div className="absolute inset-[0] hover:cursor-not-allowed" />
        )}
      </div>
      <p
        className={cn(
          "h-[1lh] pt-1 text-sm text-error",
          !errorMessages[id] && "opacity-0"
        )}
      >
        {errorMessages[id]}
      </p>
    </div>
  );
}
