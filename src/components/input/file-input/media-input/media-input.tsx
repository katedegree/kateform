"use client";

import { useEffect, useState } from "react";
import {
  BaseMediaInput,
  InputWrapper,
  MediaInputLabel,
} from "@kateform/internal/components";
import { useStore } from "@kateform/internal/store";

export interface MediaInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  size?: number;
  url?: string | null | undefined;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  errorMessage?: string;
  onReadOnly?: () => void;
  onUpload?: (file: File) => Promise<void>;
  onRemove?: () => void;
  spinner?: React.ReactNode;
}

export function MediaInput({
  id,
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  size = 240,
  placeholder,
  url,
  onUpload = async () => {},
  onRemove = () => {},
  spinner,
}: MediaInputProps) {
  const [localSize, setLocalSize] = useState<number>(size);
  const [currentUrl, setCurrentUrl] = useState<string>();
  const [uploadingUrl, setUploadingUrl] = useState<string>();
  const { setErrorMessage } = useStore();

  useEffect(() => {
    setLocalSize(size >= 120 ? size : 120);
  }, [size]);
  useEffect(() => {
    setCurrentUrl(url || undefined);
  }, [url]);

  return (
    <div className="w-fit">
      <InputWrapper
        id={id}
        label={label}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        errorMessage={errorMessage}
        onReadOnly={onReadOnly}
      >
        <input
          id={id}
          type="file"
          className="hidden"
          onChange={(e) => {
            setErrorMessage(id, "");
            const file = e.currentTarget.files?.[0];
            if (!file) return;

            const baseUrl = URL.createObjectURL(file);
            const fragment = file.type.startsWith("image") ? "#.png" : "#.mp4";
            const url = baseUrl + fragment;

            setUploadingUrl(url);
            onUpload(file).finally(() => {
              setUploadingUrl(undefined);
            });
          }}
        />
        <label htmlFor={id}>
          {currentUrl || uploadingUrl ? (
            <BaseMediaInput
              size={localSize}
              url={currentUrl || uploadingUrl}
              isUploading={!!uploadingUrl}
              onRemove={onRemove}
              spinner={spinner}
            />
          ) : (
            <MediaInputLabel size={localSize} placeholder={placeholder} />
          )}
        </label>
      </InputWrapper>
    </div>
  );
}
