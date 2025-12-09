import { motion } from "framer-motion";

interface SelectPopoverProps<T extends string | number> {
  ref: React.RefObject<HTMLDivElement | null>;
  options: { value: T; label: string }[] | undefined;
  value: T | null | undefined;
  onSelect: ((v: T) => void) | undefined;
}

export function SelectPopover<T extends string | number>({
  ref,
  options,
  value,
  onSelect,
}: SelectPopoverProps<T>) {
  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={{
        initial: {
          opacity: 0,
          transform: "scale(0.8)",
        },
        enter: {
          opacity: 1,
          transform: "scale(1)",
          transition: {
            type: "spring",
            bounce: 0,
            duration: 0.3,
          },
        },
        exit: {
          opacity: 0,
          transform: "scale(0.96)",
          transition: {
            type: "tween",
            ease: "easeOut",
            duration: 0.15,
          },
        },
      }}
      className="fixed z-100 p-sm rounded-input bg-popover border border-popover-hover overflow-y-auto shadow shadow-popover-hover no-scrollbar"
    >
      {options?.map((option) => (
        <div
          key={option.value}
          className="flex justify-between items-center text-option hover:bg-popover-hover p-md rounded-[calc(var(--radius-input)_-_var(--spacing-sm))]"
          onClick={() => onSelect?.(option.value)}
        >
          <p>{option.label}</p>
          {option.value === value && (
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
              className="w-[1lh] h-[1lh]"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </div>
      ))}
    </motion.div>
  );
}
