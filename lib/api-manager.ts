import type { MutualFundData } from "@/lib/types";
import Papa, { ParseError } from "papaparse"; 

const baseUrl = "http://[::1]:4006/api/";


let cachedFundData: MutualFundData[] | null = null; 


const mapRiskLevel = (level: number | string | null | undefined): MutualFundData['riskLevel'] => {
  const numericLevel = typeof level === 'string' ? parseInt(level, 10) : level;
  switch (numericLevel) {
    case 1: return "Low";
    case 2: return "Low to Moderate";
    case 3: return "Moderate";
    case 4: return "Moderately High";
    case 5: return "High";
    case 6: return "Very High";
    default: return "Moderate"; 
  }
};


const parseFloatSafe = (value: any): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};


const calculateInceptionDate = (ageYears: any): string => {
    const years = parseFloatSafe(ageYears);
    if (years === 0) return new Date().toISOString().split('T')[0]; 
    const currentYear = new Date().getFullYear();
    const inceptionYear = currentYear - Math.floor(years);
    
    return `${inceptionYear}-01-01`;
};


const loadAndParseFunds = async (): Promise<MutualFundData[]> => {
  if (cachedFundData) {
    console.log("[DEBUG ApiManager] Returning cached fund data.");
    return cachedFundData;
  }

  console.log("[DEBUG ApiManager] Fetching and parsing fund data from CSV...");
  try {
    const response = await fetch('/comprehensive_mutual_funds_data.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<any>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("[DEBUG ApiManager] CSV Parsing Errors:", results.errors);
            
          }

          const funds: MutualFundData[] = results.data.map((row: any, index: number) => {
             
             if (!row.scheme_name) {
                console.warn(`[DEBUG ApiManager] Skipping row ${index + 2} due to missing scheme_name.`);
                return null; 
             }

             return {
                
                // Ensure unique ID by combining index and name
                id: `${index}_${row.scheme_name || 'UnknownFund'}`,
                name: row.scheme_name,
                category: row.category || "Unknown",
                aum: parseFloatSafe(row.fund_size_cr),
                
                nav: parseFloatSafe(row.nav) || 100.00, 
                expenseRatio: parseFloatSafe(row.expense_ratio),
                
                inceptionDate: calculateInceptionDate(row.fund_age_yr),
                riskLevel: mapRiskLevel(row.risk_level),
                returns: {
                  "1y": parseFloatSafe(row.returns_1yr),
                  "3y": parseFloatSafe(row.returns_3yr),
                  "5y": parseFloatSafe(row.returns_5yr),
                },
                
                fundManager: row.fund_manager || "N/A",
                rating: parseInt(row.rating) || 0, 
                subCategory: row.sub_category || "N/A",
             };
          }).filter((fund): fund is NonNullable<typeof fund> => fund !== null); 

          console.log(`[DEBUG ApiManager] Successfully parsed ${funds.length} funds from CSV.`);
          cachedFundData = funds; 
          resolve(funds);
        },
        error: (error: Error, file?: any) => { 
          console.error("[DEBUG ApiManager] PapaParse Error:", error);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("[DEBUG ApiManager] Error loading or parsing CSV:", error);
    return []; 
  }
};








class ApiManager {
  static async makeRequest(
    endpoint: string,
    method: string = "GET",
    data?: any,
    queryParams?: Record<string, string>
  ): Promise<any> {

    
    if (endpoint === "funds" && method === "GET") {
      console.log("[DEBUG ApiManager] Intercepting /funds request, loading data from CSV.");
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const fundsFromCsv = await loadAndParseFunds();
      return Promise.resolve(fundsFromCsv);
    }
    

    let url = `${baseUrl}${endpoint}`;

    
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

    
     if (endpoint.startsWith("search")) {
       console.log(`[DEBUG ApiManager] Intercepting ${endpoint} request, returning mock empty response.`);
       await new Promise(resolve => setTimeout(resolve, 200));
       
       return Promise.resolve({ message: "Mock AI response for query: " + queryParams?.q });
     }
    


    
    
    

    
    console.warn(`[DEBUG ApiManager] No mock handler for ${method} ${endpoint}. Returning empty object.`);
    return Promise.resolve({});
  }

  
  static getSearch = async (query: string) => {
    return this.makeRequest("search", "GET", null, { q: query });
  };

  
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

  
  static getMultiFundComparison = async (fundIds: string[]) => {
    const prompt = `Compare mutual funds with IDs: ${fundIds.join(", ")}.
    Return comparative analysis in JSON format with performance metrics, risk indicators,
    and recommendation for each fund.`;

    return this.makeRequest("search", "GET", null, { q: prompt });
  };

  
  static getFundPerformanceDetails = async (fundId: string, timeframe: string = "1y") => {
    const prompt = `Provide detailed performance analysis for mutual fund ID ${fundId} over ${timeframe} timeframe.
    Include: returns breakdown (annualized, CAGR, rolling), volatility metrics, benchmark comparison,
    performance attribution, and future outlook. Return in structured JSON format.`;

    return this.makeRequest("search", "GET", null, { q: prompt });
  };

  
  static getFundRiskAnalysis = async (fundId: string) => {
    const prompt = `Provide comprehensive risk analysis for mutual fund ID ${fundId}.
    Include: volatility measures, downside risk, Sharpe/Sortino ratios, VaR, stress test scenarios,
    and risk-adjusted performance. Return in structured JSON format.`;

    return this.makeRequest("search", "GET", null, { q: prompt });
  };
}

export default ApiManager;


