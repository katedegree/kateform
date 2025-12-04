import { placeholderClassName } from "../classNames";
import { cn } from "../utils";

interface MediaInputLabelProps {
  size: number;
  placeholder: string | undefined;
}

export function MediaInputLabel({ size, placeholder }: MediaInputLabelProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-md h-auto aspect-square text-value bg-flat hover:bg-flat-hover rounded-input",
        placeholderClassName
      )}
      style={{
        width: size,
      }}
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
        className="w-[42px] h-[42px]"
      >
        <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
        <path d="m14 19.5 3-3 3 3" />
        <path d="M17 22v-5.5" />
        <circle cx="9" cy="9" r="2" />
      </svg>
      {placeholder && (
        <span className="text-sm whitespace-nowrap">{placeholder}</span>
      )}
    </div>
  );
}
