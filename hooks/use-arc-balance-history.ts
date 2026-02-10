"use client"

import { useQuery } from "@tanstack/react-query"
import { useWallet } from "@/lib/wallet-context"
import { fetchBalanceHistoryByDay, type BalancePoint } from "@/lib/arcscan-api"

export function useArcBalanceHistory() {
  const { address } = useWallet()

  const query = useQuery({
    queryKey: ["arc-balance-history", address ?? ""],
    queryFn: async () => {
      if (!address) return []
      return fetchBalanceHistoryByDay(address)
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
  })

  return {
    balanceHistory: (query.data ?? []) as BalancePoint[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
