import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  trend?: "up" | "down" | "neutral"
  subtitle?: string
}

export function StatCard({ label, value, icon: Icon, trend, subtitle }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="font-heading text-2xl font-bold text-card-foreground">
            {value}
          </span>
          {subtitle && (
            <span
              className={cn(
                "text-xs",
                trend === "up"
                  ? "text-primary"
                  : trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
