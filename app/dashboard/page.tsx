"use client"

import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Hash,
} from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { BalanceChart } from "@/components/balance-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { useWallet } from "@/lib/wallet-context"
import { useArcTransactions } from "@/hooks/use-arc-transactions"

export default function DashboardPage() {
  const { isConnected, balanceFormatted } = useWallet()
  const { transactions } = useArcTransactions()

  const incoming = transactions
    .filter((t) => t.direction === "incoming")
    .reduce((sum, t) => sum + t.amount, 0)
  const outgoing = transactions
    .filter((t) => t.direction === "outgoing")
    .reduce((sum, t) => sum + t.amount, 0)
  const incomingCount = transactions.filter((t) => t.direction === "incoming").length
  const outgoingCount = transactions.filter((t) => t.direction === "outgoing").length

  const displayBalance = isConnected
    ? `$${Number(balanceFormatted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—"
  const subtitle = isConnected
    ? "Arc Testnet (USDC)"
    : "Connect wallet to see your balance"

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Balance"
          value={displayBalance}
          icon={Wallet}
          trend="up"
          subtitle={subtitle}
        />
        <StatCard
          label="Incoming (30d)"
          value={isConnected ? `$${incoming.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
          icon={ArrowDownLeft}
          trend="up"
          subtitle={isConnected ? `${incomingCount} transactions` : "—"}
        />
        <StatCard
          label="Outgoing (30d)"
          value={isConnected ? `$${outgoing.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
          icon={ArrowUpRight}
          trend="down"
          subtitle={isConnected ? `${outgoingCount} transactions` : "—"}
        />
        <StatCard
          label="Total Transactions"
          value={isConnected ? transactions.length.toString() : "—"}
          icon={Hash}
          trend="neutral"
          subtitle={isConnected ? "From chain" : "—"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <BalanceChart />
        </div>
        <div className="xl:col-span-2">
          <RecentTransactions />
        </div>
      </div>
    </div>
  )
}
