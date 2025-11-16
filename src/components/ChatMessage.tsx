import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 p-6 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn("flex flex-col gap-2 max-w-[80%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 glass-effect shadow-lg",
            isUser
              ? "bg-primary/10 border-primary/20"
              : "bg-card border-border/50"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground px-2">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          <User className="h-5 w-5 text-foreground" />
        </div>
      )}
    </div>
  );
}
