import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TradingSidebar } from "@/components/TradingSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

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

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  timestamp: string;
  news?: {
    ticker: string;
    items: NewsItem[];
  };
  chart?: ChartData;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI trading assistant. Ask me about stocks, market trends, portfolio analysis, or any trading-related questions.",
      timestamp: "Just now",
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate AI response with chart and/or news
    setTimeout(() => {
      const lowerContent = content.toLowerCase();
      const hasNewsQuery = lowerContent.includes("news") || lowerContent.includes("latest");
      const hasChartQuery = lowerContent.includes("chart") || lowerContent.includes("price") || lowerContent.includes("stock");
      
      if (hasChartQuery) {
        // Generate dummy chart data
        const generateChartData = () => {
          const data = [];
          const basePrice = 250;
          const now = Math.floor(Date.now() / 1000);
          const oneDay = 86400;
          
          for (let i = 30; i >= 0; i--) {
            const time = now - (i * oneDay);
            const randomChange = (Math.random() - 0.5) * 20;
            const value = basePrice + randomChange + (30 - i) * 2;
            data.push({
              time: new Date(time * 1000).toISOString().split('T')[0],
              value: parseFloat(value.toFixed(2))
            });
          }
          return data;
        };

        const chartData = generateChartData();
        const currentPrice = chartData[chartData.length - 1].value;
        const previousPrice = chartData[chartData.length - 2].value;
        const change = currentPrice - previousPrice;
        const changePercent = (change / previousPrice) * 100;

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here's the latest price chart for TSLA. The stock is currently showing strong momentum with increased trading volume.",
          timestamp: "Just now",
          chart: {
            ticker: "TSLA",
            data: chartData,
            currentPrice,
            change,
            changePercent
          }
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else if (hasNewsQuery) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the latest news articles for TSLA with sentiment analysis and potential market impact:",
          timestamp: "Just now",
          news: {
            ticker: "TSLA",
            items: [
              {
                id: "1",
                title: "Tesla Announces Record Q4 Deliveries, Beating Analyst Expectations",
                source: "Bloomberg",
                timestamp: "2 hours ago",
                sentiment: "positive",
                impact: "high",
                summary: "Tesla reported record quarterly deliveries, surpassing Wall Street estimates. Strong demand in China and Europe drove the numbers higher, signaling robust growth momentum.",
                url: "#"
              },
              {
                id: "2",
                title: "Musk's Twitter Acquisition Raises Concerns About Tesla Focus",
                source: "Reuters",
                timestamp: "5 hours ago",
                sentiment: "negative",
                impact: "medium",
                summary: "Investors express concerns about Elon Musk's divided attention between Tesla and Twitter operations. Some analysts downgrade ratings citing leadership distraction risks.",
                url: "#"
              },
              {
                id: "3",
                title: "Tesla Opens New Gigafactory in Texas, Production Ramps Up",
                source: "CNBC",
                timestamp: "8 hours ago",
                sentiment: "positive",
                impact: "high",
                summary: "The new Austin facility begins production of Cybertruck models. The expansion is expected to significantly increase manufacturing capacity and reduce delivery times.",
                url: "#"
              },
              {
                id: "4",
                title: "EV Market Competition Intensifies as Traditional Automakers Launch New Models",
                source: "Wall Street Journal",
                timestamp: "12 hours ago",
                sentiment: "neutral",
                impact: "medium",
                summary: "Ford, GM, and Volkswagen unveil competitive electric vehicle lineups. Market analysts suggest increased competition could pressure Tesla's market share.",
                url: "#"
              },
              {
                id: "5",
                title: "Tesla Stock Sees Volatility Amid Federal Reserve Rate Decision",
                source: "Financial Times",
                timestamp: "1 day ago",
                sentiment: "neutral",
                impact: "low",
                summary: "Growth stocks including Tesla experience intraday volatility following Fed's interest rate announcement. Broader market sentiment affects tech and EV sectors.",
                url: "#"
              }
            ]
          }
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm a demo AI assistant. In production, I would analyze your query and provide insights about stocks, market data, news, and trading recommendations using real-time data and advanced AI models. Try asking about 'latest news for TSLA' to see the news carousel!",
          timestamp: "Just now",
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    }, 1000);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TradingSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border/50 glass-effect flex items-center px-6 gap-4">
            <SidebarTrigger className="hover:bg-sidebar-accent/50 transition-colors" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-glow" />
              <h1 className="text-lg font-semibold">AI Trading Assistant</h1>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="max-w-4xl mx-auto py-8">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4 py-20">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-glow">
                      <Sparkles className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold">Start a conversation</h2>
                    <p className="text-muted-foreground max-w-md">
                      Ask about stock analysis, market trends, portfolio optimization, or any trading-related questions.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                      news={message.news}
                      chart={message.chart}
                    />
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
