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
  
  
  FundDetails,
} from "@/lib/types";

import { cn } from "@/lib/utils";
import ApiManager from "@/lib/api-manager"; 



export default function Dashboard() {
  const [activeView, setActiveView] = useState<string>("overview");
  
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
        
        const funds = await ApiManager.makeRequest("funds");
        console.log(
          "[DEBUG] Raw API Response (Fund List):",
          JSON.stringify(funds)
        ); 
        let dataToSet: MutualFundData[] = []; 
        
        if (Array.isArray(funds)) {
          dataToSet = funds;
        } else if (funds && Array.isArray(funds.data)) {
          
          console.log("[DEBUG] Extracting data from 'funds.data'");
          dataToSet = funds.data;
        } else {
          console.warn(
            "[DEBUG] API response for fund list was not a recognized array structure:",
            funds
          );
          
        }
        console.log(
          "[DEBUG] Data being set to mutualFundData state:",
          JSON.stringify(dataToSet)
        );
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
      
      const endpoint = `funds/${selectedFundId}?timeframe=${activeTimeframe}&chartType=${activeChartType}`;
      console.log(`Calling API endpoint: ${endpoint}`);
      const data: MutualFundDisplayData = await ApiManager.makeRequest(
        endpoint
      ); 
      console.log(`API Response (Fund Data for ${selectedFundId}):`, data); 
      setSelectedFundData(data);
    } catch (err) {
      console.error(
        `Error fetching fund data for ${selectedFundId} via API:`,
        err
      );
      setError(err instanceof Error ? err.message : "Failed to load fund data");
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

  
  const handleDataUpload = (newData: MutualFundData[]) => {
    console.log("New data uploaded:", newData);
    
    
    setMutualFundData(newData);
    
    setSelectedFundId(null);
    setSelectedFundData(null);
    setActiveView("overview"); 
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
              mutualFundData={mutualFundData} 
              selectedFundId={selectedFundId}
              selectedFundDetails={selectedFundData?.details}
              onFundSelect={handleFundSelect}
              onDataUpload={handleDataUpload} 
              isLoading={isLoading && !selectedFundId} 
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
