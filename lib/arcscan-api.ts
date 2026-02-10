/**
 * ArcScan (Blockscout) API – transações e histórico de saldo por endereço.
 * Base URL: https://testnet.arcscan.app/api/v2
 */

const ARCSCAN_API =
  typeof process !== "undefined"
    ? (process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ?? "https://testnet.arcscan.app").replace(
        /\/$/,
        ""
      ) + "/api/v2"
    : "https://testnet.arcscan.app/api/v2"

/** Resposta da API de transações (Blockscout v2) */
export interface ArcScanTxItem {
  hash: string
  from: { hash: string }
  to: { hash: string | null }
  value: string
  timestamp: string
  method: string | null
  status: "ok" | "error"
  fee?: { value: string }
  transaction_types?: string[]
  block_number: number
  decoded_input?: { method_call?: string }
}

export interface ArcScanTransactionsResponse {
  items: ArcScanTxItem[]
  next_page_params?: { block_number: number; index: number; items_count: number }
}

/** Resposta da API de histórico de saldo por dia */
export interface ArcScanBalanceHistoryItem {
  date: string
  value: string
}

export interface ArcScanBalanceHistoryResponse {
  items: ArcScanBalanceHistoryItem[]
  days: number
}

/** Transação normalizada para a dashboard */
export interface NormalizedTransaction {
  id: string
  hash: string
  date: string
  amount: number
  direction: "incoming" | "outgoing"
  label: string
  category: "Transfers" | "DeFi" | "Trading" | "Gaming" | "NFTs" | "Other"
  counterparty: string
  status: "ok" | "error"
  feeUsdc?: number
}

/** Ponto do gráfico de saldo (USDC, 6 decimals) */
export interface BalancePoint {
  date: string
  balance: number
}

const USDC_DECIMALS = 6
/** Blockscout devolve value/fee das transações em wei (18 decimais), não em 6 */
const WEI_DECIMALS = 18

function weiToUsdc(wei: string): number {
  const v = BigInt(wei)
  const divisor = BigInt(10 ** USDC_DECIMALS)
  return Number(v) / Number(divisor)
}

/** Converte value/fee da API (18 decimais) para valor humano. Na Arc, native é USDC (6 dec.) mas a API vem em wei. */
function wei18ToHuman(wei: string): number {
  const v = BigInt(wei)
  const divisor = BigInt(10 ** WEI_DECIMALS)
  return Number(v) / Number(divisor)
}

function shortAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function inferCategory(method: string | null, types: string[] | undefined): NormalizedTransaction["category"] {
  if (types?.includes("token_transfer")) return "Transfers"
  if (types?.includes("contract_call") || types?.includes("contract_creation")) return "DeFi"
  const m = (method ?? "").toLowerCase()
  if (m.includes("swap") || m.includes("trade")) return "Trading"
  if (m.includes("mint") || m.includes("nft") || m.includes("approve")) return "NFTs"
  return "Other"
}

export function normalizeTransaction(
  tx: ArcScanTxItem,
  myAddress: string
): NormalizedTransaction {
  const myLower = myAddress.toLowerCase()
  const fromLower = tx.from.hash.toLowerCase()
  const toLower = tx.to?.hash?.toLowerCase() ?? ""
  const isIncoming = toLower === myLower
  const amount = wei18ToHuman(tx.value)
  const counterparty = isIncoming ? tx.from.hash : tx.to?.hash ?? ""
  const method = tx.decoded_input?.method_call ?? tx.method ?? "Transaction"
  const category = inferCategory(method, tx.transaction_types)

  let label = method
  if (tx.transaction_types?.includes("coin_transfer")) {
    label = isIncoming ? "Payment received" : "Transfer sent"
  } else if (method) {
    const name = method.split("(")[0].replace(/([A-Z])/g, " $1").trim()
    label = name || (isIncoming ? "Incoming" : "Outgoing")
  }

  return {
    id: tx.hash,
    hash: tx.hash,
    date: tx.timestamp,
    amount,
    direction: isIncoming ? "incoming" : "outgoing",
    label,
    category,
    counterparty: shortAddress(counterparty),
    status: tx.status,
    feeUsdc: tx.fee?.value ? wei18ToHuman(tx.fee.value) : undefined,
  }
}

export async function fetchAddressTransactions(
  address: string,
  pageParams?: { block_number: number; index: number; items_count: number }
): Promise<{ transactions: NormalizedTransaction[]; nextPageParams?: ArcScanTransactionsResponse["next_page_params"] }> {
  const params = new URLSearchParams()
  if (pageParams) {
    params.set("block_number", String(pageParams.block_number))
    params.set("index", String(pageParams.index))
    params.set("items_count", String(pageParams.items_count))
  }
  const url = `${ARCSCAN_API}/addresses/${address}/transactions?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ArcScan API error: ${res.status}`)
  const data: ArcScanTransactionsResponse = await res.json()
  const transactions = (data.items ?? []).map((tx) => normalizeTransaction(tx, address))
  return { transactions, nextPageParams: data.next_page_params }
}

export async function fetchBalanceHistoryByDay(
  address: string
): Promise<BalancePoint[]> {
  const url = `${ARCSCAN_API}/addresses/${address}/coin-balance-history-by-day`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ArcScan API error: ${res.status}`)
  const data = await res.json()
  const items = Array.isArray(data) ? data : (data.items ?? [])
  return items.map((item: { date: string; value: string }) => ({
    date: item.date,
    balance: weiToUsdc(item.value),
  }))
}
