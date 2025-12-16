import { motion } from "framer-motion";
import { SelectCheckIcon } from "./icons/select-check-icon";

interface SelectPopoverProps<T extends string | number> {
  popoverRef?: React.RefObject<HTMLDivElement | null>;
  options: { value: T; label: string }[] | undefined;
  selected: T[];
  onSelect: ((v: T) => void) | undefined;
}

export function SelectPopover<T extends string | number>({
  popoverRef,
  options,
  selected,
  onSelect,
}: SelectPopoverProps<T>) {
  return (
    <motion.div
      ref={popoverRef}
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
          {selected.includes(option.value) && <SelectCheckIcon />}
        </div>
      ))}
    </motion.div>
  );
}
