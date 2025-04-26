"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import MainContent from "@/components/main-content";
import ChatPanel from "@/components/chat-panel";
import type {
  MutualFundData,
  MutualFundDisplayData,
  // PerformanceDataPoint, // Assuming API returns data in MutualFundDisplayData format
  // CandlestickDataPoint, // Assuming API returns data in MutualFundDisplayData format
  FundDetails,
} from "@/lib/types";
// import { sampleData } from "@/lib/sample-data"; // Remove sample data import
import { cn } from "@/lib/utils";
import ApiManager from "@/lib/api-manager"; // Import ApiManager

// --- Mock API Fetch Functions Removed ---

export default function Dashboard() {
  const [activeView, setActiveView] = useState<string>("overview");
  // Rename fundList state to mutualFundData and update type
  const [mutualFundData, setMutualFundData] = useState<MutualFundData[]>([]);
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [selectedFundData, setSelectedFundData] =
    useState<MutualFundDisplayData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const [activeTimeframe, setActiveTimeframe] = useState<string>("1y");
  const [activeChartType, setActiveChartType] = useState<string>("performance");
  const [activeDataSource, setActiveDataSource] = useState<string>("amfi");

  useEffect(() => {
    const loadFundList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use ApiManager to fetch fund list (assuming endpoint is 'funds')
        const funds = await ApiManager.makeRequest("funds");
        console.log("[DEBUG] Raw API Response (Fund List):", JSON.stringify(funds)); // Log raw response
        let dataToSet: MutualFundData[] = []; // Initialize with empty array
        // Check if the response is an array before setting state
        if (Array.isArray(funds)) {
          dataToSet = funds;
        } else if (funds && Array.isArray(funds.data)) {
          // Example: Check if data is nested under a 'data' property
          console.log("[DEBUG] Extracting data from 'funds.data'");
          dataToSet = funds.data;
        } else {
          console.warn("[DEBUG] API response for fund list was not a recognized array structure:", funds);
          // dataToSet remains []
        }
        console.log("[DEBUG] Data being set to mutualFundData state:", JSON.stringify(dataToSet));
        setMutualFundData(dataToSet);
      } catch (err) {
        console.error("Error fetching fund list via API:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load fund list"
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadFundList();
  }, []);

  const loadSelectedFundData = useCallback(async () => {
    if (!selectedFundId) {
      setSelectedFundData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Construct endpoint dynamically
      const endpoint = `funds/${selectedFundId}?timeframe=${activeTimeframe}&chartType=${activeChartType}`;
      console.log(`Calling API endpoint: ${endpoint}`);
      const data: MutualFundDisplayData = await ApiManager.makeRequest(endpoint); // Assuming API returns MutualFundDisplayData
      console.log(`API Response (Fund Data for ${selectedFundId}):`, data); // Log API response
      setSelectedFundData(data);
    } catch (err) {
      console.error(`Error fetching fund data for ${selectedFundId} via API:`, err);
      setError(
        err instanceof Error ? err.message : "Failed to load fund data"
      );
      setSelectedFundData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFundId, activeTimeframe, activeChartType]);

  useEffect(() => {
    loadSelectedFundData();
  }, [loadSelectedFundData]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const handleFundSelect = (fundId: string) => {
    setSelectedFundId(fundId);
  };

  // Placeholder handler for data upload
  const handleDataUpload = (newData: MutualFundData[]) => {
    console.log("New data uploaded:", newData);
    // Here you might want to merge newData with existing mutualFundData
    // For now, let's just replace it for simplicity
    setMutualFundData(newData);
    // Optionally, clear selection or navigate
    setSelectedFundId(null);
    setSelectedFundData(null);
    setActiveView("overview"); // Switch back to overview after upload
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={sidebarCollapsed ? 4 : 20}
            minSize={10}
            maxSize={30}
            collapsible={true}
            collapsedSize={4}
            onCollapse={() => setSidebarCollapsed(true)}
            onExpand={() => setSidebarCollapsed(false)}
            className={cn(
              "min-w-[50px] transition-all duration-300 ease-in-out",
              sidebarCollapsed ? "max-w-[80px]" : ""
            )}
          >
            <Sidebar
              activeView={activeView}
              onViewChange={handleViewChange}
              collapsed={sidebarCollapsed}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={100} minSize={25}>
            {/* Removed Vertical ResizablePanelGroup and VisualizationPanel */}
            <MainContent
              activeView={activeView}
              mutualFundData={mutualFundData} // Pass mutualFundData
              selectedFundId={selectedFundId}
              selectedFundDetails={selectedFundData?.details}
              onFundSelect={handleFundSelect}
              onDataUpload={handleDataUpload} // Pass onDataUpload handler
              isLoading={isLoading && !selectedFundId} // Adjust loading state logic if needed
              activeTimeframe={activeTimeframe}
              setActiveTimeframe={setActiveTimeframe}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={45} minSize={20}>
            <ChatPanel
              activeDataSource={activeDataSource}
              setActiveDataSource={setActiveDataSource}
              selectedFundName={selectedFundData?.details?.name}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
