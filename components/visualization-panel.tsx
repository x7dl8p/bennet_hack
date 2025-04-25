"use client"
import type { MutualFundData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import CustomCandlestickChart from "@/components/custom-candlestick-chart"

interface VisualizationPanelProps {
  activeView: string
  mutualFundData: MutualFundData[]
  selectedFund: string | null
  activeTimeframe: string
  activeChartType: string
  setActiveChartType: (chartType: string) => void
}

export default function VisualizationPanel({
  activeView,
  mutualFundData,
  selectedFund,
  activeTimeframe,
  activeChartType,
  setActiveChartType,
}: VisualizationPanelProps) {
  const selectedFundData = selectedFund ? mutualFundData.find((fund) => fund.id === selectedFund) : null

  const performanceData = [
    { month: "Jan", returns: 2.4 },
    { month: "Feb", returns: -1.2 },
    { month: "Mar", returns: 3.5 },
    { month: "Apr", returns: 1.8 },
    { month: "May", returns: -0.7 },
    { month: "Jun", returns: 4.2 },
    { month: "Jul", returns: 2.9 },
    { month: "Aug", returns: -2.1 },
    { month: "Sep", returns: 1.5 },
    { month: "Oct", returns: 3.1 },
    { month: "Nov", returns: 2.3 },
    { month: "Dec", returns: 1.9 },
  ]

  const comparisonData = [
    { name: "Fund A", returns: 12.5, risk: 8.2 },
    { name: "Fund B", returns: 9.8, risk: 5.4 },
    { name: "Fund C", returns: 15.2, risk: 10.1 },
    { name: "Fund D", returns: 7.6, risk: 4.3 },
    { name: "Fund E", returns: 11.3, risk: 7.8 },
  ]

  const sectorData = [
    { name: "Financial", allocation: 28 },
    { name: "Technology", allocation: 22 },
    { name: "Healthcare", allocation: 15 },
    { name: "Consumer", allocation: 12 },
    { name: "Industrial", allocation: 10 },
    { name: "Energy", allocation: 8 },
    { name: "Others", allocation: 5 },
  ]

  const renderChart = () => {
    switch (activeChartType) {
      case "performance":
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <LineChart data={performanceData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" tick={{ fontSize: "0.75rem" }} />
              <YAxis stroke="#666" tick={{ fontSize: "0.75rem" }} />
              <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} labelStyle={{ color: "#fff" }} />
              <Line type="monotone" dataKey="returns" stroke="#10b981" activeDot={{ r: 6 }} dot={{ fill: "#10b981", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )
      case "candlestick":
        return <CustomCandlestickChart />
      case "comparison":
        return (
          <ChartContainer
            config={{
              returns: {
                label: "Returns (%)",
                color: "hsl(142, 76%, 36%)",
              },
              risk: {
                label: "Risk",
                color: "hsl(0, 84%, 60%)",
              },
            }}
            className="min-h-[300px]"
          >
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="returns" fill="hsl(142, 76%, 36%)" />
              <Bar dataKey="risk" fill="hsl(0, 84%, 60%)" />
            </BarChart>
          </ChartContainer>
        )
      case "sectors":
        return (
          <ChartContainer
            config={{
              allocation: {
                label: "Allocation (%)",
                color: "hsl(47, 96%, 53%)",
              },
            }}
            className="min-h-[300px]"
          >
            <BarChart data={sectorData} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="allocation" fill="hsl(47, 96%, 53%)" />
            </BarChart>
          </ChartContainer>
        )
      default:
        return <div className="flex items-center justify-center h-full">Select a chart type</div>
    }
  }

  return (
    <div className="h-full p-2 sm:p-4 overflow-y-auto">
      <Card className="bg-zinc-900 border-zinc-800 h-full shadow-lg">
        <CardHeader className="pb-2 border-b border-zinc-800">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <CardTitle className="text-base sm:text-lg flex items-center">
              {selectedFundData 
                ? <span className="flex items-center gap-2 truncate max-w-[calc(100vw-120px)]">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                    <span className="truncate">{selectedFundData.name}</span>
                  </span> 
                : <span className="text-zinc-400">Select a Fund to Visualize</span>
              }
            </CardTitle>
            <Button variant="outline" size="icon" className="hover:bg-zinc-800 transition-colors flex-shrink-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-60px)] pt-4 overflow-hidden">
          {!selectedFundData && (
            <div className="flex flex-col items-center justify-center flex-1 py-8 text-zinc-400">
              <svg className="h-10 w-10 sm:h-12 sm:w-12 mb-2 opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3m0 0l3 3m-3-3v7m6-6l3 3m0 0l3-3m-3 3V6" />
              </svg>
              <p className="text-center text-sm sm:text-base px-2">Please select a fund from the sidebar to see visualization data</p>
            </div>
          )}
          {selectedFundData && (
            <Tabs defaultValue="performance" value={activeChartType} onValueChange={setActiveChartType} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-x-auto pb-1">
                <TabsList className="bg-zinc-800 mb-2 sm:mb-4 p-1 gap-1 w-max min-w-full">
                  <TabsTrigger value="performance" className="data-[state=active]:bg-zinc-700 text-xs sm:text-sm">Performance</TabsTrigger>
                  <TabsTrigger value="candlestick" className="data-[state=active]:bg-zinc-700 text-xs sm:text-sm">Candlestick</TabsTrigger>
                  <TabsTrigger value="comparison" className="data-[state=active]:bg-zinc-700 text-xs sm:text-sm">Comparison</TabsTrigger>
                  <TabsTrigger value="sectors" className="data-[state=active]:bg-zinc-700 text-xs sm:text-sm">Sectors</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 min-h-[200px] w-full overflow-hidden">{renderChart()}</div>
            </Tabs>
          )}
          
          {selectedFundData && (
            <div className="flex flex-wrap justify-between mt-4 gap-2">
              <Select defaultValue={activeTimeframe}>
                <SelectTrigger className="w-full sm:w-auto min-w-[120px] bg-zinc-900 border-zinc-700 hover:border-zinc-600 transition-colors text-sm">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="3y">3 Years</SelectItem>
                  <SelectItem value="5y">5 Years</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="agent1">
                <SelectTrigger className="w-full sm:w-auto min-w-[120px] bg-zinc-900 border-zinc-700 hover:border-zinc-600 transition-colors text-sm">
                  <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent1">Agent 1</SelectItem>
                  <SelectItem value="agent2">Agent 2</SelectItem>
                  <SelectItem value="agent3">Agent 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
