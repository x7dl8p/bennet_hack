"use client"

import { useEffect, useRef } from "react"
import { createChart } from "lightweight-charts"

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)

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
    if (chartContainerRef.current && !chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 300,
        layout: {
          background: { color: "#1e1e1e" },
          textColor: "#d1d4dc",
        },
        grid: {
          vertLines: {
            color: "#2e2e2e",
          },
          horzLines: {
            color: "#2e2e2e",
          },
        },
        timeScale: {
          borderColor: "#2e2e2e",
          timeVisible: true,
        },
        rightPriceScale: {
          borderColor: "#2e2e2e",
        },
      })

      // Create a candlestick series
      const series = chart.addCandlestickSeries({
        upColor: "#4caf50",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#4caf50",
        wickDownColor: "#ef5350",
      })

      // Set the data
      series.setData(candlestickData)

      // Add a title
      chart.applyOptions({
        watermark: {
          visible: true,
          fontSize: 24,
          horzAlign: "center",
          vertAlign: "center",
          color: "rgba(171, 71, 188, 0.3)",
          text: "Historical Candlestick Chart",
        },
      })

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          })
        }
      }

      window.addEventListener("resize", handleResize)
      chartRef.current = chart

      return () => {
        window.removeEventListener("resize", handleResize)
        chart.remove()
        chartRef.current = null
      }
    }
  }, [])

  return <div ref={chartContainerRef} className="w-full h-full" />
}
