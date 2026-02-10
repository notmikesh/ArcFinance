# Arc Finance

A dashboard for tracking balances and transactions on the ARC blockchain. Connect a wallet, view your USDC balance and history, and use analytics and reports. Read-only: no private keys or signing required.

## Stack

- **Next.js 16** (App Router) with React 19 and TypeScript
- **RainbowKit** + **wagmi** for wallet connection
- **Tailwind CSS** and Radix UI–based components
- **Arc Testnet** by default (chain ID 5042002); RPC and explorer configurable via env

## What’s in the app

- **Landing** – Hero, feature list, connect wallet or open dashboard
- **Dashboard** – Total balance, incoming/outgoing (30d), recent transactions, balance chart
- **Analytics** – Spending and activity insights
- **Reports** – Monthly reports and export
- **Transactions** – Full transaction list

Data is loaded from the connected wallet on Arc Testnet (balance via RPC, transactions via ArcScan-style API).

## Setup

1. Clone the repo and install dependencies:

   ```bash
   pnpm install
   ```

2. Copy env and set values:

   ```bash
   cp .env.example .env.local
   ```

   Required:

   - `NEXT_PUBLIC_ARC_CHAIN_ID` – Arc chain ID (default 5042002)
   - `NEXT_PUBLIC_ARC_RPC_URL` – RPC URL (e.g. `https://rpc.testnet.arc.network`)
   - `NEXT_PUBLIC_ARC_EXPLORER_URL` – Block explorer base URL (e.g. `https://testnet.arcscan.app`)
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` – From [WalletConnect Cloud](https://cloud.walletconnect.com)

3. Run locally:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Use the [Circle faucet](https://faucet.circle.com) for testnet USDC.

## Scripts

| Command   | Description        |
|----------|--------------------|
| `pnpm dev`   | Dev server (Next.js with Turbo) |
| `pnpm build` | Production build   |
| `pnpm start` | Run production build |
| `pnpm lint`  | Run Next.js lint   |

## License

Private / unlicensed unless stated otherwise.
