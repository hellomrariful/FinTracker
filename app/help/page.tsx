import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Video,
  MessageCircle,
  Mail,
  ArrowRight,
  HelpCircle,
  Settings,
  CreditCard,
  Shield,
  BarChart3,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center | FinTracker",
  description:
    "Get help with FinTracker. Find answers to common questions, tutorials, and contact support.",
};

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Set up your account and connect your first data sources",
    icon: BookOpen,
    articles: 12,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "dashboard",
    title: "Dashboard & Analytics",
    description: "Understanding your financial dashboard and reports",
    icon: BarChart3,
    articles: 8,
    color: "bg-green-500/10 text-green-600",
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect FinTracker with your existing tools and platforms",
    icon: Settings,
    articles: 15,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    id: "billing",
    title: "Billing & Plans",
    description: "Manage your subscription, billing, and plan changes",
    icon: CreditCard,
    articles: 6,
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    id: "security",
    title: "Security & Privacy",
    description: "Account security, data protection, and privacy settings",
    icon: Shield,
    articles: 9,
    color: "bg-red-500/10 text-red-600",
  },
  {
    id: "team",
    title: "Team Management",
    description: "Add team members, set permissions, and manage access",
    icon: Users,
    articles: 7,
    color: "bg-teal-500/10 text-teal-600",
  },
];

const popularArticles = [
  {
    id: 1,
    title: "How to connect your Facebook Ads account",
    category: "Integrations",
    views: "2.1k views",
    helpful: 89,
  },
  {
    id: 2,
    title: "Understanding your ROI calculations",
    category: "Dashboard & Analytics",
    views: "1.8k views",
    helpful: 94,
  },
  {
    id: 3,
    title: "Setting up your first financial dashboard",
    category: "Getting Started",
    views: "1.5k views",
    helpful: 92,
  },
  {
    id: 4,
    title: "Managing team permissions and access",
    category: "Team Management",
    views: "1.2k views",
    helpful: 87,
  },
  {
    id: 5,
    title: "Troubleshooting data sync issues",
    category: "Integrations",
    views: "1.1k views",
    helpful: 85,
  },
];

const supportOptions = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    availability: "Mon-Fri, 9am-6pm PST",
    icon: MessageCircle,
    action: "Start Chat",
    primary: true,
  },
  {
    title: "Email Support",
    description: "Send us a detailed message about your issue",
    availability: "Response within 24 hours",
    icon: Mail,
    action: "Send Email",
    primary: false,
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step guides and tutorials",
    availability: "Available 24/7",
    icon: Video,
    action: "Watch Videos",
    primary: false,
  },
];

export default function HelpPage() {
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
              <HelpCircle className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Help Center</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">
              How can we <span className="text-primary">help you</span>?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to your questions, learn how to use FinTracker, or
              get in touch with our support team.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">
              Find the help you need organized by topic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
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
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {category.articles} articles
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    Browse articles
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Articles</h2>
            <p className="text-muted-foreground text-lg">
              The most helpful articles from our community.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <Card
                  key={article.id}
                  className="group cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span>{article.views}</span>
                          <span>{article.helpful}% found helpful</span>
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

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-muted-foreground text-lg">
              Can't find what you're looking for? Our support team is here to
              help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {supportOptions.map((option, index) => (
              <Card
                key={index}
                className={`text-center ${
                  option.primary
                    ? "border-primary shadow-lg scale-105"
                    : "hover:shadow-md"
                } transition-all duration-200`}
              >
                <CardHeader>
                  <div className="mx-auto mb-4">
                    <div
                      className={`p-4 rounded-full ${
                        option.primary
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <option.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{option.description}</p>
                  <div className="text-sm text-muted-foreground">
                    {option.availability}
                  </div>
                  <Button
                    className="w-full"
                    variant={option.primary ? "default" : "outline"}
                  >
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/contact"
                className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-center"
              >
                <div className="text-sm font-medium">Contact Us</div>
              </Link>
              <Link
                href="/pricing"
                className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-center"
              >
                <div className="text-sm font-medium">View Pricing</div>
              </Link>
              <Link
                href="/security"
                className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-center"
              >
                <div className="text-sm font-medium">Security Info</div>
              </Link>
              <Link
                href="/roadmap"
                className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-center"
              >
                <div className="text-sm font-medium">Product Roadmap</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
