import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Clock,
  User,
  ArrowRight,
  TrendingUp,
  Settings,
  BarChart3,
  DollarSign,
  Users,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Guides | FinTracker",
  description:
    "Step-by-step guides and tutorials to help you get the most out of FinTracker. Learn best practices for financial management.",
};

const guideCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Essential guides for new users",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600",
    guides: 8,
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect your tools and platforms",
    icon: Settings,
    color: "bg-purple-500/10 text-purple-600",
    guides: 12,
  },
  {
    id: "analytics",
    title: "Analytics & Reports",
    description: "Master your financial analytics",
    icon: BarChart3,
    color: "bg-green-500/10 text-green-600",
    guides: 6,
  },
  {
    id: "optimization",
    title: "ROI Optimization",
    description: "Maximize your return on investment",
    icon: TrendingUp,
    color: "bg-orange-500/10 text-orange-600",
    guides: 9,
  },
  {
    id: "team",
    title: "Team Management",
    description: "Manage team access and permissions",
    icon: Users,
    color: "bg-teal-500/10 text-teal-600",
    guides: 5,
  },
  {
    id: "automation",
    title: "Automation",
    description: "Automate your financial workflows",
    icon: Zap,
    color: "bg-red-500/10 text-red-600",
    guides: 7,
  },
];

const featuredGuides = [
  {
    id: 1,
    title: "Complete Setup Guide: From Zero to Dashboard in 15 Minutes",
    description:
      "A comprehensive walkthrough to get your FinTracker account set up and your first integrations connected.",
    category: "Getting Started",
    readTime: "15 min",
    difficulty: "Beginner",
    author: "Sarah Chen",
    featured: true,
    image: "/guides/setup-guide.jpg",
  },
  {
    id: 2,
    title: "Mastering Facebook Ads Integration and ROI Tracking",
    description:
      "Learn how to connect Facebook Ads, track campaign performance, and calculate true ROI including all associated costs.",
    category: "Integrations",
    readTime: "20 min",
    difficulty: "Intermediate",
    author: "Marcus Rodriguez",
    featured: true,
    image: "/guides/facebook-ads.jpg",
  },
  {
    id: 3,
    title: "Building Custom Financial Dashboards That Drive Decisions",
    description:
      "Design and customize your financial dashboard to surface the metrics that matter most to your business.",
    category: "Analytics & Reports",
    readTime: "25 min",
    difficulty: "Intermediate",
    author: "Emily Watson",
    featured: true,
    image: "/guides/custom-dashboards.jpg",
  },
];

const popularGuides = [
  {
    id: 4,
    title: "Setting Up Automated Expense Categorization",
    category: "Automation",
    readTime: "10 min",
    views: "2.1k",
    helpful: 94,
  },
  {
    id: 5,
    title: "Tracking Employee Performance and Revenue Attribution",
    category: "Team Management",
    readTime: "18 min",
    views: "1.8k",
    helpful: 91,
  },
  {
    id: 6,
    title: "Google Ads Integration: Complete Setup and Optimization",
    category: "Integrations",
    readTime: "22 min",
    views: "1.6k",
    helpful: 89,
  },
  {
    id: 7,
    title: "Creating Investor-Ready Financial Reports",
    category: "Analytics & Reports",
    readTime: "16 min",
    views: "1.4k",
    helpful: 92,
  },
  {
    id: 8,
    title: "Multi-Business Management: Agencies and Consultants Guide",
    category: "Getting Started",
    readTime: "14 min",
    views: "1.2k",
    helpful: 88,
  },
];

const quickTips = [
  {
    title: "Use Tags for Better Organization",
    description:
      "Tag transactions and expenses for easier filtering and reporting",
    icon: DollarSign,
  },
  {
    title: "Set Up Automated Alerts",
    description: "Get notified when spending exceeds budgets or ROI drops",
    icon: TrendingUp,
  },
  {
    title: "Regular Data Sync Checks",
    description:
      "Ensure all integrations are syncing properly for accurate data",
    icon: Settings,
  },
  {
    title: "Weekly Performance Reviews",
    description:
      "Schedule weekly reviews to stay on top of financial performance",
    icon: BarChart3,
  },
];

export default function GuidesPage() {
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
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Guides</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">
              Master Your{" "}
              <span className="text-primary">Financial Management</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Step-by-step guides, best practices, and expert tips to help you
              get the most out of FinTracker and optimize your business
              finances.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search guides..."
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guide Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">
              Find guides organized by topic and expertise level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideCategories.map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg ${category.color} group-hover:scale-110 transition-transform`}
                    >
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {category.guides} guides
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    Browse guides
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Guides</h2>
            <p className="text-muted-foreground text-lg">
              Our most comprehensive and popular guides to get you started.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredGuides.map((guide) => (
              <Card
                key={guide.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      Featured Guide
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {guide.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        guide.difficulty === "Beginner"
                          ? "border-green-200 text-green-700"
                          : "border-orange-200 text-orange-700"
                      }`}
                    >
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {guide.author}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Guides */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Guides</h2>
            <p className="text-muted-foreground text-lg">
              The most helpful guides from our community.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {popularGuides.map((guide, index) => (
                <Card
                  key={guide.id}
                  className="group cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {guide.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {guide.readTime}
                          </div>
                          <span>{guide.views} views</span>
                          <span>{guide.helpful}% helpful</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Tips</h2>
            <p className="text-muted-foreground text-lg">
              Bite-sized tips to improve your financial management workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {quickTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <tip.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Get New Guides in Your Inbox
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to receive the latest guides, tips, and best practices
              for financial management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Join 2,000+ subscribers • No spam, unsubscribe anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
