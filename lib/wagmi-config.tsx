"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { arcTestnet, arcRpcUrl } from "./arc-chain"

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "YOUR_PROJECT_ID"

/** Chain no formato esperado pelo Rainbow Kit (inclui optional icon e multicall3) */
const arcChainForRainbow = {
  ...arcTestnet,
  iconUrl: "https://assets.circle.com/favicon.ico",
  iconBackground: "#000",
  rpcUrls: {
    default: { http: [arcRpcUrl] },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11" as const,
      blockCreated: 0,
    },
  },
} as const

export const wagmiConfig = getDefaultConfig({
  appName: "My Cash Dashboard",
  projectId,
  chains: [arcChainForRainbow],
  ssr: true,
})
