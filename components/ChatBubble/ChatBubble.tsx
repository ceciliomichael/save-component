"use client";

import { forwardRef, ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface ChatBubbleProps {
  children?: ReactNode;
  className?: string;
  message: string;
  sender: "user" | "ai";
  timestamp?: string;
  isLoading?: boolean;
  motionProps?: MotionProps;
  [key: string]: any;
}

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, message, sender, timestamp, isLoading = false, motionProps, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "flex w-full mb-2",
          sender === "user" ? "justify-end" : "justify-start",
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...motionProps}
        {...props}
      >
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-3 shadow-glass",
            sender === "user"
              ? "bg-accent-primary/20 border border-accent-primary/30"
              : "bg-accent-secondary/20 border border-accent-secondary/30"
          )}
        >
          <div className="prose prose-invert max-w-none prose-p:my-0 prose-ul:my-0 prose-ol:my-0">
            {isLoading ? (
              <div className="flex space-x-2 items-center h-6">
                <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse delay-150" />
                <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse delay-300" />
              </div>
            ) : (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="text-white"
              >
                {message}
              </ReactMarkdown>
            )}
          </div>
          
          {timestamp && (
            <div className="mt-2 text-xs text-white/50">{timestamp}</div>
          )}
        </div>
      </motion.div>
    );
  }
);

ChatBubble.displayName = "ChatBubble";

export { ChatBubble };