"use client";

import { forwardRef, useState, useRef, useEffect, ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PanelProps {
  children?: ReactNode;
  className?: string;
  isResizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  direction?: "horizontal" | "vertical";
  motionProps?: MotionProps;
  [key: string]: any;
}

const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ 
    className, 
    children, 
    isResizable = false,
    minWidth = 200,
    maxWidth = 600,
    defaultWidth = 300,
    direction = "horizontal",
    motionProps,
    ...props 
  }, ref) => {
    const [width, setWidth] = useState(defaultWidth);
    const [isDragging, setIsDragging] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (!isResizable) return;
      
      const handleMouseDown = () => {
        setIsDragging(true);
        document.body.style.cursor = direction === "horizontal" ? "ew-resize" : "ns-resize";
      };
      
      const handleMouseUp = () => {
        if (isDragging) {
          setIsDragging(false);
          document.body.style.cursor = "";
        }
      };
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        if (direction === "horizontal") {
          const newWidth = Math.min(Math.max(e.clientX - (panelRef.current?.getBoundingClientRect().left || 0), minWidth), maxWidth);
          setWidth(newWidth);
        } else {
          const newHeight = Math.min(Math.max(e.clientY - (panelRef.current?.getBoundingClientRect().top || 0), minWidth), maxWidth);
          setWidth(newHeight);
        }
      };
      
      const dragHandle = dragRef.current;
      dragHandle?.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMouseMove);
      
      return () => {
        dragHandle?.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }, [isResizable, isDragging, minWidth, maxWidth, direction]);
    
    return (
      <motion.div
        ref={panelRef}
        className={cn(
          "relative bg-glass-200 backdrop-blur-lg border border-glass-300 shadow-glass rounded-2xl overflow-hidden",
          className
        )}
        style={{
          width: direction === "horizontal" && isResizable ? width : undefined,
          height: direction === "vertical" && isResizable ? width : undefined,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        {...motionProps}
        {...props}
      >
        {children}
        
        {isResizable && (
          <div
            ref={dragRef}
            className={cn(
              "absolute bg-glass-300 hover:bg-accent-primary/50 transition-colors",
              direction === "horizontal" 
                ? "cursor-ew-resize top-0 right-0 w-1 h-full" 
                : "cursor-ns-resize bottom-0 left-0 h-1 w-full"
            )}
          />
        )}
      </motion.div>
    );
  }
);

Panel.displayName = "Panel";

export { Panel };