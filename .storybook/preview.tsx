import type { Preview } from "@storybook/react-vite";
import "../src/components/globals.css";
import { KateFormProvider, ToastProvider } from "../src/components";

export const globalTypes: Preview["globalTypes"] = {
  theme: {
    defaultValue: "light",
    toolbar: {
      icon: "sun",
      items: ["light", "dark"],
      dynamicTitle: true,
    },
  },
};

type ToastType = "success" | "error";
interface ToastProps {
  type: ToastType;
  message: string;
}
const Toast = ({ type, message }: ToastProps) => {
  return (
    <div className="bg-flat rounded-input border border-flat-hover w-[300px] py-lg flex justify-center">
      {type}
      {": "}
      {message}
    </div>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === "dark";
      document.documentElement.style.backgroundColor = isDark
        ? "oklch(13% 0.028 261.692)"
        : "oklch(98.5% 0.002 247.839)";
      return (
        <KateFormProvider mode={{ thema: isDark ? "dark" : "light" }}>
          <ToastProvider<ToastType>
            component={Toast}
            placement="bottom-right"
          />
          {Story()}
        </KateFormProvider>
      );
    },
  ],
};

export default preview;
