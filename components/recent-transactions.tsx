"use client"

import Link from "next/link"
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useArcTransactions } from "@/hooks/use-arc-transactions"
import { useWallet } from "@/lib/wallet-context"
import { cn } from "@/lib/utils"
const EXPLORER_URL = process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ?? "https://testnet.arcscan.app"

export function RecentTransactions() {
  const { isConnected } = useWallet()
  const { transactions, isLoading } = useArcTransactions()
  const recent = transactions.slice(0, 6)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-heading text-base font-semibold text-card-foreground">
          Recent Transactions
        </CardTitle>
        <Link href="/dashboard/transactions">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {!isConnected ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Connect your wallet to see transactions
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : recent.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {recent.map((tx) => (
              <a
                key={tx.id}
                href={`${EXPLORER_URL}/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
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
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-card-foreground">
                      {tx.label}
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
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold font-mono",
                    tx.direction === "incoming"
                      ? "text-primary"
                      : "text-card-foreground"
                  )}
                >
                  {tx.direction === "incoming" ? "+" : "-"}$
                  {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
