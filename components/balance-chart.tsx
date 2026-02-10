"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/lib/wallet-context"
import { useArcBalanceHistory } from "@/hooks/use-arc-balance-history"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-heading text-sm font-semibold text-card-foreground">
        ${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export function BalanceChart() {
  const { isConnected } = useWallet()
  const { balanceHistory, isLoading } = useArcBalanceHistory()

  const data = balanceHistory.map((p) => ({
    ...p,
    date: new Date(p.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }))

  const empty = !isConnected || data.length === 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-base font-semibold text-card-foreground">
          Balance Evolution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isConnected ? "Last 30 days (Arc Testnet)" : "Connect wallet to see history"}
        </p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[280px] w-full">
          {empty && !isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {!isConnected ? "Connect your wallet" : "No history yet"}
            </div>
          ) : isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(157, 72%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(157, 72%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 16%)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val: number) =>
                    val >= 1000 ? `$${(val / 1000).toFixed(1)}k` : `$${val.toFixed(0)}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(157, 72%, 45%)"
                  strokeWidth={2}
                  fill="url(#balanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
