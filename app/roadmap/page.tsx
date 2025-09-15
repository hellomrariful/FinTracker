import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Map,
  CheckCircle,
  Clock,
  Zap,
  Smartphone,
  Bot,
  BarChart3,
  CreditCard,
  Globe,
  Users,
  Shield,
  Puzzle,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Roadmap | FinTracker",
  description:
    "Discover what's coming next for FinTracker. See our product roadmap and upcoming features.",
};

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: "Q4 2024",
      status: "completed",
      items: [
        {
          title: "Core Financial Tracking",
          description:
            "Income, expense, and asset management with real-time analytics",
          icon: BarChart3,
          status: "completed",
        },
        {
          title: "Employee Performance Tracking",
          description: "Monitor individual employee contributions and ROI",
          icon: Users,
          status: "completed",
        },
        {
          title: "Advanced Analytics Dashboard",
          description: "Comprehensive financial insights and reporting",
          icon: BarChart3,
          status: "completed",
        },
      ],
    },
    {
      quarter: "Q1 2025",
      status: "in-progress",
      items: [
        {
          title: "Mobile Application",
          description:
            "Native iOS and Android apps for on-the-go financial management",
          icon: Smartphone,
          status: "in-progress",
        },
        {
          title: "Bank Integration",
          description:
            "Connect your bank accounts for automatic transaction import",
          icon: CreditCard,
          status: "in-progress",
        },
        {
          title: "Advanced Budgeting",
          description: "Smart budget recommendations and automated alerts",
          icon: Zap,
          status: "planned",
        },
      ],
    },
    {
      quarter: "Q2 2025",
      status: "planned",
      items: [
        {
          title: "AI-Powered Insights",
          description:
            "Machine learning algorithms for predictive financial analytics",
          icon: Bot,
          status: "planned",
        },
        {
          title: "Multi-Currency Support",
          description:
            "Handle international transactions and currency conversions",
          icon: Globe,
          status: "planned",
        },
        {
          title: "Team Collaboration",
          description: "Share dashboards and collaborate with team members",
          icon: Users,
          status: "planned",
        },
      ],
    },
    {
      quarter: "Q3 2025",
      status: "planned",
      items: [
        {
          title: "API & Integrations",
          description:
            "Public API and integrations with popular business tools",
          icon: Puzzle,
          status: "planned",
        },
        {
          title: "Advanced Security",
          description:
            "Enhanced security features and compliance certifications",
          icon: Shield,
          status: "planned",
        },
        {
          title: "Custom Reports",
          description: "Build and schedule custom financial reports",
          icon: BarChart3,
          status: "planned",
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "planned":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-progress":
        return Clock;
      case "planned":
        return Calendar;
      default:
        return Calendar;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Product Roadmap</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Map className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">
              The Future of <span className="text-primary">FinTracker</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're constantly evolving to meet your financial management needs.
              Here's what we're building next to help your business thrive.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                Quarterly Updates
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Clock className="mr-2 h-4 w-4" />
                Community Driven
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Zap className="mr-2 h-4 w-4" />
                Rapid Development
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Development Timeline</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our roadmap is driven by user feedback and market needs. We
              release new features quarterly to ensure continuous improvement
              and innovation.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="space-y-12">
              {roadmapItems.map((quarter, quarterIndex) => (
                <div key={quarterIndex} className="relative">
                  {/* Quarter Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className={`w-4 h-4 rounded-full ${getStatusColor(
                        quarter.status
                      )}`}
                    />
                    <h3 className="text-2xl font-bold">{quarter.quarter}</h3>
                    <Badge
                      variant={
                        quarter.status === "completed"
                          ? "default"
                          : quarter.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {quarter.status === "completed"
                        ? "Completed"
                        : quarter.status === "in-progress"
                        ? "In Progress"
                        : "Planned"}
                    </Badge>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-8">
                    {quarter.items.map((item, itemIndex) => {
                      const StatusIcon = getStatusIcon(item.status);
                      return (
                        <Card
                          key={itemIndex}
                          className={`h-full ${
                            item.status === "completed"
                              ? "border-green-200 bg-green-50/50 dark:bg-green-950/20"
                              : ""
                          }`}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <item.icon className="h-8 w-8 text-primary" />
                              <StatusIcon
                                className={`h-5 w-5 ${
                                  item.status === "completed"
                                    ? "text-green-500"
                                    : item.status === "in-progress"
                                    ? "text-blue-500"
                                    : "text-gray-400"
                                }`}
                              />
                            </div>
                            <CardTitle className="text-lg">
                              {item.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-sm">
                              {item.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Connecting Line */}
                  {quarterIndex < roadmapItems.length - 1 && (
                    <div className="absolute left-2 top-16 w-0.5 h-24 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Requests */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Shape Our Future</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Your feedback drives our development. Have an idea for a feature
              that would help your business? We'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mx-auto" />
                  <CardTitle className="text-lg">Community Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Join our community discussions and vote on upcoming
                    features.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mx-auto" />
                  <CardTitle className="text-lg">Feature Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Submit your ideas and see them come to life in future
                    releases.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-primary mx-auto" />
                  <CardTitle className="text-lg">Beta Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get early access to new features and help us improve them.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button asChild>
                <Link href="/contact">Submit Feature Request</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  href="https://www.linkedin.com/company/fintracker"
                  target="_blank"
                >
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Release Notes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Recent Updates</h2>
              <p className="text-muted-foreground text-lg">
                Stay up to date with our latest releases and improvements.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Version 2.1.0 - Enhanced Analytics
                    </CardTitle>
                    <Badge>Latest</Badge>
                  </div>
                  <CardDescription>Released December 15, 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Added real-time financial analytics dashboard</li>
                    <li>• Improved employee performance tracking</li>
                    <li>• Enhanced data export capabilities</li>
                    <li>• Bug fixes and performance improvements</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Version 2.0.0 - Major Platform Update
                  </CardTitle>
                  <CardDescription>Released November 20, 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Complete UI/UX redesign</li>
                    <li>• New asset management system</li>
                    <li>• Advanced budgeting tools</li>
                    <li>• Improved security measures</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/changelog">View Full Changelog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
