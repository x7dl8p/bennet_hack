"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Paperclip, Settings, Sparkles } from "lucide-react";
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
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  activeDataSource: string;
  setActiveDataSource: (source: string) => void;
}

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function ChatPanel({
  activeDataSource,
  setActiveDataSource,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm SEER AI powered by Gemini. How can I help you analyze Indian mutual funds today?, i am trained by SEER AI corporation on AMFI data and Kaggle datasets.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState("gemini-pro");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let contextPrompt = `You are SEER AI, an assistant specializing in Indian mutual funds. trained by SEER AI corporation on AMFI data and Kaggle datasets. Your task is to provide accurate and insightful responses to user queries about mutual funds. You have access to the following data sources: `;
      if (activeDataSource === "amfi") {
        contextPrompt += `Answer based on publicly available AMFI data. `;
      } else if (activeDataSource === "kaggle") {
        contextPrompt += `Answer based on insights derived from typical Kaggle datasets on mutual funds. `;
      } else if (activeDataSource === "custom") {
        contextPrompt += `Answer based on user-provided data (assume relevant context is given in the prompt). `;
      }
      contextPrompt += `User's question: ${currentInput}`;

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
          Gemini API Key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.
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
            SEER AI may produce inaccurate information about funds or market
            data.
          </p>
        </div>
      </div>
    </Card>
  );
}
