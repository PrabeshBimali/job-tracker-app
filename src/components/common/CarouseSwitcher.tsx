import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CarouselSwitcherProps {
  items: readonly string[];
  selected: number;
  onChange: (index: number) => void;
}

export default function CarouselSwitcher({ items, selected, onChange }: CarouselSwitcherProps) {
  const [direction, setDirection] = useState<1 | -1>(1);

  function previous() {
    setDirection(-1);
    onChange((selected - 1 + items.length) % items.length);
  }

  function next() {
    setDirection(1);
    onChange((selected + 1) % items.length);
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={previous}
        className="cursor-pointer rounded border border-secondary-color p-1 transition-colors hover:bg-background-color"
      >
        <ChevronLeft
          size={16}
          className="text-text-color"
        />
      </button>

      <div className="relative h-6 lg:w-32 md:w-24 sm:w-22 w-22 overflow-hidden">
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="sync"
        >
          <motion.div
            key={selected}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.22,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center font-medium text-text-color"
          >
            {items[selected]}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={next}
        className="cursor-pointer rounded border border-secondary-color p-1 transition-colors hover:bg-background-color"
      >
        <ChevronRight
          size={16}
          className="text-text-color"
        />
      </button>
    </div>
  );
}