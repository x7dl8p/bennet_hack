export interface MutualFundData {
  id: string
  name: string
  category: string
  aum: number // Assets Under Management in Crores
  nav: number // Net Asset Value
  expenseRatio: number
  // Replace individual returns with a nested object
  returns: {
    '1y': number;
    '3y': number;
    '5y': number;
  };
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

export interface PerformanceDataPoint {
  date: string; // Expecting date string like "YYYY-MM-DD" or similar
  value: number;
}

// Add CandlestickDataPoint type based on dashboard usage
export interface CandlestickDataPoint {
  time: string; // Expecting date string like "YYYY-MM-DD" or similar
  open: number;
  high: number;
  low: number;
  close: number;
}

// Add FundListItem type based on dashboard usage
export interface FundListItem {
  id: string;
  name: string;
}

// Add FundDetails type based on dashboard usage
export interface FundDetails {
  id: string;
  name: string;
  fundHouse: string;
  schemeType: string;
  schemeCategory: string;
  launchDate: string;
  aum: number;
  expenseRatio: number;
  benchmark: string;
}

// Add MutualFundDisplayData type based on dashboard usage
export interface MutualFundDisplayData {
  details: FundDetails;
  performance?: PerformanceDataPoint[];
  candlestick?: CandlestickDataPoint[];
}
