"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Paperclip, Settings, Sparkles } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatPanelProps {
  activeDataSource: string
  setActiveDataSource: (source: string) => void
}

export default function ChatPanel({ activeDataSource, setActiveDataSource }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm SEER AI powered by Gemini. How can I help you analyze Indian mutual funds today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeModel, setActiveModel] = useState("gemini-pro")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response based on data source
    setTimeout(() => {
      let response = ""

      // Different responses based on the data source
      if (activeDataSource === "amfi") {
        const amfiResponses = [
          "Based on AMFI data, large-cap mutual funds like HDFC Top 100 Fund have shown consistent performance over the past 5 years with lower volatility compared to mid and small caps.",
          "The latest AMFI data shows that SBI Small Cap Fund has outperformed its benchmark by 4.2% over the last year, making it one of the top performers in its category.",
          "According to AMFI's latest report, equity funds saw an inflow of ₹18,500 crores last month, indicating strong investor confidence despite market volatility.",
        ]
        response = amfiResponses[Math.floor(Math.random() * amfiResponses.length)]
      } else if (activeDataSource === "kaggle") {
        const kaggleResponses = [
          "Based on the Kaggle dataset analysis, funds with lower expense ratios tend to outperform their high-expense counterparts by an average of 1.2% annually over a 10-year period.",
          "The Kaggle historical data shows a strong correlation (0.78) between fund manager tenure and consistent alpha generation in Indian equity funds.",
          "According to the Kaggle dataset, sectoral funds in technology and healthcare have shown the highest risk-adjusted returns (Sharpe ratio > 1.2) over the past 3 years.",
        ]
        response = kaggleResponses[Math.floor(Math.random() * kaggleResponses.length)]
      } else if (activeDataSource === "custom") {
        const customResponses = [
          "Based on your uploaded data, your portfolio has a weighted average expense ratio of 1.35%, which is slightly higher than the category average of 1.2%.",
          "Your custom dataset indicates that your investments are heavily skewed towards large-cap funds (68%), which may limit your growth potential in the current market conditions.",
          "Analysis of your uploaded data shows that adding a mid-cap fund could potentially improve your portfolio's risk-adjusted returns by 0.8% based on historical performance.",
        ]
        response = customResponses[Math.floor(Math.random() * customResponses.length)]
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const dataSources = [
    { id: "amfi", label: "AMFI Data" },
    { id: "kaggle", label: "Kaggle Dataset" },
    { id: "custom", label: "Custom Upload" },
  ]

  return (
    <Card className="h-full flex flex-col bg-[#0f0f0f] border-zinc-800 overflow-hidden">
      {/* Simple header with AI name and settings */}
      <div className="flex items-center justify-between border-b border-zinc-800 p-3 h-12">
        <div className="flex items-center gap-2 text-sm text-zinc-300 backdrop-blur-sm bg-black/10 px-2 py-1 rounded-md">
          <Bot className="h-4 w-4" />
          <span>SEER AI</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-zinc-900 border-zinc-800 p-2" align="end">
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-400 mb-1">Model</p>
                <Select value={activeModel} onValueChange={setActiveModel}>
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 h-8 text-xs">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                  </SelectContent>
                </Select>
                
                <p className="text-xs font-medium text-zinc-400 mt-2 mb-1">Data Source</p>
                <Select value={activeDataSource} onValueChange={setActiveDataSource}>
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 h-8 text-xs">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map(source => (
                      <SelectItem key={source.id} value={source.id}>{source.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Message area */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`py-5 px-4 ${
                message.role === "user" 
                  ? "bg-[#0f0f0f]" 
                  : "bg-[#121212] border-y border-zinc-800"
              }`}
            >
              <div className="max-w-3xl mx-auto flex items-start gap-4">
                <div className={`min-w-6 flex ${message.role === "user" ? "self-end" : ""}`}>
                  {message.role === "assistant" ? (
                    <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-sm p-1 h-6 w-6 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-black" />
                    </div>
                  ) : (
                    <div className="bg-zinc-700 rounded-sm p-1 h-6 w-6 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="py-5 px-4 bg-[#121212] border-y border-zinc-800">
              <div className="max-w-3xl mx-auto flex items-start gap-4">
                <div className="min-w-6">
                  <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-sm p-1 h-6 w-6 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-black" />
                  </div>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-3 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto relative">
          <Input
            placeholder="Message SEER AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-20 py-3 bg-zinc-800 border-zinc-700 rounded-xl focus-visible:ring-zinc-600"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Attach files</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()} 
              size="icon"
              className="h-7 w-7 rounded-md"
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
          <p className="text-[10px] text-zinc-500 text-center">
            SEER AI may produce inaccurate information about funds or market data.
          </p>
        </div>
      </div>
    </Card>
  )
}
