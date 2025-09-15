import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Clock,
  Target,
} from "lucide-react";

const stats = [
  {
    id: 1,
    name: "Active Businesses",
    value: "500+",
    description: "Growing companies trust FinTracker",
    icon: Users,
    trend: "+127%",
    trendLabel: "from last year",
  },
  {
    id: 2,
    name: "Revenue Tracked",
    value: "$50M+",
    description: "Total revenue managed through our platform",
    icon: DollarSign,
    trend: "+89%",
    trendLabel: "month over month",
  },
  {
    id: 3,
    name: "Time Saved",
    value: "15hrs",
    description: "Average weekly time saved per business",
    icon: Clock,
    trend: "95%",
    trendLabel: "reduction in manual work",
  },
  {
    id: 4,
    name: "ROI Improvement",
    value: "34%",
    description: "Average ROI increase after using FinTracker",
    icon: TrendingUp,
    trend: "+12%",
    trendLabel: "vs industry average",
  },
  {
    id: 5,
    name: "Data Points",
    value: "10M+",
    description: "Financial data points processed monthly",
    icon: BarChart3,
    trend: "+156%",
    trendLabel: "growth in data volume",
  },
  {
    id: 6,
    name: "Accuracy Rate",
    value: "99.8%",
    description: "Financial calculation accuracy",
    icon: Target,
    trend: "99.8%",
    trendLabel: "consistent accuracy",
  },
];

export function StatsSection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Growing Businesses Worldwide
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            See the impact FinTracker is making for digital businesses like
            yours.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend} {stat.trendLabel}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="font-semibold text-sm text-foreground">
                    {stat.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-sm border border-border px-6 py-3">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">
              Growing 40% month-over-month
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
