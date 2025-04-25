"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Paperclip, Sparkles } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  return (
    <Card className="h-full flex flex-col bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2 border-b border-zinc-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
          <Tabs defaultValue={activeDataSource} onValueChange={setActiveDataSource} className="w-auto">
            <TabsList className="bg-zinc-800">
              <TabsTrigger value="amfi" className="text-xs">
                AMFI
              </TabsTrigger>
              <TabsTrigger value="kaggle" className="text-xs">
                Kaggle
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-xs">
                Custom
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="h-8 w-8 bg-zinc-800">
                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user" ? "bg-zinc-800 text-white" : "bg-zinc-700 text-white"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8 bg-zinc-800">
                  <Bot className="h-4 w-4" />
                </Avatar>
                <div className="rounded-lg p-3 bg-zinc-700 text-white">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <CardFooter className="border-t border-zinc-800 p-4">
        <div className="flex w-full items-center space-x-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Ask about mutual funds, market trends, or investment strategies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-zinc-800 border-zinc-700"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            onClick={handleSend}
            className="shrink-0"
          >
            {isLoading ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex justify-between w-full mt-3">
          <Select value={activeModel} onValueChange={setActiveModel}>
            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 h-8 text-xs">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
              <SelectItem value="claude-3">Claude 3</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="agent1">
            <SelectTrigger className="w-[120px] bg-zinc-800 border-zinc-700 h-8 text-xs">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent1">Analyst</SelectItem>
              <SelectItem value="agent2">Advisor</SelectItem>
              <SelectItem value="agent3">Researcher</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  )
}
