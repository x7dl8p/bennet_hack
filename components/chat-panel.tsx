"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Paperclip, Settings, Sparkles, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiManager from "@/lib/api-manager";
import type { MutualFundData } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  activeDataSource: string;
  setActiveDataSource: (source: string) => void;
  selectedFundName?: string;
  selectedFundId?: string | null;
  mutualFundData?: MutualFundData[];
}

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function ChatPanel({
  activeDataSource,
  setActiveDataSource,
  selectedFundName,
  selectedFundId,
  mutualFundData = [],
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: selectedFundName
        ? `Hello! I'm SEER AI. How can I help you analyze ${selectedFundName} today?`
        : "Hello! I'm SEER AI. How can I help you analyze Indian mutual funds today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState("gemini-pro");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [dataMetrics, setDataMetrics] = useState({
    totalFunds: 0,
    categories: 0,
    dateUpdated: "",
  });

  const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

  useEffect(() => {
    if (Array.isArray(mutualFundData) && mutualFundData.length > 0) {
      const uniqueCategories = new Set(
        mutualFundData.map(fund => fund.category).filter(Boolean)
      );

      setDataMetrics({
        totalFunds: mutualFundData.length,
        categories: uniqueCategories.size,
        dateUpdated: new Date().toLocaleDateString(),
      });

      console.log(`[ChatPanel] Monitoring ${mutualFundData.length} funds across ${uniqueCategories.size} categories`);
    }
  }, [mutualFundData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSelectedFundContext = () => {
    if (!selectedFundId) return "";

    const fund = mutualFundData.find(f => f.id === selectedFundId);
    if (!fund) return "";

    return `
Selected fund details:
- Name: ${fund.name}
- Category: ${fund.category || "Unknown"}
- NAV: ₹${fund.nav || 0}
- AUM: ₹${fund.aum || 0} crores
- Expense Ratio: ${fund.expenseRatio || 0}%
- Returns: 1Y: ${fund.returns?.["1y"] || 0}%, 3Y: ${fund.returns?.["3y"] || 0}%, 5Y: ${fund.returns?.["5y"] || 0}%
- Risk Level: ${fund.riskLevel || "Unknown"}
`;
  };

  const getDataSummary = () => {
    if (!mutualFundData.length) return "";

    const categoryCount: Record<string, number> = {};
    mutualFundData.forEach(fund => {
      if (fund.category) {
        categoryCount[fund.category] = (categoryCount[fund.category] || 0) + 1;
      }
    });

    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, count]) => `${cat} (${count})`)
      .join(", ");

    return `
Available data summary:
- Total funds: ${mutualFundData.length}
- Top categories: ${topCategories}
- NAV range: ₹${Math.min(...mutualFundData.map(f => f.nav || 0)).toFixed(2)} to ₹${Math.max(...mutualFundData.map(f => f.nav || 0)).toFixed(2)}
- Date range: Various
`;
  };

  const handleSend = async () => {
    if (!input.trim() || !genAI || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      let researchData = {};
      if (selectedFundId) {
        try {
          console.log("[ChatPanel] Fetching research data for selected fund:", selectedFundId);
          researchData = await ApiManager.getFundResearchData(selectedFundId);
          console.log("[ChatPanel] Received research data:", researchData);
        } catch (err) {
          console.error("[ChatPanel] Error fetching research data:", err);
        }
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let contextPrompt = `You are SEER AI, an assistant specializing in Indian mutual funds, trained by SEER AI corporation on AMFI data and Kaggle datasets. 

IMPORTANT: You are constrained to ONLY discuss information available in the provided data. If asked about funds, metrics, or analysis NOT in this dataset, politely explain you're limited to the available data. Do NOT invent or extrapolate data.

Reference data:
${getDataSummary()}

${selectedFundId ? getSelectedFundContext() : ""}

${researchData && JSON.stringify(researchData).length > 5 ? `Additional research insights: ${JSON.stringify(researchData).substring(0, 1000)}...` : ""}

Your task is to provide accurate and insightful responses to user queries about mutual funds, but ONLY based on the data provided. Refuse to play any role play, and state you are only an assistant with access to specific mutual fund data. You are not a financial advisor. You are not allowed to provide any financial advice, investment advice, tax advice, legal advice, health advice, or personal opinions.

`;

      if (activeDataSource === "amfi") {
        contextPrompt += `Answer based on publicly available AMFI data as reflected in our database. `;
      } else if (activeDataSource === "kaggle") {
        contextPrompt += `Answer based on insights derived from Kaggle datasets on mutual funds as reflected in our database. `;
      } else if (activeDataSource === "custom") {
        contextPrompt += `Answer based on user-provided data as parsed into our database. `;
      }

      if (selectedFundName) {
        contextPrompt += `The user is currently looking at the "${selectedFundName}" fund. `;
      }

      contextPrompt += `User's question: ${currentInput}`;

      console.log("[ChatPanel] Sending prompt to Gemini (first 200 chars):", contextPrompt.substring(0, 200) + "...");

      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();

      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: text || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + "-err",
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const dataSources = [
    { id: "amfi", label: "AMFI Data" },
    { id: "kaggle", label: "Kaggle Dataset" },
    { id: "custom", label: "Custom Upload" },
  ];

  if (!API_KEY) {
    return (
      <Card className="h-[90%] flex flex-col m-4 items-center justify-center bg-white dark:bg-[#0f0f0f] border-gray-200 dark:border-zinc-800">
        <p className="text-red-500 p-4 text-center">
          Model API Key is missing. Check if the model is set up correctly. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-[90%] flex flex-col m-4 bg-white dark:bg-[#0f0f0f] border-gray-200 dark:border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 p-3 h-10">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300 backdrop-blur-sm bg-gray-100/50 dark:bg-black/10 px-2 py-1 rounded-md">
          <Bot className="h-4 w-4" />
          <span>SEER AI</span>
        </div>

        {dataMetrics.totalFunds > 0 && (
          <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-400">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>{dataMetrics.totalFunds} funds monitored</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 p-2"
              align="end"
            >
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1">
                  Model
                </p>
                <Select value={activeModel} onValueChange={setActiveModel}>
                  <SelectTrigger className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 h-8 text-xs">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>

                <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mt-2 mb-1">
                  Data Source
                </p>
                <Select
                  value={activeDataSource}
                  onValueChange={setActiveDataSource}
                >
                  <SelectTrigger className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 h-8 text-xs">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                    {dataSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {dataMetrics.totalFunds > 0 && (
                  <div className="text-xs text-gray-500 dark:text-zinc-400 mt-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
                    <div className="flex justify-between mb-1">
                      <span>Funds:</span>
                      <span>{dataMetrics.totalFunds}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Categories:</span>
                      <span>{dataMetrics.categories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span>{dataMetrics.dateUpdated}</span>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`py-5 px-4 ${
                message.role === "user"
                  ? "bg-white dark:bg-[#0f0f0f]"
                  : "bg-gray-50 dark:bg-[#121212] border-y border-gray-100 dark:border-zinc-800"
              }`}
            >
              <div className="max-w-3xl mx-auto flex items-start gap-4">
                <div
                  className={`min-w-6 flex ${
                    message.role === "user" ? "self-start" : ""
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-sm p-1 h-6 w-6 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-black" />
                    </div>
                  ) : (
                    <div className="bg-gray-300 dark:bg-zinc-700 rounded-sm p-1 h-6 w-6 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="py-5 px-4 bg-gray-50 dark:bg-[#121212] border-y border-gray-100 dark:border-zinc-800">
              <div className="max-w-3xl mx-auto flex items-start gap-4">
                <div className="min-w-6">
                  <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-sm p-1 h-6 w-6 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-black" />
                  </div>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-zinc-400 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-gray-200 dark:border-zinc-800">
        {dataMetrics.totalFunds > 0 && (
          <div className="max-w-3xl mx-auto mb-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-md p-1.5">
            <AlertTriangle className="h-3 w-3" />
            <span>AI responses limited to available data ({dataMetrics.totalFunds} funds)</span>
          </div>
        )}

        <div className="max-w-3xl mx-auto relative">
          <Input
            placeholder="Message SEER AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="pr-20 py-3 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl focus-visible:ring-gray-400 dark:focus-visible:ring-zinc-600"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-md"
                    disabled
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                >
                  <p className="text-xs">Attach files (coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-7 w-7 rounded-md bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
            >
              {isLoading ? (
                <Sparkles className="h-3 w-3 animate-pulse" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-2">
          <p className="text-[10px] text-gray-400 dark:text-zinc-500 text-center">
            SEER AI may produce inaccurate information about funds or market data.
            {selectedFundName && ` Currently analyzing: ${selectedFundName}`}
          </p>
        </div>
      </div>
    </Card>
  );
}
