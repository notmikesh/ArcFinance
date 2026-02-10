"use client"

import {
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { useWallet } from "@/lib/wallet-context"
import { useArcTransactions } from "@/hooks/use-arc-transactions"
import {
  getCategoryBreakdownFromTxs,
  getAnalyticsFromTxs,
  getMonthlySpendingSummaryFromTxs,
} from "@/lib/analytics-from-txs"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const COLORS = [
  "hsl(157, 72%, 45%)",
  "hsl(200, 70%, 50%)",
  "hsl(45, 90%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(220, 10%, 55%)",
]

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number }>
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-card-foreground">{payload[0].name}</p>
      <p className="text-sm font-semibold text-primary">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

function BarTooltip({
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
      <p className="text-sm font-semibold text-card-foreground">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { isConnected } = useWallet()
  const { transactions, isLoading } = useArcTransactions()
  const categories = getCategoryBreakdownFromTxs(transactions)
  const analytics = getAnalyticsFromTxs(transactions)
  const weeklySpending = getMonthlySpendingSummaryFromTxs(transactions)
  const totalSpending = categories.reduce((s, c) => s + c.value, 0)

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Spending insights and wallet analytics</p>
        </div>
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Connect your wallet to see your Arc Testnet analytics.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Spending insights and wallet analytics</p>
        </div>
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Loading…
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Spending insights and wallet analytics
        </p>
      </div>

      {/* Analytics Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Avg Monthly Spending"
          value={`$${analytics.avgMonthlySpending.toLocaleString()}`}
          icon={TrendingDown}
          trend="down"
          subtitle="Last 30 days"
        />
        <StatCard
          label="Avg Incoming Funds"
          value={`$${analytics.avgIncoming.toLocaleString()}`}
          icon={TrendingUp}
          trend="up"
          subtitle="Last 30 days"
        />
        <StatCard
          label="Largest Transaction"
          value={`$${analytics.largestTransaction.toLocaleString()}`}
          icon={ArrowUpRight}
        />
        <StatCard
          label="Most Active Day"
          value={analytics.mostActiveDay}
          icon={Calendar}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Spending by Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base font-semibold text-card-foreground">
              Spending by Category
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total: ${Math.round(totalSpending).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categories.map((_entry, index) => (
                      <Cell
                        key={`cell-${
                          // biome-ignore lint/suspicious/noArrayIndexKey: chart cells
                          index
                        }`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Spending */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base font-semibold text-card-foreground">
              Weekly Spending Summary
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 4 weeks</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklySpending}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 16%)" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12, fill: "hsl(220, 10%, 55%)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => `$${val}`}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Bar
                    dataKey="total"
                    fill="hsl(157, 72%, 45%)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base font-semibold text-card-foreground">
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {(categories.length ? categories : [{ name: "No data", value: 0 }])
              .sort((a, b) => b.value - a.value)
              .map((cat, i) => {
                const pct = ((cat.value / totalSpending) * 100).toFixed(1)
                return (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="w-20 text-sm font-medium text-card-foreground">
                      {cat.name}
                    </span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                    <span className="w-24 text-right text-sm font-mono text-muted-foreground">
                      ${cat.value.toLocaleString()}
                    </span>
                    <span className="w-12 text-right text-xs text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
