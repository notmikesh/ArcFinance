import type { NormalizedTransaction } from "./arcscan-api"

export function getCategoryBreakdownFromTxs(
  transactions: NormalizedTransaction[]
): { name: string; value: number }[] {
  const outgoing = transactions.filter((t) => t.direction === "outgoing")
  const breakdown: Record<string, number> = {}
  for (const t of outgoing) {
    breakdown[t.category] = (breakdown[t.category] || 0) + t.amount
  }
  return Object.entries(breakdown).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }))
}

export function getAnalyticsFromTxs(transactions: NormalizedTransaction[]) {
  const incoming = transactions.filter((t) => t.direction === "incoming")
  const outgoing = transactions.filter((t) => t.direction === "outgoing")
  const avgMonthlySpending = outgoing.reduce((sum, t) => sum + t.amount, 0)
  const avgIncoming = incoming.reduce((sum, t) => sum + t.amount, 0)
  const allAmounts = transactions.map((t) => t.amount)
  const largest = allAmounts.length ? Math.max(...allAmounts) : 0
  const dayCounts: Record<string, number> = {}
  for (const t of transactions) {
    const day = new Date(t.date).toLocaleDateString("en-US", { weekday: "long" })
    dayCounts[day] = (dayCounts[day] || 0) + 1
  }
  const mostActiveDay =
    Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"
  return {
    avgMonthlySpending: Math.round(avgMonthlySpending * 100) / 100,
    avgIncoming: Math.round(avgIncoming * 100) / 100,
    largestTransaction: Math.round(largest * 100) / 100,
    mostActiveDay,
  }
}

export function getMonthlySpendingSummaryFromTxs(
  transactions: NormalizedTransaction[]
): { week: string; total: number }[] {
  const outgoing = transactions.filter((t) => t.direction === "outgoing")
  const weeklyTotals: { week: string; total: number }[] = []
  for (let w = 3; w >= 0; w--) {
    const start = new Date()
    start.setDate(start.getDate() - (w + 1) * 7)
    const end = new Date()
    end.setDate(end.getDate() - w * 7)
    const weekTransactions = outgoing.filter((t) => {
      const d = new Date(t.date)
      return d >= start && d < end
    })
    weeklyTotals.push({
      week: `Week ${4 - w}`,
      total: Math.round(weekTransactions.reduce((s, t) => s + t.amount, 0) * 100) / 100,
    })
  }
  return weeklyTotals
}
