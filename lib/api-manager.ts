import type { MutualFundData } from "@/lib/types"; // Import the type

const baseUrl = "http://[::1]:4006/api/";

// --- Sample Data for /funds endpoint ---
const sampleFundData: MutualFundData[] = [
  {
    id: "FUND001",
    name: "Example Growth Fund",
    category: "Large Cap",
    aum: 5000, // Added
    nav: 150.75, // Added
    expenseRatio: 0.85, // Added
    inceptionDate: "2010-01-15", // Added
    riskLevel: "High",
    returns: { "1y": 15.5, "3y": 12.1, "5y": 10.8 },
  },
  {
    id: "FUND002",
    name: "Stable Income Fund",
    category: "Debt",
    aum: 10000, // Added
    nav: 105.20, // Added
    expenseRatio: 0.40, // Added
    inceptionDate: "2015-06-01", // Added
    riskLevel: "Low",
    returns: { "1y": 6.2, "3y": 5.8, "5y": 5.5 },
  },
  {
    id: "FUND003",
    name: "Balanced Advantage Fund",
    category: "Hybrid",
    aum: 7500, // Added
    nav: 88.50, // Added
    expenseRatio: 1.10, // Added
    inceptionDate: "2012-03-20", // Added
    riskLevel: "Moderate",
    returns: { "1y": 10.1, "3y": 8.5, "5y": 7.9 },
  },
   {
    id: "FUND004",
    name: "Aggressive Hybrid Fund",
    category: "Hybrid",
    aum: 3000, // Added
    nav: 120.00, // Added
    expenseRatio: 1.25, // Added
    inceptionDate: "2018-11-01", // Added
    riskLevel: "High",
    returns: { "1y": 18.2, "3y": 14.0, "5y": 11.5 },
  },
   {
    id: "FUND005",
    name: "Small Cap Explorer",
    category: "Small Cap",
    aum: 1500, // Added
    nav: 45.30, // Added
    expenseRatio: 1.50, // Added
    inceptionDate: "2019-08-25", // Added
    riskLevel: "Very High",
    returns: { "1y": 25.0, "3y": 19.5, "5y": 16.2 },
  },
];
// --- End Sample Data ---


class ApiManager {
  static async makeRequest(
    endpoint: string,
    method: string = "GET",
    data?: any,
    queryParams?: Record<string, string>
  ): Promise<any> { // Added Promise<any> return type hint

    // --- MOCK FOR /funds ---
    if (endpoint === "funds" && method === "GET") {
      console.log("[DEBUG ApiManager] Intercepting /funds request, returning sample data.");
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return Promise.resolve(sampleFundData);
    }
    // --- END MOCK ---

    let url = `${baseUrl}${endpoint}`;

    // Add query parameters if provided
    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, value);
      });
      url += `?${params.toString()}`;
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return response.json();
  }

  // AI endpoints
  static getSearch = async (query: string) => {
    return this.makeRequest("search", "GET", null, { q: query });
  };
  
  // Fund research data endpoint - specifically formatted for our frontend
  static getFundResearchData = async (fundId: string, timeframe: string = "1y") => {
    const prompt = `Analyze mutual fund with ID ${fundId} for ${timeframe} timeframe. 
    Return detailed analysis in exactly this JSON structure:
    {
      "researchCharts": {
        "navTrend": {
          "title": "NAV Trend Analysis",
          "description": "Historical NAV performance with key insights",
          "dataPoints": [
            { "date": "YYYY-MM format date", "value": "NAV value as number" }
          ],
          "insights": "Brief insights about NAV trend"
        },
        "aumGrowth": {
          "title": "AUM Growth Trajectory",
          "description": "Assets Under Management growth pattern",
          "dataPoints": [
            { "date": "YYYY-MM format date", "value": "AUM value in crores as number" }
          ],
          "insights": "Brief insights about AUM growth"
        },
        "riskReturn": {
          "title": "Risk-Return Profile",
          "description": "Comparative risk and return analysis",
          "dataPoints": [
            { "name": "Fund name", "risk": "Risk value as number", "return": "Return value as number" }
          ],
          "insights": "Brief insights about risk-return profile"
        }
      }
    }`;
    
    return this.makeRequest("search", "GET", null, { q: prompt });
  };
  
  // Get comparison data for multiple funds
  static getMultiFundComparison = async (fundIds: string[]) => {
    const prompt = `Compare mutual funds with IDs: ${fundIds.join(", ")}. 
    Return comparative analysis in JSON format with performance metrics, risk indicators, 
    and recommendation for each fund.`;
    
    return this.makeRequest("search", "GET", null, { q: prompt });
  };
  
  // Get detailed performance analysis for a specific fund
  static getFundPerformanceDetails = async (fundId: string, timeframe: string = "1y") => {
    const prompt = `Provide detailed performance analysis for mutual fund ID ${fundId} over ${timeframe} timeframe.
    Include: returns breakdown (annualized, CAGR, rolling), volatility metrics, benchmark comparison,
    performance attribution, and future outlook. Return in structured JSON format.`;
    
    return this.makeRequest("search", "GET", null, { q: prompt });
  };
  
  // Get risk analysis for a specific fund
  static getFundRiskAnalysis = async (fundId: string) => {
    const prompt = `Provide comprehensive risk analysis for mutual fund ID ${fundId}.
    Include: volatility measures, downside risk, Sharpe/Sortino ratios, VaR, stress test scenarios,
    and risk-adjusted performance. Return in structured JSON format.`;
    
    return this.makeRequest("search", "GET", null, { q: prompt });
  };
}

export default ApiManager;