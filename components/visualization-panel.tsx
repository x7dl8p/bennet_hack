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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} labelStyle={{ color: "#fff" }} />
              <Line type="monotone" dataKey="returns" stroke="#10b981" activeDot={{ r: 8 }} dot={{ fill: "#10b981" }} />
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
    <div className="h-full p-4 overflow-y-auto">
      <Card className="bg-zinc-900 border-zinc-800 h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{selectedFundData ? selectedFundData.name : "Fund Visualization"}</CardTitle>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)]">
          <Tabs defaultValue="performance" value={activeChartType} onValueChange={setActiveChartType}>
            <TabsList className="bg-zinc-800 mb-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="sectors">Sectors</TabsTrigger>
            </TabsList>
            <div className="h-[calc(100%-80px)]">{renderChart()}</div>
          </Tabs>
          <div className="flex justify-between mt-4">
            <Select defaultValue={activeTimeframe}>
              <SelectTrigger className="w-[120px] bg-zinc-900 border-zinc-700">
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
              <SelectTrigger className="w-[120px] bg-zinc-900 border-zinc-700">
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent1">Agent 1</SelectItem>
                <SelectItem value="agent2">Agent 2</SelectItem>
                <SelectItem value="agent3">Agent 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
