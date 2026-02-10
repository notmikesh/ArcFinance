export interface Transaction {
  id: string
  date: string
  amount: number
  direction: "incoming" | "outgoing"
  label: string
  category: "Transfers" | "DeFi" | "Trading" | "Gaming" | "NFTs" | "Other"
  counterparty: string
}

export interface BalancePoint {
  date: string
  balance: number
}

// Generate 30 days of mock balance data
function generateBalanceHistory(): BalancePoint[] {
  const points: BalancePoint[] = []
  let balance = 12400
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    balance += (Math.random() - 0.45) * 800
    balance = Math.max(8000, Math.round(balance * 100) / 100)
    points.push({
      date: date.toISOString().split("T")[0],
      balance: Math.round(balance * 100) / 100,
    })
  }
  return points
}

const labels = {
  incoming: ["Payment received", "Staking reward", "Swap completed", "Refund received"],
  outgoing: ["Transfer sent", "Contract interaction", "Swap executed", "Fee payment"],
}

const categories: Transaction["category"][] = ["Transfers", "DeFi", "Trading", "Gaming", "NFTs", "Other"]

function generateTransactions(): Transaction[] {
  const transactions: Transaction[] = []
  const now = new Date()

  for (let i = 0; i < 65; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    const direction: "incoming" | "outgoing" = Math.random() > 0.45 ? "outgoing" : "incoming"
    const dirLabels = labels[direction]
    const label = dirLabels[Math.floor(Math.random() * dirLabels.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]

    const amount =
      category === "Trading"
        ? Math.round((Math.random() * 3000 + 100) * 100) / 100
        : category === "NFTs"
          ? Math.round((Math.random() * 500 + 50) * 100) / 100
          : category === "Gaming"
            ? Math.round((Math.random() * 50 + 5) * 100) / 100
            : Math.round((Math.random() * 1500 + 10) * 100) / 100

    const wallets = [
      "0x3a9f...d4e2",
      "0x7b2c...f891",
      "0xae45...12cb",
      "0x1d8e...a3f7",
      "0xc9f2...6b04",
      "0x52a1...e8d3",
    ]

    transactions.push({
      id: `tx-${i.toString().padStart(4, "0")}`,
      date: date.toISOString(),
      amount,
      direction,
      label,
      category,
      counterparty: wallets[Math.floor(Math.random() * wallets.length)],
    })
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const mockTransactions = generateTransactions()
export const mockBalanceHistory = generateBalanceHistory()

export const currentBalance = mockBalanceHistory[mockBalanceHistory.length - 1].balance

export const walletAddress = "0x7F4e...9B2a"

export function getIncomingTotal() {
  return mockTransactions
    .filter((t) => t.direction === "incoming")
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getOutgoingTotal() {
  return mockTransactions
    .filter((t) => t.direction === "outgoing")
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTransactionCount() {
  return mockTransactions.length
}

export function getCategoryBreakdown() {
  const breakdown: Record<string, number> = {}
  for (const t of mockTransactions.filter((t) => t.direction === "outgoing")) {
    breakdown[t.category] = (breakdown[t.category] || 0) + t.amount
  }
  return Object.entries(breakdown).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }))
}

export function getAnalytics() {
  const incoming = mockTransactions.filter((t) => t.direction === "incoming")
  const outgoing = mockTransactions.filter((t) => t.direction === "outgoing")

  const avgMonthlySpending = outgoing.reduce((sum, t) => sum + t.amount, 0)
  const avgIncoming = incoming.reduce((sum, t) => sum + t.amount, 0)

  const allAmounts = mockTransactions.map((t) => t.amount)
  const largest = Math.max(...allAmounts)

  const dayCounts: Record<string, number> = {}
  for (const t of mockTransactions) {
    const day = new Date(t.date).toLocaleDateString("en-US", { weekday: "long" })
    dayCounts[day] = (dayCounts[day] || 0) + 1
  }
  const mostActiveDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0]

  return {
    avgMonthlySpending: Math.round(avgMonthlySpending * 100) / 100,
    avgIncoming: Math.round(avgIncoming * 100) / 100,
    largestTransaction: Math.round(largest * 100) / 100,
    mostActiveDay,
  }
}

export function getMonthlySpendingSummary() {
  const outgoing = mockTransactions.filter((t) => t.direction === "outgoing")
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
