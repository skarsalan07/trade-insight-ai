import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewsCarousel } from "./NewsCarousel";
import { StockChart } from "./StockChart";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: "positive" | "negative" | "neutral";
  impact: "high" | "medium" | "low";
  summary: string;
  url?: string;
}

interface ChartData {
  ticker: string;
  data: Array<{ time: string; value: number }>;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content?: string;
  timestamp?: string;
  news?: {
    ticker: string;
    items: NewsItem[];
  };
  chart?: ChartData;
}

export function ChatMessage({ role, content, timestamp, news, chart }: ChatMessageProps) {
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
      
      <div className={cn("flex flex-col gap-2", isUser ? "max-w-[80%] items-end" : "max-w-full")}>
        {content && (
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
        )}
        
        {chart && !isUser && (
          <div className="w-full max-w-3xl">
            <StockChart
              ticker={chart.ticker}
              data={chart.data}
              currentPrice={chart.currentPrice}
              change={chart.change}
              changePercent={chart.changePercent}
            />
          </div>
        )}

        {news && !isUser && (
          <div className="w-full max-w-5xl">
            <NewsCarousel news={news.items} ticker={news.ticker} />
          </div>
        )}
        
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
