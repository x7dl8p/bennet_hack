"use client"

import { useEffect, useRef } from "react"

// Sample data for the candlestick chart
const candlestickData = [
  { date: "1", open: 2290.0, high: 2360.0, low: 2250.0, close: 2330.0 },
  { date: "4", open: 2330.0, high: 2330.0, low: 2250.0, close: 2260.0 },
  { date: "5", open: 2260.0, high: 2350.0, low: 2260.0, close: 2340.0 },
  { date: "6", open: 2340.0, high: 2350.0, low: 2320.0, close: 2330.0 },
  { date: "7", open: 2330.0, high: 2370.0, low: 2330.0, close: 2370.0 },
  { date: "8", open: 2370.0, high: 2410.0, low: 2350.0, close: 2360.0 },
  { date: "11", open: 2360.0, high: 2410.0, low: 2350.0, close: 2400.0 },
  { date: "12", open: 2400.0, high: 2410.0, low: 2350.0, close: 2360.0 },
  { date: "13", open: 2360.0, high: 2370.0, low: 2350.0, close: 2370.0 },
  { date: "14", open: 2370.0, high: 2410.0, low: 2350.0, close: 2390.0 },
  { date: "15", open: 2390.0, high: 2410.0, low: 2380.0, close: 2410.0 },
  { date: "18", open: 2410.0, high: 2450.0, low: 2400.0, close: 2430.0 },
  { date: "19", open: 2430.0, high: 2450.0, low: 2420.0, close: 2440.0 },
  { date: "20", open: 2440.0, high: 2500.0, low: 2440.0, close: 2500.0 },
  { date: "21", open: 2500.0, high: 2500.0, low: 2440.0, close: 2450.0 },
  { date: "22", open: 2450.0, high: 2460.0, low: 2420.0, close: 2450.0 },
  { date: "26", open: 2450.0, high: 2460.0, low: 2410.0, close: 2420.0 },
  { date: "27", open: 2420.0, high: 2440.0, low: 2400.0, close: 2410.0 },
  { date: "28", open: 2410.0, high: 2440.0, low: 2380.0, close: 2400.0 },
  { date: "29", open: 2400.0, high: 2440.0, low: 2380.0, close: 2440.0 },
]

export default function CustomCandlestickChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = "#1e1e1e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    const gridColor = "#2e2e2e"
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = (rect.height / 10) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i <= 20; i++) {
      const x = (rect.width / 20) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, rect.height)
      ctx.stroke()
    }

    // Find min and max values for scaling
    const values = candlestickData.flatMap((d) => [d.high, d.low])
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue
    const padding = valueRange * 0.1
    const yMin = minValue - padding
    const yMax = maxValue + padding

    // Draw title
    ctx.fillStyle = "rgba(171, 71, 188, 0.3)"
    ctx.font = "24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Historical Candlestick Chart", rect.width / 2, 30)

    // Draw price scale
    ctx.fillStyle = "#d1d4dc"
    ctx.font = "10px Arial"
    ctx.textAlign = "left"
    for (let i = 0; i <= 10; i++) {
      const value = yMin + (yMax - yMin) * (1 - i / 10)
      const y = (rect.height / 10) * i
      ctx.fillText(`$${value.toFixed(1)}`, 5, y + 10)
    }

    // Draw date labels
    ctx.textAlign = "center"
    const dateLabels = candlestickData.filter((_, i) => i % 4 === 0).map((d) => d.date)
    dateLabels.forEach((date, i) => {
      const x = (rect.width / (dateLabels.length + 1)) * (i + 1)
      ctx.fillText(date, x, rect.height - 5)
    })

    // Draw candlesticks
    const candleWidth = (rect.width / (candlestickData.length + 2)) * 0.8
    candlestickData.forEach((candle, i) => {
      const x = (rect.width / (candlestickData.length + 1)) * (i + 1)
      const openY = rect.height - ((candle.open - yMin) / (yMax - yMin)) * rect.height
      const closeY = rect.height - ((candle.close - yMin) / (yMax - yMin)) * rect.height
      const highY = rect.height - ((candle.high - yMin) / (yMax - yMin)) * rect.height
      const lowY = rect.height - ((candle.low - yMin) / (yMax - yMin)) * rect.height

      // Draw wick
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.strokeStyle = candle.open > candle.close ? "#ef5350" : "#4caf50"
      ctx.stroke()

      // Draw body
      ctx.fillStyle = candle.open > candle.close ? "#ef5350" : "#4caf50"
      const candleHeight = Math.abs(closeY - openY)
      const y = Math.min(openY, closeY)
      ctx.fillRect(x - candleWidth / 2, y, candleWidth, candleHeight)
    })
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-[300px]" style={{ maxWidth: "100%", maxHeight: "100%" }} />
    </div>
  )
}
