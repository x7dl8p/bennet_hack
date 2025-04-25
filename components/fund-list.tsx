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
      {funds.map((fund) => (
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
              <Badge
                className={cn(
                  "ml-2",
                  fund.oneYearReturn > 15
                    ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-green-500/30"
                    : fund.oneYearReturn > 0
                    ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 hover:bg-yellow-200 dark:hover:bg-yellow-500/30"
                    : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-500 hover:bg-red-200 dark:hover:bg-red-500/30"
                )}
              >
                {fund.oneYearReturn > 0 ? "+" : ""}
                {fund.oneYearReturn.toFixed(2)}%
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div>
                <p className="text-gray-500 dark:text-zinc-400">AUM</p>
                <p className="text-gray-900 dark:text-white">
                  ₹{fund.aum.toLocaleString()} Cr
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-zinc-400">
                  Expense Ratio
                </p>
                <p className="text-gray-900 dark:text-white">
                  {fund.expenseRatio}%
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
      ))}
    </div>
  );
}
