"use client"

import { useQuery } from "@tanstack/react-query"
import { useWallet } from "@/lib/wallet-context"
import {
  fetchAddressTransactions,
  type NormalizedTransaction,
} from "@/lib/arcscan-api"

export function useArcTransactions() {
  const { address } = useWallet()

  const query = useQuery({
    queryKey: ["arc-transactions", address ?? ""],
    queryFn: async () => {
      if (!address) return { transactions: [], nextPageParams: undefined }
      const r = await fetchAddressTransactions(address)
      return r
    },
    enabled: !!address,
    staleTime: 60 * 1000,
  })

  return {
    transactions: (query.data?.transactions ?? []) as NormalizedTransaction[],
    nextPageParams: query.data?.nextPageParams,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
