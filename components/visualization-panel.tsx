"use client";
import { useState, useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels"; // Import the correct type
import type { MutualFundData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import html2canvas from "html2canvas";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import CustomCandlestickChart from "@/components/custom-candlestick-chart";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface VisualizationPanelProps {
  activeTimeframe: string; // Add back activeTimeframe
  setActiveTimeframe: (timeframe: string) => void;
  mutualFundData: MutualFundData[];
  selectedFund: string | null;
}

export default function VisualizationPanel({
  mutualFundData,
  selectedFund,
  activeTimeframe,
  setActiveTimeframe,
}: VisualizationPanelProps) {
  const [leftChartType, setLeftChartType] = useState("candlestick");
  const [rightChartType, setRightChartType] = useState("sectors");
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const leftChartContainerRef = useRef<HTMLDivElement>(null); // Ref for the chart container div
  const rightChartContainerRef = useRef<HTMLDivElement>(null); // Ref for the chart container div

  const selectedFundData = selectedFund
    ? mutualFundData.find((fund) => fund.id === selectedFund)
    : null;

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
  ];

  const comparisonData = [
    { name: "Fund A", returns: 12.5, risk: 8.2 },
    { name: "Fund B", returns: 9.8, risk: 5.4 },
    { name: "Fund C", returns: 15.2, risk: 10.1 },
    { name: "Fund D", returns: 7.6, risk: 4.3 },
    { name: "Fund E", returns: 11.3, risk: 7.8 },
  ];

  const sectorData = [
    { name: "Financial", allocation: 28 },
    { name: "Technology", allocation: 22 },
    { name: "Healthcare", allocation: 15 },
    { name: "Consumer", allocation: 12 },
    { name: "Industrial", allocation: 10 },
    { name: "Energy", allocation: 8 },
    { name: "Others", allocation: 5 },
  ];

  const renderChart = (chartType: string) => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    const gridColor = isDarkTheme ? "#333" : "#e5e7eb";
    const axisColor = isDarkTheme ? "#666" : "#9ca3af";

    switch (chartType) {
      case "candlestick":
        return <CustomCandlestickChart />;
      case "performance": // Add performance chart case
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData} // Use appropriate data
              margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="month"
                stroke={axisColor}
                tick={{ fontSize: "0.75rem" }}
              />
              <YAxis stroke={axisColor} tick={{ fontSize: "0.75rem" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkTheme ? "#222" : "#fff",
                  borderColor: isDarkTheme ? "#444" : "#e5e7eb",
                }}
                labelStyle={{ color: isDarkTheme ? "#fff" : "#111" }}
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="#10b981"
                activeDot={{ r: 6 }}
                dot={{ fill: "#10b981", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "comparison": // Add comparison chart case
        return (
          <ChartContainer
            config={{
              returns: { label: "Returns (%)", color: "hsl(142, 76%, 36%)" },
              risk: { label: "Risk", color: "hsl(0, 84%, 60%)" },
            }}
            className="h-full w-full"
          >
            <BarChart
              data={comparisonData} // Use appropriate data
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="returns" fill="hsl(142, 76%, 36%)" />
              <Bar dataKey="risk" fill="hsl(0, 84%, 60%)" />
            </BarChart>
          </ChartContainer>
        );
      case "sectors":
        return (
          <ChartContainer
            config={{
              allocation: {
                label: "Allocation (%)",
                color: "hsl(47, 96%, 53%)",
              },
            }}
            className="h-full w-full"
          >
            <BarChart
              data={sectorData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 50, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis type="number" stroke={axisColor} />
              <YAxis dataKey="name" type="category" stroke={axisColor} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="allocation" fill="hsl(47, 96%, 53%)" />
            </BarChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  const handleDownload = async () => {
    if (leftPanelRef.current && rightPanelRef.current) {
      const leftCanvas = await html2canvas(leftChartContainerRef.current!); // Use container ref
      const rightCanvas = await html2canvas(rightChartContainerRef.current!); // Use container ref

      const leftLink = document.createElement("a");
      leftLink.href = leftCanvas.toDataURL("image/png");
      leftLink.download = "left-chart.png";
      leftLink.click();

      const rightLink = document.createElement("a");
      rightLink.href = rightCanvas.toDataURL("image/png");
      rightLink.download = "right-chart.png";
      rightLink.click();
    }
  };

  return (
    <div className="h-full p-2 sm:p-4 overflow-y-auto">
      <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 h-full shadow-lg">
        <CardHeader className="pb-2 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <CardTitle className="text-base sm:text-lg flex items-center text-gray-900 dark:text-white">
              {selectedFundData ? (
                <span className="flex items-center gap-2 truncate max-w-[calc(100vw-120px)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span className="truncate">{selectedFundData.name}</span>
                </span>
              ) : (
                <span className="text-gray-500 dark:text-zinc-400">
                  Select a Fund to Visualize
                </span>
              )}
            </CardTitle>
            <Button onClick={handleDownload}
              variant="outline"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-60px)] pt-4 overflow-hidden">
          {!selectedFundData && (
            <div className="flex flex-col items-center justify-center flex-1 py-8 text-gray-500 dark:text-zinc-400">
              <svg
                className="h-10 w-10 sm:h-12 sm:w-12 mb-2 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 12l3-3m0 0l3 3m-3-3v7m6-6l3 3m0 0l3-3m-3 3V6"
                />
              </svg>
              <p className="text-center text-sm sm:text-base px-2">
                Please select a fund from the sidebar to see visualization data
              </p>
            </div>
          )}
          {selectedFundData && (
            <div className="flex flex-col flex-1 overflow-hidden"> {/* Wrap conditional content */}
              <div className="flex justify-between mb-4">
              <ToggleGroup
                type="single"
                value={leftChartType}
                onValueChange={(value) => value && setLeftChartType(value)}
              >
                <ToggleGroupItem value="candlestick">Candlestick</ToggleGroupItem>
                <ToggleGroupItem value="performance">Performance</ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup
                type="single"
                value={rightChartType}
                onValueChange={(value) => value && setRightChartType(value)}
              >
                <ToggleGroupItem value="sectors">Sectors</ToggleGroupItem>
                <ToggleGroupItem value="comparison">Comparison</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <ResizablePanelGroup
              direction="horizontal" // Or "vertical" if preferred
              className="flex-1 rounded-lg border dark:border-zinc-700" // Added border for visibility
            >
              <ResizablePanel defaultSize={50} ref={leftPanelRef}>
                <div className="flex h-full items-center justify-center p-2" ref={leftChartContainerRef}>
                  {renderChart(leftChartType)}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} ref={rightPanelRef}>
                <div className="flex h-full items-center justify-center p-2" ref={rightChartContainerRef}>
                  {renderChart(rightChartType)}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div> // Close the wrapper div for conditional content
        )}

          {selectedFundData && (
            <div className="flex flex-wrap justify-between mt-4 gap-2">
              <Select value={activeTimeframe} onValueChange={setActiveTimeframe}>
                <SelectTrigger className="w-full sm:w-auto min-w-[120px] bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors text-sm">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
