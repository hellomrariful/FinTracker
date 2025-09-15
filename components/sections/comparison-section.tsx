import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Minus } from "lucide-react";
import Link from "next/link";

const features = [
  {
    name: "Real-time Financial Dashboard",
    fintracker: true,
    spreadsheets: false,
    quickbooks: "partial",
    description: "Live updates from all connected platforms",
  },
  {
    name: "Multi-platform Ad Spend Tracking",
    fintracker: true,
    spreadsheets: false,
    quickbooks: false,
    description: "Facebook, Google, TikTok, and more in one place",
  },
  {
    name: "Employee Performance Analytics",
    fintracker: true,
    spreadsheets: "manual",
    quickbooks: false,
    description: "Track revenue contribution by team member",
  },
  {
    name: "ROI Calculation & Attribution",
    fintracker: true,
    spreadsheets: "manual",
    quickbooks: "basic",
    description: "Automated ROI tracking with detailed attribution",
  },
  {
    name: "Asset Management",
    fintracker: true,
    spreadsheets: false,
    quickbooks: "basic",
    description: "Track software subscriptions and hardware",
  },
  {
    name: "Custom Report Generation",
    fintracker: true,
    spreadsheets: "manual",
    quickbooks: true,
    description: "Automated reports for stakeholders and investors",
  },
  {
    name: "Data Export & Integration",
    fintracker: true,
    spreadsheets: true,
    quickbooks: "limited",
    description: "Export data in multiple formats",
  },
  {
    name: "Setup Time",
    fintracker: "15 minutes",
    spreadsheets: "Hours/Days",
    quickbooks: "Days/Weeks",
    description: "Time to get up and running",
  },
  {
    name: "Learning Curve",
    fintracker: "Minimal",
    spreadsheets: "High",
    quickbooks: "High",
    description: "How easy it is to master the platform",
  },
  {
    name: "Cost (per month)",
    fintracker: "$49-199",
    spreadsheets: "Free*",
    quickbooks: "$30-200",
    description: "*Plus significant time investment",
  },
];

const FeatureIcon = ({ value }: { value: boolean | string }) => {
  if (value === true) {
    return <Check className="h-5 w-5 text-green-500" />;
  }
  if (value === false) {
    return <X className="h-5 w-5 text-red-500" />;
  }
  if (
    value === "partial" ||
    value === "basic" ||
    value === "manual" ||
    value === "limited"
  ) {
    return <Minus className="h-5 w-5 text-yellow-500" />;
  }
  return (
    <span className="text-sm font-medium text-muted-foreground">{value}</span>
  );
};

export function ComparisonSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose FinTracker?
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            See how FinTracker compares to traditional financial management
            solutions.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        FinTracker
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Our Solution
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <span>Spreadsheets</span>
                      <span className="text-xs text-muted-foreground">
                        Excel/Google Sheets
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <span>QuickBooks</span>
                      <span className="text-xs text-muted-foreground">
                        Traditional Accounting
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-sm text-foreground">
                          {feature.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {feature.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <FeatureIcon value={feature.fintracker} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <FeatureIcon value={feature.spreadsheets} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <FeatureIcon value={feature.quickbooks} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="border-2 border-muted">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Spreadsheets</CardTitle>
              <div className="text-2xl font-bold text-muted-foreground">
                Free*
              </div>
              <p className="text-sm text-muted-foreground">
                *Plus 10-20 hours/week of manual work
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm">Manual data entry</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm">Error-prone calculations</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm">No real-time updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Full control over data</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                Recommended
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">FinTracker</CardTitle>
              <div className="text-2xl font-bold text-primary">$49-199</div>
              <p className="text-sm text-muted-foreground">
                Per month, saves 15+ hours/week
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Automated data sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Real-time insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Built for digital businesses</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">15-minute setup</span>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button className="w-full" asChild>
                <Link href="/pricing">Start Free Trial</Link>
              </Button>
            </div>
          </Card>

          <Card className="border-2 border-muted">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">QuickBooks</CardTitle>
              <div className="text-2xl font-bold text-muted-foreground">
                $30-200
              </div>
              <p className="text-sm text-muted-foreground">
                Per month, complex setup required
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Comprehensive accounting</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Limited marketing insights</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm">Complex for digital businesses</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm">Steep learning curve</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
