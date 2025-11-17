import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TradingSidebar } from "@/components/TradingSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2 } from "lucide-react";

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
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI trading assistant. Ask me about stocks, market trends, portfolio analysis, or any trading-related questions.",
      timestamp: "Just now",
    },
  ]);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
                title: "Tesla Announces Record Q4 Deliveries",
                source: "Reuters",
                timestamp: "2 hours ago",
                sentiment: "positive",
                impact: "high",
                summary: "Tesla reported record-breaking deliveries in Q4, exceeding analyst expectations by 15%. This strong performance indicates robust demand and efficient production scaling.",
                url: "#"
              },
              {
                id: "2",
                title: "New Gigafactory Construction Begins in Southeast Asia",
                source: "Bloomberg",
                timestamp: "5 hours ago",
                sentiment: "positive",
                impact: "medium",
                summary: "Tesla breaks ground on new manufacturing facility, expected to increase production capacity by 20% and reduce shipping costs to Asian markets.",
                url: "#"
              },
              {
                id: "3",
                title: "Regulatory Concerns Over Autopilot Features",
                source: "Financial Times",
                timestamp: "1 day ago",
                sentiment: "negative",
                impact: "medium",
                summary: "Federal regulators announce expanded investigation into Tesla's autonomous driving features following recent incidents. May impact future rollout plans.",
                url: "#"
              },
              {
                id: "4",
                title: "Major Investment in Battery Technology",
                source: "TechCrunch",
                timestamp: "2 days ago",
                sentiment: "positive",
                impact: "high",
                summary: "Tesla unveils breakthrough in battery efficiency, promising 40% cost reduction and extended vehicle range. Industry experts call it a 'game changer'.",
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
          content: "I'm analyzing market data for your query. I can help you with stock prices, news analysis, portfolio recommendations, and market trends. Try asking about specific stocks or request the latest news!",
          timestamp: "Just now",
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    }, 1000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background-secondary to-background">
        <TradingSidebar onSignOut={handleSignOut} userEmail={session.user.email || ""} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border/50 glass-effect p-4 flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h1 className="text-lg font-semibold gradient-text">AI Trading Assistant</h1>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                  news={message.news}
                  chart={message.chart}
                />
              ))}
            </div>
          </ScrollArea>

          <ChatInput onSend={handleSendMessage} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
