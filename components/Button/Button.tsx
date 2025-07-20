"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-accent-primary text-white hover:bg-accent-primary/90",
        secondary: "bg-accent-secondary text-white hover:bg-accent-secondary/90",
        tertiary: "bg-accent-tertiary text-white hover:bg-accent-tertiary/90",
        ghost: "bg-transparent hover:bg-glass-100 text-white",
        glass: "bg-glass-200 backdrop-blur-lg border border-glass-300 text-white hover:bg-glass-300 shadow-glass",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };