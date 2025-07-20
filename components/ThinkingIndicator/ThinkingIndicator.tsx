"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const dotVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: [0, -10, 0],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export interface ThinkingIndicatorProps {
  className?: string;
  count?: number;
}

const ThinkingIndicator = ({ className, count = 3 }: ThinkingIndicatorProps) => {
  return (
    <motion.div
      className={cn("flex items-center justify-center space-x-2 p-4", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="h-3 w-3 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary"
          variants={dotVariants}
          style={{
            transitionDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </motion.div>
  );
};

ThinkingIndicator.displayName = "ThinkingIndicator";

export { ThinkingIndicator }; 