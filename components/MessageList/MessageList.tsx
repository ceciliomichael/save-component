"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatBubble, ChatBubbleProps } from "./ChatBubble";
import { cn } from "@/lib/utils";

export interface Message extends Omit<ChatBubbleProps, 'children' | 'motionProps' | 'className'> {
  id: string;
}

export interface MessageListProps {
  messages: Message[];
  className?: string;
}

const MessageList = ({ messages, className }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className={cn("w-full overflow-y-auto preview-scrollbar space-y-4 py-2 pr-4", className)}
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            {...msg}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

MessageList.displayName = "MessageList";

export { MessageList };