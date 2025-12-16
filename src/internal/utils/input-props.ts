import { cn } from "./cn";

export const inputProps = (props: React.ComponentProps<"input">) => ({
  ...props,
  autoComplete: "off",
  className: cn(
    "w-full outline-none autofill:bg-transparent bg-clip-text",
    "placeholder:text-placeholder caret-value [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-value)]",
    props.className
  ),
});
