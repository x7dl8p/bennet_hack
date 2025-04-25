import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MutualFundData } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseCSVData(csvText: string): MutualFundData[] {
  // Split the CSV text into lines
  const lines = csvText.trim().split("\n")

  // Extract headers from the first line
  const headers = lines[0].split(",").map((header) => header.trim())

  // Process each data row
  return lines.slice(1).map((line, index) => {
    const values = line.split(",").map((value) => value.trim())
    const rowData: Record<string, string> = {}

    // Map each value to its corresponding header
    headers.forEach((header, i) => {
      rowData[header] = values[i] || ""
    })

    // Convert the row data to MutualFundData format
    return {
      id: `fund-${index + 1}`,
      name: rowData["name"] || `Fund ${index + 1}`,
      category: rowData["category"] || "Unknown",
      aum: Number.parseFloat(rowData["aum"]) || 0,
      nav: Number.parseFloat(rowData["nav"]) || 0,
      expenseRatio: Number.parseFloat(rowData["expenseRatio"]) || 0,
      oneYearReturn: Number.parseFloat(rowData["oneYearReturn"]) || 0,
      threeYearReturn: Number.parseFloat(rowData["threeYearReturn"]) || 0,
      fiveYearReturn: Number.parseFloat(rowData["fiveYearReturn"]) || 0,
      riskLevel: rowData["riskLevel"] || "Moderate",
      inceptionDate: rowData["inceptionDate"] || new Date().toISOString().split("T")[0],
      fundManager: rowData["fundManager"] || undefined,
      benchmark: rowData["benchmark"] || undefined,
      sectors: parseSectors(rowData["sectors"]),
      holdings: parseHoldings(rowData["holdings"]),
    }
  })
}

// Helper function to parse sectors data if available
function parseSectors(sectorsData?: string): { name: string; allocation: number }[] | undefined {
  if (!sectorsData) return undefined

  try {
    // Assuming sectors data is in format "Financial:32,Technology:18,..."
    return sectorsData.split(",").map((sector) => {
      const [name, allocation] = sector.split(":")
      return {
        name: name.trim(),
        allocation: Number.parseFloat(allocation.trim()),
      }
    })
  } catch (error) {
    console.error("Error parsing sectors data:", error)
    return undefined
  }
}

// Helper function to parse holdings data if available
function parseHoldings(holdingsData?: string): { name: string; percentage: number }[] | undefined {
  if (!holdingsData) return undefined

  try {
    // Assuming holdings data is in format "HDFC Bank:8.5,Infosys:6.2,..."
    return holdingsData.split(",").map((holding) => {
      const [name, percentage] = holding.split(":")
      return {
        name: name.trim(),
        percentage: Number.parseFloat(percentage.trim()),
      }
    })
  } catch (error) {
    console.error("Error parsing holdings data:", error)
    return undefined
  }
}
