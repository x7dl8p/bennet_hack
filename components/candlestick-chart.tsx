"use client"

import { useEffect, useRef } from "react"
import { createChart, ColorType, IChartApi } from "lightweight-charts"
import { useTheme } from "next-themes"

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const { theme } = useTheme() // Get the current theme

  // Sample data for the candlestick chart
  const candlestickData: CandlestickData[] = [
    { time: "1", open: 2290.0, high: 2360.0, low: 2250.0, close: 2330.0 },
    { time: "4", open: 2330.0, high: 2330.0, low: 2250.0, close: 2260.0 },
    { time: "5", open: 2260.0, high: 2350.0, low: 2260.0, close: 2340.0 },
    { time: "6", open: 2340.0, high: 2350.0, low: 2320.0, close: 2330.0 },
    { time: "7", open: 2330.0, high: 2370.0, low: 2330.0, close: 2370.0 },
    { time: "8", open: 2370.0, high: 2410.0, low: 2350.0, close: 2360.0 },
    { time: "11", open: 2360.0, high: 2410.0, low: 2350.0, close: 2400.0 },
    { time: "12", open: 2400.0, high: 2410.0, low: 2350.0, close: 2360.0 },
    { time: "13", open: 2360.0, high: 2370.0, low: 2350.0, close: 2370.0 },
    { time: "14", open: 2370.0, high: 2410.0, low: 2350.0, close: 2390.0 },
    { time: "15", open: 2390.0, high: 2410.0, low: 2380.0, close: 2410.0 },
    { time: "18", open: 2410.0, high: 2450.0, low: 2400.0, close: 2430.0 },
    { time: "19", open: 2430.0, high: 2450.0, low: 2420.0, close: 2440.0 },
    { time: "20", open: 2440.0, high: 2500.0, low: 2440.0, close: 2500.0 },
    { time: "21", open: 2500.0, high: 2500.0, low: 2440.0, close: 2450.0 },
    { time: "22", open: 2450.0, high: 2460.0, low: 2420.0, close: 2450.0 },
    { time: "26", open: 2450.0, high: 2460.0, low: 2410.0, close: 2420.0 },
    { time: "27", open: 2420.0, high: 2440.0, low: 2400.0, close: 2410.0 },
    { time: "28", open: 2410.0, high: 2440.0, low: 2380.0, close: 2400.0 },
    { time: "29", open: 2400.0, high: 2440.0, low: 2380.0, close: 2440.0 },
  ]

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = theme === 'dark';

    // Define chart options based on theme
    const chartOptions = {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: isDark ? "#1e1e1e" : "#ffffff", type: ColorType.Solid },
        textColor: isDark ? "#d1d4dc" : "#333333",
      },
      grid: {
        vertLines: {
          color: isDark ? "#2e2e2e" : "#e5e5e5",
        },
        horzLines: {
          color: isDark ? "#2e2e2e" : "#e5e5e5",
        },
      },
      timeScale: {
        borderColor: isDark ? "#2e2e2e" : "#cccccc",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: isDark ? "#2e2e2e" : "#cccccc",
      },
      watermark: {
        visible: true,
        fontSize: 24,
        horzAlign: "center",
        vertAlign: "center",
        color: isDark ? "rgba(171, 71, 188, 0.3)" : "rgba(171, 71, 188, 0.1)",
        text: "Historical Candlestick Chart",
      },
    };

    // If chart exists, update options; otherwise, create it
    if (chartRef.current) {
      chartRef.current.applyOptions(chartOptions);
    } else {
      const chart: IChartApi = createChart(chartContainerRef.current, chartOptions);
      chartRef.current = chart;

      // Create a candlestick series (only needs to be added once)
      const series = chart.addCandlestickSeries({
        upColor: isDark ? "#00bda4" : "#26a69a", // Adjusted for theme
        downColor: isDark ? "#ff6868" : "#ef5350", // Adjusted for theme
        borderVisible: false,
        wickUpColor: isDark ? "#00bda4" : "#26a69a", // Adjusted for theme
        wickDownColor: isDark ? "#ff6868" : "#ef5350", // Adjusted for theme
      });
      series.setData(candlestickData);
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      // Don't remove the chart here if you want it to persist across theme changes
      // If you want to recreate the chart on theme change, uncomment the cleanup below
      // if (chartRef.current) {
      //   chartRef.current.remove();
      //   chartRef.current = null;
      // }
    };
  }, [theme, candlestickData]); // Re-run effect when theme or data changes

  // Cleanup chart on component unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);


  return <div ref={chartContainerRef} className="w-full h-[300px]" />; // Ensure height is applied
}
