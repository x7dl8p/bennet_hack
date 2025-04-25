"use client"

import type { MutualFundData } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FundListProps {
  funds: MutualFundData[]
  selectedFund: string | null
  onFundSelect: (fundId: string) => void
}

export default function FundList({ funds, selectedFund, onFundSelect }: FundListProps) {
  if (funds.length === 0) {
    return <p className="text-zinc-400">No funds found. Try adjusting your search.</p>
  }

  return (
    <div className="space-y-3">
      {funds.map((fund) => (
        <Card
          key={fund.id}
          className={cn(
            "cursor-pointer border-zinc-800 hover:border-zinc-700 transition-colors",
            selectedFund === fund.id ? "bg-zinc-800 border-zinc-700" : "bg-zinc-900",
          )}
          onClick={() => onFundSelect(fund.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{fund.name}</h3>
                <p className="text-sm text-zinc-400">{fund.category}</p>
              </div>
              <Badge
                className={cn(
                  "ml-2",
                  fund.oneYearReturn > 15
                    ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                    : fund.oneYearReturn > 0
                      ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                      : "bg-red-500/20 text-red-500 hover:bg-red-500/30",
                )}
              >
                {fund.oneYearReturn > 0 ? "+" : ""}
                {fund.oneYearReturn.toFixed(2)}%
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div>
                <p className="text-zinc-400">AUM</p>
                <p>₹{fund.aum.toLocaleString()} Cr</p>
              </div>
              <div>
                <p className="text-zinc-400">Expense Ratio</p>
                <p>{fund.expenseRatio}%</p>
              </div>
              <div>
                <p className="text-zinc-400">Risk</p>
                <p>{fund.riskLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
