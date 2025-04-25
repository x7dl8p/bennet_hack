# Hackathon RAG Analysis for Indian Mutual Fund Ecosystem

## 1. Can the Current Data Fulfill the First Part?

**Goal:**  
Design a RAG database and discover all relevant datasets for the Indian mutual fund ecosystem that map relationships between funds, AMCs, sectors, risk levels, returns, and investor goals.

**Analysis:**  
Your dataset (`indian_mutual_funds_data-till-2023.csv`) contains:

- **Funds:** `scheme_name`
- **AMCs:** `amc_name`
- **Sectors/Categories:** `category`, `sub_category`
- **Risk Levels:** `risk_level`
- **Returns:** `returns_1yr`, `returns_3yr`, `returns_5yr`
- **Investor Goals:** Inferred from `sub_category` (e.g., ELSS, Retirement, Childrens Funds, etc.)

**Conclusion:**  
You can build a knowledge graph or RAG database mapping these relationships directly from this data.

---

## 2. Can We Answer Macro-Event and Fund Relationship Questions?

**Current Data:**

- Does **not** contain macroeconomic indicators (e.g., crude oil prices, inflation, etc.) or historical correlations with fund performance.
- Only has summary returns (1yr, 3yr, 5yr), not time series NAVs.

**What’s Needed:**

- For macro-event impact: Historical NAV/returns data for each fund and macroeconomic indicators.
- For fund-to-fund relationships: Time series data for each fund and statistical analysis.

**Hackathon Approach:**

- Use Gemini’s `google_search` tool (or similar LLM tool-calling APIs) to fetch relevant news, research, or analysis from the web for these advanced queries.
- The LLM can summarize and extract insights on-the-fly, without you needing to maintain your own macroeconomic or event database.

---

## Example Questions Your System Should Handle

1. **How much risk should I take if I want (x) returns in (y) years?**

   - Uses the CSV data in `indian_mutual_funds_data-till-2023.csv` to recommend funds and risk levels based on desired returns and investment horizon.

2. **Which funds are historically affected by crude oil price changes?**

   - Uses Gemini API with search tool to fetch and summarize external research and news.

3. **When fund X goes up, how are funds Y and Z affected?**
   - Uses Gemini API with search tool to find and summarize relationships or correlations between funds.

---

## Summary Table

| Requirement                                                   | Fulfilled by Current Data? | What Else is Needed?                             | Hackathon Solution       |
| ------------------------------------------------------------- | -------------------------- | ------------------------------------------------ | ------------------------ |
| Knowledge graph of funds, AMCs, sectors, risk, returns, goals | **Yes**                    | -                                                | Use your CSV             |
| Macro-factor impact (e.g., crude oil)                         | **No**                     | External macro data + historical NAVs + analysis | Use Gemini’s search tool |
| Fund-to-fund relationships (correlation)                      | **No**                     | Historical NAVs/returns + statistical analysis   | Use Gemini’s search tool |

---

## Hackathon Recommendations

- Use your CSV for structured queries (funds, AMCs, risk, returns, etc.).
- Use Gemini’s `google_search` tool for external, event-driven, or correlation questions.
- Build a simple backend (Python + FastAPI/Flask) and frontend (React or Streamlit).
- Focus on demoing the workflow and AI-powered insights, not on building a full data warehouse.

---

## Limitations

- Answers from Gemini’s search tool depend on what’s available online and may not always be precise or consistent.
- For deep analytics or custom scenarios, you’d eventually need your own data pipeline.

---

## References

- [`indian_mutual_funds_data-till-2023.csv`](./indian_mutual_funds_data-till-2023.csv)

---