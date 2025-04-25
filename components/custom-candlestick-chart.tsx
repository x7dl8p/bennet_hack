"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

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
];

export default function CustomCandlestickChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = theme === "dark";

    const bgColor = isDark ? "#121212" : "#ffffff";
    const gridColor = isDark ? "#2a2a2a" : "#f0f0f0";
    const textColor = isDark ? "#a0a0a0" : "#555555";
    const axisColor = isDark ? "#444444" : "#cccccc";
    const titleColor = isDark ? "#e0e0e0" : "#333333";
    const upColor = isDark ? "#26a69a" : "#16a34a";
    const downColor = isDark ? "#ef5350" : "#dc2626";
    const wickColor = isDark ? "#606060" : "#999999";
    const axisLabelFont =
      "11px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    const titleFont =
      "bold 16px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    const chartPadding = { top: 40, bottom: 30, left: 5, right: 50 };

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const chartWidth = rect.width - chartPadding.left - chartPadding.right;
    const chartHeight = rect.height - chartPadding.top - chartPadding.bottom;

    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.translate(chartPadding.left, chartPadding.top);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;

    const numHorzLines = 8;
    for (let i = 0; i <= numHorzLines; i++) {
      const y = (chartHeight / numHorzLines) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();
    }

    const numVertLines = Math.floor(chartWidth / 60);
    for (let i = 0; i <= numVertLines; i++) {
      const x = (chartWidth / numVertLines) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartHeight);
      ctx.stroke();
    }

    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, chartHeight);
    ctx.lineTo(chartWidth, chartHeight);
    ctx.moveTo(chartWidth, 0);
    ctx.lineTo(chartWidth, chartHeight);
    ctx.stroke();

    const values = candlestickData.flatMap((d) => [d.high, d.low]);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;
    const yPadding = valueRange * 0.1;
    const yMin = minValue - yPadding;
    const yMax = maxValue + yPadding;
    const effectiveRange = yMax - yMin || 1;

    ctx.fillStyle = titleColor;
    ctx.font = titleFont;
    ctx.textAlign = "center";
    ctx.fillText(
      "Historical Candlestick Chart",
      chartWidth / 2,
      -chartPadding.top / 2 - 5
    );

    ctx.fillStyle = textColor;
    ctx.font = axisLabelFont;
    ctx.textAlign = "left";
    for (let i = 0; i <= numHorzLines; i++) {
      const value = yMin + effectiveRange * (1 - i / numHorzLines);
      const y = (chartHeight / numHorzLines) * i;

      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartWidth, y);
      ctx.lineTo(chartWidth + 4, y);
      ctx.stroke();

      ctx.fillText(`${value.toFixed(1)}`, chartWidth + 8, y + 4);
    }

    ctx.textAlign = "center";
    const numDateLabels = Math.floor(chartWidth / 80);
    const dataStep = Math.max(
      1,
      Math.floor(candlestickData.length / numDateLabels)
    );
    for (let i = 0; i < candlestickData.length; i += dataStep) {
      const candle = candlestickData[i];
      const x = (chartWidth / candlestickData.length) * (i + 0.5);

      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, chartHeight);
      ctx.lineTo(x, chartHeight + 4);
      ctx.stroke();

      ctx.fillText(candle.date, x, chartHeight + 16);
    }

    const candleSpacing = chartWidth / candlestickData.length;
    const candleWidth = candleSpacing * 0.7;

    candlestickData.forEach((candle, i) => {
      const x = candleSpacing * (i + 0.5);
      const openY =
        chartHeight - ((candle.open - yMin) / effectiveRange) * chartHeight;
      const closeY =
        chartHeight - ((candle.close - yMin) / effectiveRange) * chartHeight;
      const highY =
        chartHeight - ((candle.high - yMin) / effectiveRange) * chartHeight;
      const lowY =
        chartHeight - ((candle.low - yMin) / effectiveRange) * chartHeight;

      const isUpCandle = candle.close >= candle.open;
      const currentWickColor = wickColor;
      const bodyColor = isUpCandle ? upColor : downColor;

      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.strokeStyle = currentWickColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = bodyColor;
      const candleHeight = Math.max(1, Math.abs(closeY - openY));
      const y = Math.min(openY, closeY);
      ctx.fillRect(x - candleWidth / 2, y, candleWidth, candleHeight);
    });

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [theme]);

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      {" "}
      {/* Added padding to container */}
      <canvas
        ref={canvasRef}
        className="w-full h-[300px]"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  );
}
