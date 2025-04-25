export interface MutualFundData {
  id: string
  name: string
  category: string
  aum: number // Assets Under Management in Crores
  nav: number // Net Asset Value
  expenseRatio: number
  oneYearReturn: number
  threeYearReturn: number
  fiveYearReturn: number
  riskLevel: string // Low, Moderate, High
  sectors?: { name: string; allocation: number }[]
  holdings?: { name: string; percentage: number }[]
  inceptionDate: string
  fundManager?: string
  benchmark?: string
}

export interface RAGDocument {
  id: string
  title: string
  content: string
  type: "pdf" | "txt" | "docx"
  uploadDate: string
  fileSize: number
}
