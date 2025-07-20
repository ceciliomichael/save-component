"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Clipboard } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={cn("relative group", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {isCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          borderRadius: "0.75rem",
          padding: "1.5rem",
          backgroundColor: "rgba(10, 10, 30, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
        codeTagProps={{
          className: "text-sm",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}