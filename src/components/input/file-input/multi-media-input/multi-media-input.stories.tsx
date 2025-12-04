import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultiMediaInput } from "./multi-media-input";

const meta = {
  component: MultiMediaInput,
  title: "Input/FileInput/MultiMediaInput",
} satisfies Meta<typeof MultiMediaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [urls, setUrls] = useState<string[]>([]);
    return (
      <MultiMediaInput
        {...args}
        urls={urls}
        onUpload={async (file) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const baseUrl = URL.createObjectURL(file);
          const fragment = file.type.startsWith("image") ? "#.png" : "#.mp4";
          const url = baseUrl + fragment;
          setUrls([url, ...urls]);
        }}
        onRemove={(url) => {
          setUrls(urls.filter((u) => u !== url));
        }}
      />
    );
  },
  args: {
    label: "ファイル",
    id: "medias",
    placeholder: "ファイルを選択してください",
    isDisabled: false,
    isReadOnly: false,
    onReadOnly: () => console.log("readonly"),
  },
};
