import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";

// Utility function for class name merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "active-tab",
  onChange,
  defaultSelected = null,
}) {
  const [selected, setSelected] = useState(defaultSelected);
  const outsideClickRef = useRef(null);

  useEffect(() => {
    if (defaultSelected !== null) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected]);

  useOnClickOutside(outsideClickRef, () => {
    if (selected !== null) {
      // Don't reset the selected state when clicking outside
      // This keeps the current tab expanded
    }
  });

  const handleSelect = (index) => {
    setSelected(index);
    onChange?.(index);
  };

  const Separator = () => (
    <div className="tab-separator" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn("expandable-tabs", className)}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={selected === index}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "tab-button",
              selected === index
                ? cn("tab-selected", activeColor)
                : "tab-unselected"
            )}
          >
            <Icon size={20} />
            <AnimatePresence initial={false}>
              {selected === index && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="tab-text"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
} 