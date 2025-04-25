"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import MainContent from "@/components/main-content"
import VisualizationPanel from "@/components/visualization-panel"
import ChatPanel from "@/components/chat-panel"
import type { MutualFundData } from "@/lib/types"
import { sampleData } from "@/lib/sample-data"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const [activeView, setActiveView] = useState<string>("overview")
  const [mutualFundData, setMutualFundData] = useState<MutualFundData[]>(sampleData)
  const [selectedFund, setSelectedFund] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const [activeTimeframe, setActiveTimeframe] = useState<string>("1y")
  const [activeChartType, setActiveChartType] = useState<string>("performance")
  const [activeDataSource, setActiveDataSource] = useState<string>("amfi")

  const handleViewChange = (view: string) => {
    setActiveView(view)
  }

  const handleFundSelect = (fundId: string) => {
    setSelectedFund(fundId)
  }

  const handleDataUpload = (data: MutualFundData[]) => {
    setMutualFundData(data)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            minSize={10}
            maxSize={30}
            collapsible={true}
            collapsedSize={4}
            onCollapse={() => setSidebarCollapsed(true)}
            onExpand={() => setSidebarCollapsed(false)}
            className={cn("min-w-[50px]", sidebarCollapsed ? "max-w-[80px]" : "")}
          >
            <Sidebar activeView={activeView} onViewChange={handleViewChange} collapsed={sidebarCollapsed} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={45} minSize={20}>
            <ChatPanel activeDataSource={activeDataSource} setActiveDataSource={setActiveDataSource} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={35} minSize={25}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60} minSize={30}>
                <VisualizationPanel
                  activeView={activeView}
                  mutualFundData={mutualFundData}
                  selectedFund={selectedFund}
                  activeTimeframe={activeTimeframe}
                  activeChartType={activeChartType}
                  setActiveChartType={setActiveChartType}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={40} minSize={20}>
                <MainContent
                  activeView={activeView}
                  mutualFundData={mutualFundData}
                  selectedFund={selectedFund}
                  onFundSelect={handleFundSelect}
                  onDataUpload={handleDataUpload}
                  isLoading={isLoading}
                  activeTimeframe={activeTimeframe}
                  setActiveTimeframe={setActiveTimeframe}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
