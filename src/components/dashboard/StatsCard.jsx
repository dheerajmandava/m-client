import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "lucide-react"

export default function StatsCard({ title, value, icon: Icon, trend, trendColor = "blue" }) {
  const isPositive = trend > 0
  const trendColorClasses = {
    up: 'text-emerald-600 bg-emerald-50/80 dark:text-emerald-200 dark:bg-emerald-950/50',
    down: 'text-purple-600 bg-purple-50/80 dark:text-purple-200 dark:bg-purple-950/50',
    neutral: 'text-zinc-600 bg-zinc-50/80 dark:text-zinc-200 dark:bg-zinc-900/50'
  }

  return (
    <Card className="stats-card">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-primary/8 p-2.5 rounded-xl">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full",
            trend > 0 ? trendColorClasses.up : trendColorClasses.down
          )}>
            {trend > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span className="font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <p className="text-2xl font-semibold tracking-tight">
          {value}
        </p>
      </div>
    </Card>
  )
} 