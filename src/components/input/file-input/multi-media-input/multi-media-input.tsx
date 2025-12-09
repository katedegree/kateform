"use client";

import { useEffect, useState } from "react";
import {
  BaseMediaInput,
  InputWrapper,
  MediaInputLabel,
} from "@kateform/internal/components";
import { useStore } from "@kateform/internal/store";

export interface MultiMediaInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  size?: number;
  urls?: string[];
  isDisabled?: boolean;
  isReadOnly?: boolean;
  errorMessage?: string;
  onReadOnly?: () => void;
  onUpload?: (file: File) => Promise<void>;
  onRemove?: (url: string) => void;
  spinner?: React.ReactNode;
}

export function MultiMediaInput({
  id,
  label,
  isDisabled = false,
  isReadOnly = false,
  onReadOnly,
  errorMessage,
  size = 240,
  placeholder,
  urls,
  onUpload = async () => {},
  onRemove = () => {},
  spinner,
}: MultiMediaInputProps) {
  const [currentUrls, setCurrentUrls] = useState<string[]>([]);
  const [uploadingUrls, setUploadingUrls] = useState<string[]>([]);
  const { setErrorMessage } = useStore();

  useEffect(() => {
    setCurrentUrls(urls || []);
  }, [urls]);

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

            setUploadingUrls([url, ...uploadingUrls]);
            onUpload(file).finally(() => {
              setUploadingUrls(uploadingUrls.filter((u) => u !== url));
            });
          }}
        />
        <div className="flex [&>*]:flex-shrink-0 [&>*]:overflow-hidden gap-md">
          <label htmlFor={id} className="block">
            <MediaInputLabel size={size} placeholder={placeholder} />
          </label>
          {uploadingUrls.map((url) => (
            <BaseMediaInput
              key={url}
              size={size}
              url={url}
              isUploading
              spinner={spinner}
            />
          ))}
          {currentUrls.map((url) => (
            <BaseMediaInput
              key={url}
              size={size}
              url={url}
              onRemove={() => onRemove(url)}
              spinner={spinner}
            />
          ))}
        </div>
      </InputWrapper>
    </div>
  );
}
