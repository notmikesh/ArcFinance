"use client"

import { createContext, useContext, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  useConnection,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useBalance,
} from "wagmi"
import { arcTestnet } from "./arc-chain"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  addressShort: string | null
  connect: () => void
  disconnect: () => void
  balance: bigint | undefined
  balanceFormatted: string
  isConnecting: boolean
  error: Error | null
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  addressShort: null,
  connect: () => {},
  disconnect: () => {},
  balance: undefined,
  balanceFormatted: "0",
  isConnecting: false,
  error: null,
})

function shortAddress(addr: string) {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const connection = useConnection()
  const { connectors, mutateAsync: connectAsync, isPending: isConnecting, error } = useConnect()
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const { switchChainAsync } = useSwitchChain()

  const address = connection?.address ?? null
  const isConnected = connection?.status === "connected"

  const { data: balanceData } = useBalance({
    address: address ?? undefined,
    chainId: arcTestnet.id,
  })

  const connect = useCallback(async () => {
    const injected = connectors.find((c) => c.type === "injected" || c.id === "injected")
    const connector = injected ?? connectors[0]
    if (!connector) {
      console.error("No wallet connector found. Install MetaMask or another Web3 wallet.")
      return
    }
    try {
      const result = await connectAsync({ connector, chainId: arcTestnet.id })
      if (result?.chainId !== arcTestnet.id && switchChainAsync) {
        await switchChainAsync({ chainId: arcTestnet.id })
      }
      router.push("/dashboard")
    } catch (e) {
      console.error("Connect failed:", e)
    }
  }, [connectors, connectAsync, switchChainAsync, router])

  const disconnect = useCallback(() => {
    wagmiDisconnect()
    router.push("/")
  }, [wagmiDisconnect, router])

  const value: WalletContextType = {
    isConnected,
    address,
    addressShort: address ? shortAddress(address) : null,
    connect,
    disconnect,
    balance: balanceData?.value,
    balanceFormatted: balanceData?.formatted ?? "0",
    isConnecting,
    error: error ?? null,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
