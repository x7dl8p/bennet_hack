"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns"; // For date formatting
import { Calendar as CalendarIcon, Loader2, Search, TrendingUp, AreaChart, BarChart3 } from "lucide-react"; // Icon for date picker & others
import { cn } from "@/lib/utils"; // Utility for class names
import type { MutualFundData, FundDetails } from "@/lib/types";
import { Button } from "@/components/ui/button"; // Already imported
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"; // Calendar component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Popover for calendar
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

// Define type for AI research data
interface ResearchChartData {
  researchCharts?: {
    navTrend?: { 
      title: string; 
      description: string; 
      dataPoints: Array<{date: string; value: number}>; 
      insights: string 
    };
    aumGrowth?: { 
      title: string; 
      description: string; 
      dataPoints: Array<{date: string; value: number}>; 
      insights: string 
    };
    riskReturn?: { 
      title: string; 
      description: string; 
      dataPoints: Array<{name: string; risk: number; return: number}>; 
      insights: string 
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

  // --- DEBUG LOGS ---
  console.log("[DEBUG MainContent] Received mutualFundData prop:", JSON.stringify(mutualFundData));
  if (Array.isArray(mutualFundData) && mutualFundData.length > 0) {
    console.log("[DEBUG MainContent] First item in mutualFundData:", JSON.stringify(mutualFundData[0]));
  } else if (Array.isArray(mutualFundData)) {
     console.log("[DEBUG MainContent] mutualFundData is an empty array.");
  } else {
     console.log("[DEBUG MainContent] mutualFundData is NOT an array:", typeof mutualFundData, mutualFundData);
  }
  // --- END DEBUG LOGS ---

  const [searchQuery, setSearchQuery] = useState("");
  const [queryText, setQueryText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRisk, setSelectedRisk] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // State for date filter
  
  // State for AI research data (overview cards)
  const [researchData, setResearchData] = useState<ResearchChartData>({});
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  
  // State for AI search results (insights tab)
  const [searchResults, setSearchResults] = useState<any>(null); // Use 'any' for now, refine based on actual API response
  const [isSearching, setIsSearching] = useState(false);

  // Filter funds - Add check to ensure mutualFundData is an array
  const filteredFunds = Array.isArray(mutualFundData)
    ? mutualFundData.filter((fund) => {
        // Ensure fund and fund properties exist before accessing them
        const nameMatch = fund?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
        const categoryMatch = selectedCategory === "all" || (fund?.category === selectedCategory);
        const riskMatch = selectedRisk === "all" || (fund?.riskLevel === selectedRisk);
        return nameMatch && categoryMatch && riskMatch;
      })
    : []; // Default to empty array if mutualFundData is not an array

  // Fetch research data when a fund is selected
  useEffect(() => {
    async function fetchResearchData() {
      if (!selectedFundId) {
        setResearchData({});
        return;
      }
      
      setIsResearchLoading(true);
      try {
        const data = await ApiManager.getFundResearchData(selectedFundId, activeTimeframe);
        setResearchData(data);
      } catch (error) {
        console.error("Error fetching research data:", error);
      } finally {
        setIsResearchLoading(false);
      }
    }
    
    fetchResearchData();
  }, [selectedFundId, activeTimeframe]);

  // Safely derive categories and risk levels
  const categories = Array.isArray(mutualFundData)
    ? ["all", ...Array.from(new Set(mutualFundData.map((fund) => fund?.category).filter(Boolean)))] // Filter out null/undefined
    : ["all"];
  const riskLevels = Array.isArray(mutualFundData)
    ? ["all", ...Array.from(new Set(mutualFundData.map((fund) => fund?.riskLevel).filter(Boolean)))] // Filter out null/undefined
    : ["all"];

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
                      "w-[240px] justify-start text-left font-normal bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700", // Added background/border
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Incepted before...</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800" align="start"> {/* Added background/border */}
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date: Date) => // Disable future dates - Add type for date
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                   {/* Add a button to clear the date */}
                   {selectedDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(undefined)}
                        className="w-full mt-1 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" // Style clear button
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
                      {researchData.researchCharts?.navTrend?.title || "NAV Trend"}
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-gray-400 dark:text-zinc-400" />
                  </div>
                  <CardDescription className="text-xs text-gray-500 dark:text-zinc-400">
                    {researchData.researchCharts?.navTrend?.description || "Net Asset Value over time"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {isResearchLoading ? (
                    <div className="h-[150px] w-full p-2 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400 dark:text-zinc-400" />
                    </div>
                  ) : researchData.researchCharts?.navTrend?.dataPoints ? (
                    <div className="h-[150px] w-full p-4 flex flex-col">
                      <div className="text-xs italic text-gray-600 dark:text-zinc-300 mb-2">
                        {researchData.researchCharts.navTrend.insights}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 mt-auto">
                        {`${researchData.researchCharts.navTrend.dataPoints.length} data points available`}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[150px] w-full p-2 flex items-center justify-center text-gray-500 dark:text-zinc-400 text-sm">
                      {selectedFundId ? "Select a timeframe to view NAV data" : "Select a fund to view NAV data"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AUM Growth Card */}
              <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                      {researchData.researchCharts?.aumGrowth?.title || "AUM Growth"}
                    </CardTitle>
                    <AreaChart className="h-4 w-4 text-gray-400 dark:text-zinc-400" />
                  </div>
                  <CardDescription className="text-xs text-gray-500 dark:text-zinc-400">
                    {researchData.researchCharts?.aumGrowth?.description || "Assets Under Management"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {isResearchLoading ? (
                    <div className="h-[150px] w-full p-2 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400 dark:text-zinc-400" />
                    </div>
                  ) : researchData.researchCharts?.aumGrowth?.dataPoints ? (
                    <div className="h-[150px] w-full p-4 flex flex-col">
                      <div className="text-xs italic text-gray-600 dark:text-zinc-300 mb-2">
                        {researchData.researchCharts.aumGrowth.insights}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 mt-auto">
                        {`${researchData.researchCharts.aumGrowth.dataPoints.length} data points available`}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[150px] w-full p-2 flex items-center justify-center text-gray-500 dark:text-zinc-400 text-sm">
                      {selectedFundId ? "Select a timeframe to view AUM data" : "Select a fund to view AUM data"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Risk/Return Scatter Card */}
              <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                      {researchData.researchCharts?.riskReturn?.title || "Risk vs. Return"}
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-gray-400 dark:text-zinc-400" />
                  </div>
                  <CardDescription className="text-xs text-gray-500 dark:text-zinc-400">
                    {researchData.researchCharts?.riskReturn?.description || "Comparative analysis"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {isResearchLoading ? (
                    <div className="h-[150px] w-full p-2 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400 dark:text-zinc-400" />
                    </div>
                  ) : researchData.researchCharts?.riskReturn?.dataPoints ? (
                    <div className="h-[150px] w-full p-4 flex flex-col">
                      <div className="text-xs italic text-gray-600 dark:text-zinc-300 mb-2">
                        {researchData.researchCharts.riskReturn.insights}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 mt-auto">
                        {`Comparing ${researchData.researchCharts.riskReturn.dataPoints.length} funds`}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[150px] w-full p-2 flex items-center justify-center text-gray-500 dark:text-zinc-400 text-sm">
                      {selectedFundId ? "Select a timeframe to view risk/return data" : "Select a fund to view risk/return data"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <FundList
              funds={filteredFunds}
              selectedFund={selectedFundId}
              onFundSelect={onFundSelect}
            />
          </div>
        );
      // Rest of the switch cases remain unchanged...
      
      // Add insights section handling
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
                  
                  <Button onClick={async () => {
                    if (!queryText.trim()) return;
                    
                    setIsSearching(true);
                    setSearchResults(null); // Clear previous results
                    try {
                      // Call API with the query
                      const response = await ApiManager.getSearch(queryText);
                      console.log("AI response:", response);
                      setSearchResults(response); // Store the response
                    } catch (error) {
                      console.error("Error generating insights:", error);
                      setSearchResults({ error: "Failed to generate insights." }); // Store error state
                    } finally {
                      setIsSearching(false);
                    }
                  }}>
                    {isSearching ? ( // Use isSearching state
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
                    // Display the raw JSON response for now. Adapt as needed.
                    <pre className="whitespace-pre-wrap break-words">
                      {JSON.stringify(searchResults, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-gray-500 dark:text-zinc-400">
                      AI-generated insights will appear here after you ask a question.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      // Other cases remain the same...
      case "returns":
      case "risk":
      case "upload":
      default:
        // Keep the existing implementations
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
