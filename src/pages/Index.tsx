import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TradingSidebar } from "@/components/TradingSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm a demo AI assistant. In production, I would analyze your query and provide insights about stocks, market data, news, and trading recommendations using real-time data and advanced AI models.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiResponse]);
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
