"use client"

import { useState, useMemo } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useWallet } from "@/lib/wallet-context"
import { useArcTransactions } from "@/hooks/use-arc-transactions"
import type { NormalizedTransaction } from "@/lib/arcscan-api"
import { cn } from "@/lib/utils"

const EXPLORER_URL = process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ?? "https://testnet.arcscan.app"

const categoryColors: Record<NormalizedTransaction["category"], string> = {
  Transfers: "bg-chart-1/15 text-chart-1 border-chart-1/20",
  DeFi: "bg-chart-2/15 text-chart-2 border-chart-2/20",
  Trading: "bg-chart-3/15 text-chart-3 border-chart-3/20",
  Gaming: "bg-chart-4/15 text-chart-4 border-chart-4/20",
  NFTs: "bg-chart-5/15 text-chart-5 border-chart-5/20",
  Other: "bg-muted text-muted-foreground border-border",
}

export default function TransactionsPage() {
  const { isConnected } = useWallet()
  const { transactions, isLoading } = useArcTransactions()
  const [search, setSearch] = useState("")
  const [directionFilter, setDirectionFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")

  const filtered = useMemo(() => {
    let result = [...transactions]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.label.toLowerCase().includes(q) ||
          t.counterparty.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.amount.toString().includes(q)
      )
    }

    if (directionFilter !== "all") {
      result = result.filter((t) => t.direction === directionFilter)
    }

    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter)
    }

    if (sortBy === "amount-desc") {
      result.sort((a, b) => b.amount - a.amount)
    } else if (sortBy === "amount-asc") {
      result.sort((a, b) => a.amount - b.amount)
    } else if (sortBy === "date-asc") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
    // date-desc is default sort from mock-data

    return result
  }, [transactions, search, directionFilter, categoryFilter, sortBy])

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">View and filter your transaction history</p>
        </div>
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Connect your wallet to see your Arc Testnet transactions.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          View and filter your transaction history
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={directionFilter} onValueChange={setDirectionFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Transfers">Transfers</SelectItem>
                  <SelectItem value="DeFi">DeFi</SelectItem>
                  <SelectItem value="Trading">Trading</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                  <SelectItem value="NFTs">NFTs</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between font-heading text-base font-semibold text-card-foreground">
            <span>{filtered.length} transactions</span>
            {(search || directionFilter !== "all" || categoryFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => {
                  setSearch("")
                  setDirectionFilter("all")
                  setCategoryFilter("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              Loading transactions…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No transactions match your filters.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map((tx) => (
                <a
                  key={tx.id}
                  href={`${EXPLORER_URL}/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full",
                        tx.direction === "incoming"
                          ? "bg-primary/10"
                          : "bg-destructive/10"
                      )}
                    >
                      {tx.direction === "incoming" ? (
                        <ArrowDownLeft className="h-4 w-4 text-primary" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-card-foreground">
                        {tx.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {tx.counterparty}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-1.5 py-0 text-[10px] font-medium",
                            categoryColors[tx.category]
                          )}
                        >
                          {tx.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span
                      className={cn(
                        "text-sm font-semibold font-mono",
                        tx.direction === "incoming"
                          ? "text-primary"
                          : "text-card-foreground"
                      )}
                    >
                      {tx.direction === "incoming" ? "+" : "-"}$
                      {tx.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
