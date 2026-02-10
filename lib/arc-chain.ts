import { defineChain } from "viem"

const chainId = Number(process.env.NEXT_PUBLIC_ARC_CHAIN_ID ?? 5042002)
const rpcUrl = process.env.NEXT_PUBLIC_ARC_RPC_URL ?? "https://rpc.testnet.arc.network"
const explorerUrl = process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ?? "https://testnet.arcscan.app"

export const arcTestnet = defineChain({
  id: chainId,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: {
      http: [rpcUrl],
      webSocket: [rpcUrl.replace(/^https:\/\//, "wss://")],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: explorerUrl,
    },
  },
})

export { chainId as arcChainId, rpcUrl as arcRpcUrl, explorerUrl as arcExplorerUrl }
