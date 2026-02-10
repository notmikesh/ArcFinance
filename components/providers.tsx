"use client"

import "@rainbow-me/rainbowkit/styles.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "@/lib/wagmi-config"
import { WalletProvider } from "@/lib/wallet-context"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <WalletProvider>{children}</WalletProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
