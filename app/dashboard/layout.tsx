"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-border px-4 py-3 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Dashboard
          </h2>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
