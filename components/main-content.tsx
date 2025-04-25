"use client";

import { useState } from "react";
import type { MutualFundData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search } from "lucide-react";
import FundList from "@/components/fund-list";
import RagUploader from "@/components/rag-uploader";

interface MainContentProps {
  activeView: string;
  mutualFundData: MutualFundData[];
  selectedFund: string | null;
  onFundSelect: (fundId: string) => void;
  onDataUpload: (data: MutualFundData[]) => void;
  isLoading: boolean;
  activeTimeframe: string;
  setActiveTimeframe: (timeframe: string) => void;
}

export default function MainContent({
  activeView,
  mutualFundData,
  selectedFund,
  onFundSelect,
  onDataUpload,
  isLoading,
  activeTimeframe,
  setActiveTimeframe,
}: MainContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [queryText, setQueryText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRisk, setSelectedRisk] = useState<string>("all");

  const filteredFunds = mutualFundData.filter((fund) => {
    const matchesSearch = fund.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || fund.category === selectedCategory;
    const matchesRisk =
      selectedRisk === "all" || fund.riskLevel === selectedRisk;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const categories = [
    "all",
    ...Array.from(new Set(mutualFundData.map((fund) => fund.category))),
  ];
  const riskLevels = [
    "all",
    ...Array.from(new Set(mutualFundData.map((fund) => fund.riskLevel))),
  ];

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400 dark:text-zinc-400" />
              <Input
                placeholder="Search funds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[150px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="w-[150px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                  {riskLevels.map((risk) => (
                    <SelectItem key={risk} value={risk}>
                      {risk === "all" ? "All Risk Levels" : risk}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FundList
              funds={filteredFunds}
              selectedFund={selectedFund}
              onFundSelect={onFundSelect}
            />
          </div>
        );
      case "returns":
        return (
          <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Returns Analysis
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">
                Analyze historical and projected returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="historical">
                <TabsList className="bg-gray-100 dark:bg-zinc-800">
                  <TabsTrigger value="historical">Historical</TabsTrigger>
                  <TabsTrigger value="projected">Projected</TabsTrigger>
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                </TabsList>
                <TabsContent value="historical" className="pt-4">
                  <div className="space-y-4">
                    <Select
                      value={activeTimeframe}
                      onValueChange={setActiveTimeframe}
                    >
                      <SelectTrigger className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                        <SelectItem value="1m">1 Month</SelectItem>
                        <SelectItem value="3m">3 Months</SelectItem>
                        <SelectItem value="6m">6 Months</SelectItem>
                        <SelectItem value="1y">1 Year</SelectItem>
                        <SelectItem value="3y">3 Years</SelectItem>
                        <SelectItem value="5y">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-gray-500 dark:text-zinc-400">
                      Select a fund from the overview to view detailed returns
                      analysis.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="projected" className="pt-4">
                  <p className="text-gray-500 dark:text-zinc-400">
                    AI-powered return projections will appear here.
                  </p>
                </TabsContent>
                <TabsContent value="comparison" className="pt-4">
                  <p className="text-gray-500 dark:text-zinc-400">
                    Compare returns across multiple funds.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
      case "risk":
        return (
          <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Risk Analysis
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">
                Quantify and visualize investment risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="volatility">
                <TabsList className="bg-gray-100 dark:bg-zinc-800">
                  <TabsTrigger value="volatility">Volatility</TabsTrigger>
                  <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
                  <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                </TabsList>
                <TabsContent value="volatility" className="pt-4">
                  <p className="text-gray-500 dark:text-zinc-400">
                    Volatility metrics and analysis will appear here.
                  </p>
                </TabsContent>
                <TabsContent value="drawdown" className="pt-4">
                  <p className="text-gray-500 dark:text-zinc-400">
                    Maximum drawdown analysis will appear here.
                  </p>
                </TabsContent>
                <TabsContent value="scenarios" className="pt-4">
                  <p className="text-gray-500 dark:text-zinc-400">
                    Stress test scenarios will appear here.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
      case "insights":
        return (
          <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                AI Insights
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">
                RAG-powered analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Ask about mutual fund trends, risks, or specific fund analysis..."
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 min-h-[100px]"
                />
                <div className="flex flex-wrap justify-between gap-2">
                  <Select defaultValue="gpt-4o">
                    <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Generate Insights"
                    )}
                  </Button>
                </div>
                <div className="p-4 rounded-md bg-gray-100 dark:bg-zinc-800 mt-4 min-h-[200px]">
                  <p className="text-gray-500 dark:text-zinc-400 text-sm">
                    AI-generated insights will appear here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "upload":
        return <RagUploader onDataUpload={onDataUpload} />;
      default:
        return (
          <div className="text-gray-600 dark:text-zinc-400">
            Select a view from the sidebar
          </div>
        );
    }
  };

  return (
    <div className="h-full p-6 overflow-y-auto bg-white dark:bg-black text-gray-900 dark:text-white">
      {renderContent()}
    </div>
  );
}
