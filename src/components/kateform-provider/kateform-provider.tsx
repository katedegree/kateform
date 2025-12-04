import { useEffect } from "react";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type KateFormProviderProps = DeepPartial<{
  children: React.ReactNode;
  mode: {
    thema: "light" | "dark";
    input: "flat" | "bordered";
  };
  color: {
    light: {
      text: {
        label: string; // --kateform-color-label
        value: string; // --kateform-color-value
        error: string; // --kateform-color-error
      };
      background: {
        flat: string; // --kateform-color-flat
        flatHover: string; // --kateform-color-flat-hover
      };
      border: {
        bordered: string; // --kateform-color-bordered
        borderedHover: string; // --kateform-color-bordered-hover
      };
    };
    dark: {
      text: {
        label: string;
        value: string;
        error: string;
      };
      background: {
        flat: string;
        flatHover: string;
      };
      border: {
        bordered: string;
        borderedHover: string;
      };
    };
  };
  text: {
    md: string; // kateform-text-md
    sm: string; // kateform-text-sm
  };
  spacing: {
    "1": string; // kateform-spacing-1
    sm: string; // kateform-spacing-sm
    md: string; // kateform-spacing-md
    lg: string; // kateform-spacing-lg
  };
  radius: {
    input: string; // kateform-radius-input
    form: string; // kateform-radius-form
  };
}>;

export function KateFormProvider({
  children,
  mode,
  color,
  text,
  spacing,
  radius,
}: KateFormProviderProps) {
  const root = document.documentElement;

  const themaMode = mode?.thema;
  // TODO: Add input mode
  // const inputMode = mode?.input;

  const lightLabelColor = color?.light?.text?.label;
  const lightValueColor = color?.light?.text?.value;
  const lightErrorColor = color?.light?.text?.error;
  const lightFlatColor = color?.light?.background?.flat;
  const lightFlatHoverColor =
    color?.light?.background?.flatHover || lightFlatColor;
  const lightBorderedColor = color?.light?.border?.bordered;
  const lightBorderedHoverColor =
    color?.light?.border?.borderedHover || lightBorderedColor;

  const darkLabelColor = color?.dark?.text?.label;
  const darkValueColor = color?.dark?.text?.value;
  const darkErrorColor = color?.dark?.text?.error;
  const darkFlatColor = color?.dark?.background?.flat;
  const darkFlatHoverColor =
    color?.dark?.background?.flatHover || darkFlatColor;
  const darkBorderedColor = color?.dark?.border?.bordered;
  const darkBorderedHoverColor =
    color?.dark?.border?.borderedHover || darkBorderedColor;

  const mdText = text?.md;
  const smText = text?.sm;

  const spacing1 = spacing?.["1"];
  const spacingSm = spacing?.sm;
  const spacingMd = spacing?.md;
  const spacingLg = spacing?.lg;

  const radiusInput = radius?.input;
  const radiusForm = radius?.form;

  const setCSSVariables = (map: Record<string, string | undefined>) => {
    Object.entries(map).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value);
    });
  };

  useEffect(() => {
    themaMode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [themaMode]);

  useEffect(
    () =>
      setCSSVariables({
        "--kateform-color-light-label": lightLabelColor,
        "--kateform-color-light-value": lightValueColor,
        "--kateform-color-light-error": lightErrorColor,
        "--kateform-color-light-flat": lightFlatColor,
        "--kateform-color-light-flat-hover": lightFlatHoverColor,
        "--kateform-color-light-bordered": lightBorderedColor,
        "--kateform-color-light-bordered-hover": lightBorderedHoverColor,

        "--kateform-color-dark-label": darkLabelColor,
        "--kateform-color-dark-value": darkValueColor,
        "--kateform-color-dark-error": darkErrorColor,
        "--kateform-color-dark-flat": darkFlatColor,
        "--kateform-color-dark-flat-hover": darkFlatHoverColor,
        "--kateform-color-dark-bordered": darkBorderedColor,
        "--kateform-color-dark-bordered-hover": darkBorderedHoverColor,
      }),
    [color]
  );

  useEffect(
    () =>
      setCSSVariables({
        "--kateform-text-sm": smText,
        "--kateform-text-md": mdText,
      }),
    [text]
  );

  useEffect(
    () =>
      setCSSVariables({
        "--kateform-spacing-1": spacing1,
        "--kateform-spacing-sm": spacingSm,
        "--kateform-spacing-md": spacingMd,
        "--kateform-spacing-lg": spacingLg,
      }),
    [spacing]
  );

  useEffect(
    () =>
      setCSSVariables({
        "--kateform-radius-input": radiusInput,
        "--kateform-radius-form": radiusForm,
      }),
    [radius]
  );

  return <>{children}</>;
}
