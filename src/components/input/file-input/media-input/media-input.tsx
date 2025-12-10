"use client";

import { useState } from "react";
import {
  InputWrapper,
  MediaInputLabel,
  MediaInputPreview,
} from "@kateform/internal/components";
import { useStore } from "@kateform/internal/store";

export interface MediaInputProps {
  id: string;
  ref?: React.RefObject<HTMLInputElement | null>;
  label?: string;
  placeholder?: string;
  size?: number;
  url?: string | null | undefined;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  errorMessage?: string;
  onReadOnly?: () => void;
  onChange?: {
    upload: (file: File) => Promise<void>;
    remove: () => void;
  };
  spinner?: React.ReactNode;
}

export function MediaInput({
  id,
  ref,
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  size = 240,
  placeholder,
  url,
  onChange,
  spinner,
}: MediaInputProps) {
  const [uploadingUrl, setUploadingUrl] = useState<string>();
  const { setErrorMessage } = useStore();

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
          ref={ref}
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
            onChange?.upload(file).finally(() => {
              setUploadingUrl(undefined);
            });
          }}
        />
        {url || uploadingUrl ? (
          <MediaInputPreview
            size={size}
            url={uploadingUrl || url || undefined}
            isUploading={!!uploadingUrl}
            onRemove={onChange?.remove}
            spinner={spinner}
          />
        ) : (
          <MediaInputLabel id={id} size={size} placeholder={placeholder} />
        )}
      </InputWrapper>
    </div>
  );
}
