"use client";

import type { MutualFundData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FundListProps {
  funds: MutualFundData[];
  selectedFund: string | null;
  onFundSelect: (fundId: string) => void;
}

export default function FundList({
  funds,
  selectedFund,
  onFundSelect,
}: FundListProps) {
  if (funds.length === 0) {
    return (
      <p className="text-gray-500 dark:text-zinc-400">
        No funds found. Try adjusting your search.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {funds.map((fund) => {
        // --- DEBUG LOG ---
        console.log(
          `[DEBUG FundList] Fund: ${fund.id}, Value for toFixed: ${
            fund.returns?.["1y"] ?? 0
          }, Type: ${typeof (fund.returns?.["1y"] ?? 0)}`
        );
        // --- END DEBUG LOG ---
        return (
          <Card
            key={fund.id}
            className={cn(
              "cursor-pointer border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors",
              selectedFund === fund.id
                ? "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                : "bg-white dark:bg-zinc-900"
            )}
            onClick={() => onFundSelect(fund.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {fund.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    {fund.category}
                  </p>
                </div>
                {/* Removed single badge for 1y return */}
              </div>
              {/* Add section for returns */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div>
                  <p className="text-gray-500 dark:text-zinc-400">1Y Return</p>
                  <p
                    className={cn(
                      "font-medium",
                      (fund.returns?.["1y"] ?? 0) > 0
                        ? "text-green-600 dark:text-green-500"
                        : "text-red-600 dark:text-red-500"
                    )}
                  >
                    {(fund.returns?.["1y"] ?? 0) > 0 ? "+" : ""}
                    {(fund.returns?.["1y"] ?? 0).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-zinc-400">3Y Return</p>
                  <p
                    className={cn(
                      "font-medium",
                      (fund.returns?.["3y"] ?? 0) > 0
                        ? "text-green-600 dark:text-green-500"
                        : "text-red-600 dark:text-red-500"
                    )}
                  >
                    {(fund.returns?.["3y"] ?? 0) > 0 ? "+" : ""}
                    {(fund.returns?.["3y"] ?? 0).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-zinc-400">5Y Return</p>
                  <p
                    className={cn(
                      "font-medium",
                      (fund.returns?.["5y"] ?? 0) > 0
                        ? "text-green-600 dark:text-green-500"
                        : "text-red-600 dark:text-red-500"
                    )}
                  >
                    {(fund.returns?.["5y"] ?? 0) > 0 ? "+" : ""}
                    {(fund.returns?.["5y"] ?? 0).toFixed(2)}%
                  </p>
                </div>
              </div>
              {/* Existing grid for AUM, Expense Ratio, Risk */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div>
                  <p className="text-gray-500 dark:text-zinc-400">AUM</p>
                  <p className="text-gray-900 dark:text-white">
                    {/* Add safety check for aum */}₹
                    {(fund.aum ?? 0).toLocaleString()} Cr
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-zinc-400">
                    Expense Ratio
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {/* Add safety check for expenseRatio */}
                    {(fund.expenseRatio ?? 0).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-zinc-400">Risk</p>
                  <p className="text-gray-900 dark:text-white">
                    {fund.riskLevel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
