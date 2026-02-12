"use client"

import React from "react"

import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useWallet } from "@/lib/wallet-context"
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Wallet,
  TrendingUp,
  PieChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"

function HeroSection() {
  const { isConnected } = useWallet()

  return (
    <section className="flex flex-col items-center justify-center gap-8 px-6 py-32 text-center lg:py-40">
      <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
        ARC Blockchain Compatible
      </div>
      <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
        Track your finances.{" "}
        <span className="text-primary">Simplified.</span>
      </h1>
      <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
        Track your ARC blockchain finances in one simple dashboard.
        No complexity, no jargon. Just your money, clearly.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row items-center justify-center">
        {isConnected ? (
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base font-medium">
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal, mounted }) => (
              <Button
                size="lg"
                className="gap-2 text-base font-medium"
                onClick={openConnectModal}
                disabled={!mounted}
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </ConnectButton.Custom>
        )}
        <Button
          size="lg"
          variant="outline"
          className="gap-2 text-base font-medium bg-transparent"
          asChild
        >
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get testnet USDC
          </a>
        </Button>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-card-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Financial Overview",
      description:
        "See your total balance, incoming and outgoing transactions at a glance. No blockchain knowledge required.",
    },
    {
      icon: PieChart,
      title: "Smart Categories",
      description:
        "Transactions are automatically categorized into Transfers, DeFi, Trading, Gaming, NFTs and more.",
    },
    {
      icon: TrendingUp,
      title: "Wallet Analytics",
      description:
        "Understand your spending patterns with average monthly spending, largest transactions, and activity insights.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Read-only access to your wallet. We never ask for private keys or signing permissions.",
    },
    {
      icon: Zap,
      title: "Instant Reports",
      description:
        "Export your transaction history as CSV or download monthly reports with one click.",
    },
    {
      icon: Wallet,
      title: "Easy Connection",
      description:
        "Connect your ARC wallet in seconds. Designed for people who want simplicity, not complexity.",
    },
  ]

  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            Everything you need to manage your ARC finances
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for clarity. Designed for everyone.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-heading text-sm font-semibold text-foreground">
            My Cash
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built for the ARC blockchain ecosystem.
        </p>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg font-semibold text-foreground">
            My Cash
          </span>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            Open App
          </Button>
        </Link>
      </nav>
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
