"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Loader2,
  Search,
  TrendingUp,
  AreaChart,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MutualFundData, FundDetails } from "@/lib/types";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FundList from "@/components/fund-list";
import RagUploader from "@/components/rag-uploader";
import ApiManager from "@/lib/api-manager";

interface ResearchChartData {
  researchCharts?: {
    navTrend?: {
      title: string;
      description: string;
      dataPoints: Array<{ date: string; value: number }>;
      insights: string;
    };
    aumGrowth?: {
      title: string;
      description: string;
      dataPoints: Array<{ date: string; value: number }>;
      insights: string;
    };
    riskReturn?: {
      title: string;
      description: string;
      dataPoints: Array<{ name: string; risk: number; return: number }>;
      insights: string;
    };
  };
}

interface MainContentProps {
  activeView: string;
  mutualFundData: MutualFundData[];
  selectedFundId: string | null;
  selectedFundDetails: FundDetails | undefined;
  onFundSelect: (fundId: string) => void;
  onDataUpload: (data: MutualFundData[]) => void;
  isLoading: boolean;
  activeTimeframe: string;
  setActiveTimeframe: (timeframe: string) => void;
}

export default function MainContent({
  activeView,
  mutualFundData,
  selectedFundId,
  selectedFundDetails,
  onFundSelect,
  onDataUpload,
  isLoading,
  activeTimeframe,
  setActiveTimeframe,
}: MainContentProps) {
  console.log(
    "[DEBUG MainContent] Received mutualFundData prop:",
    JSON.stringify(mutualFundData)
  );
  if (Array.isArray(mutualFundData) && mutualFundData.length > 0) {
    console.log(
      "[DEBUG MainContent] First item in mutualFundData:",
      JSON.stringify(mutualFundData[0])
    );
  } else if (Array.isArray(mutualFundData)) {
    console.log("[DEBUG MainContent] mutualFundData is an empty array.");
  } else {
    console.log(
      "[DEBUG MainContent] mutualFundData is NOT an array:",
      typeof mutualFundData,
      mutualFundData
    );
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [queryText, setQueryText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRisk, setSelectedRisk] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [researchData, setResearchData] = useState<ResearchChartData>({});
  const [isResearchLoading, setIsResearchLoading] = useState(false);

  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredFunds = Array.isArray(mutualFundData)
    ? mutualFundData.filter((fund) => {
        const nameMatch =
          fund?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false;
        const categoryMatch =
          selectedCategory === "all" || fund?.category === selectedCategory;
        const riskMatch =
          selectedRisk === "all" || fund?.riskLevel === selectedRisk;
        return nameMatch && categoryMatch && riskMatch;
      })
    : [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const fundsToDisplay = filteredFunds.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredFunds.length / itemsPerPage);

  useEffect(() => {
    async function fetchResearchData() {
      if (!selectedFundId) {
        setResearchData({});
        return;
      }

      setIsResearchLoading(true);
      try {
        const data = await ApiManager.getFundResearchData(
          selectedFundId,
          activeTimeframe
        );
        setResearchData(data);
      } catch (error) {
        console.error("Error fetching research data:", error);
      } finally {
        setIsResearchLoading(false);
      }
    }

    fetchResearchData();
  }, [selectedFundId, activeTimeframe]);

  const categories = Array.isArray(mutualFundData)
    ? [
        "all",
        ...Array.from(
          new Set(mutualFundData.map((fund) => fund?.category).filter(Boolean))
        ),
      ]
    : ["all"];
  const riskLevels = Array.isArray(mutualFundData)
    ? [
        "all",
        ...Array.from(
          new Set(mutualFundData.map((fund) => fund?.riskLevel).filter(Boolean))
        ),
      ]
    : ["all"];

  const selectedFundData = Array.isArray(mutualFundData)
    ? mutualFundData.find((fund) => fund.id === selectedFundId)
    : undefined;

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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchQuery("");
                    setCurrentPage(1);
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="px-2"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Category/risk filters */}
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
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Incepted before...</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                  align="start"
                >
                  {" "}
                  {/* Added background/border */}
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date: Date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                  {/* Add a button to clear the date */}
                  {selectedDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(undefined)}
                      className="w-full mt-1 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                      Clear Date
                    </Button>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Research Cards - now with AI data integration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* NAV Trend Card */}
              <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                      Current NAV
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-gray-400 dark:text-zinc-400" />
                  </div>
                  <CardDescription className="text-xs text-gray-500 dark:text-zinc-400">
                    Latest Net Asset Value (Snapshot)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[150px] flex items-center justify-center p-4">
                  {selectedFundData ? (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{(selectedFundData.nav ?? 0).toFixed(2)}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-zinc-400 text-sm">
                      Select a fund
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AUM Growth Card */}
              <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                      Current AUM
                    </CardTitle>
                    <AreaChart className="h-4 w-4 text-gray-400 dark:text-zinc-400" />
                  </div>
                  <CardDescription className="text-xs text-gray-500 dark:text-zinc-400">
                    Assets Under Management (Snapshot)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[150px] flex items-center justify-center p-4">
                  {selectedFundData ? (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{(selectedFundData.aum ?? 0).toLocaleString()} Cr
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-zinc-400 text-sm">
                      Select a fund
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Risk/Return Scatter Card */}
              <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                      Risk & 1Y Return
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-gray-400 dark:text-zinc-400" />
                  </div>
                  <CardDescription className="text-xs text-gray-500 dark:text-zinc-400">
                    Categorical Risk and 1-Year Return
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[150px] flex flex-col items-center justify-center p-4 space-y-2">
                  {selectedFundData ? (
                    <>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-zinc-400">
                          Risk Level
                        </div>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {selectedFundData.riskLevel || "N/A"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-zinc-400">
                          1Y Return
                        </div>
                        <div
                          className={`text-lg font-medium ${
                            (selectedFundData.returns?.["1y"] ?? 0) >= 0
                              ? "text-green-600 dark:text-green-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {(selectedFundData.returns?.["1y"] ?? 0).toFixed(2)}%
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 dark:text-zinc-400 text-sm">
                      Select a fund
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <>
              <FundList
                funds={fundsToDisplay}
                selectedFund={selectedFundId}
                onFundSelect={onFundSelect}
              />

              {/* Pagination Controls */}
              {filteredFunds.length > itemsPerPage && (
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-zinc-400">
                    Showing {startIndex + 1} -{" "}
                    {Math.min(endIndex, filteredFunds.length)} of{" "}
                    {filteredFunds.length} funds
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          </div>
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

                  <Button
                    onClick={async () => {
                      if (!queryText.trim()) return;

                      setIsSearching(true);
                      setSearchResults(null);
                      try {
                        const response = await ApiManager.getSearch(queryText);
                        console.log("AI response:", response);
                        setSearchResults(response);
                      } catch (error) {
                        console.error("Error generating insights:", error);
                        setSearchResults({
                          error: "Failed to generate insights.",
                        });
                      } finally {
                        setIsSearching(false);
                      }
                    }}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Generate Insights"
                    )}
                  </Button>
                </div>
                <div className="p-4 rounded-md bg-gray-100 dark:bg-zinc-800 mt-4 min-h-[200px] text-sm text-gray-900 dark:text-white">
                  {isSearching ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400 dark:text-zinc-400" />
                    </div>
                  ) : searchResults ? (
                    <pre className="whitespace-pre-wrap break-words">
                      {JSON.stringify(searchResults, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-gray-500 dark:text-zinc-400">
                      AI-generated insights will appear here after you ask a
                      question.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "returns":
      case "risk":
      case "upload":
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
