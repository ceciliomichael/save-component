"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "tertiary" | "gradient";
  animate?: boolean;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    showValue = false, 
    size = "md", 
    variant = "default",
    animate = true,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeStyles = {
      sm: "h-1",
      md: "h-2",
      lg: "h-4",
    };
    
    const variantStyles = {
      default: "bg-accent-primary",
      secondary: "bg-accent-secondary",
      tertiary: "bg-accent-tertiary",
      gradient: "bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary",
    };
    
    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        <div className="flex items-center mb-1">
          {showValue && (
            <div className="text-sm text-white/70 ml-auto">
              {Math.round(percentage)}%
            </div>
          )}
        </div>
        
        <div className={cn("w-full bg-glass-200 rounded-full overflow-hidden", sizeStyles[size])}>
          <motion.div
            className={cn("h-full rounded-full", variantStyles[variant])}
            style={{ width: `${percentage}%` }}
            initial={animate ? { width: 0 } : false}
            animate={animate ? { width: `${percentage}%` } : false}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };