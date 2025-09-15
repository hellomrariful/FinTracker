import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | FinTracker",
  description:
    "Financial insights, tips, and best practices for digital businesses. Learn how to optimize your finances with FinTracker.",
};

const blogPosts = [
  {
    id: 1,
    title: "5 Financial Metrics Every Digital Agency Should Track",
    excerpt:
      "Discover the key performance indicators that separate profitable agencies from struggling ones. Learn how to measure what matters most.",
    author: "Sarah Chen",
    date: "2025-01-10",
    readTime: "8 min read",
    category: "Analytics",
    featured: true,
    image: "/blog/financial-metrics.jpg",
  },
  {
    id: 2,
    title: "How to Calculate True ROI for Your Marketing Campaigns",
    excerpt:
      "Stop guessing and start measuring. A comprehensive guide to calculating accurate ROI that includes all hidden costs and attribution models.",
    author: "Marcus Rodriguez",
    date: "2025-01-08",
    readTime: "12 min read",
    category: "Marketing",
    featured: true,
    image: "/blog/roi-calculation.jpg",
  },
  {
    id: 3,
    title: "The Hidden Costs of Running a Digital Business",
    excerpt:
      "From software subscriptions to payment processing fees, learn how to identify and track all the expenses that eat into your profits.",
    author: "Emily Watson",
    date: "2025-01-05",
    readTime: "6 min read",
    category: "Finance",
    featured: false,
    image: "/blog/hidden-costs.jpg",
  },
  {
    id: 4,
    title: "Building a Financial Dashboard That Actually Works",
    excerpt:
      "Design principles and best practices for creating financial dashboards that provide actionable insights, not just pretty charts.",
    author: "David Kim",
    date: "2025-01-03",
    readTime: "10 min read",
    category: "Tools",
    featured: false,
    image: "/blog/dashboard-design.jpg",
  },
  {
    id: 5,
    title: "Cash Flow Management for Seasonal Businesses",
    excerpt:
      "Navigate the ups and downs of seasonal revenue with smart cash flow strategies and financial planning techniques.",
    author: "Lisa Thompson",
    date: "2024-12-28",
    readTime: "7 min read",
    category: "Planning",
    featured: false,
    image: "/blog/cash-flow.jpg",
  },
  {
    id: 6,
    title: "Automating Your Financial Reporting: A Step-by-Step Guide",
    excerpt:
      "Save hours every week by automating your financial reports. Learn which tools to use and how to set up effective automation workflows.",
    author: "Alex Johnson",
    date: "2024-12-25",
    readTime: "15 min read",
    category: "Automation",
    featured: false,
    image: "/blog/automation.jpg",
  },
];

const categories = [
  "All",
  "Analytics",
  "Marketing",
  "Finance",
  "Tools",
  "Planning",
  "Automation",
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">
              Financial Insights for{" "}
              <span className="text-primary">Digital Businesses</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Expert tips, strategies, and best practices to help you optimize
              your business finances and boost profitability.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === "All" ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Articles</h2>
            <p className="text-muted-foreground">
              Our most popular and impactful content for growing businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      Featured Article
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {post.author}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Articles</h2>
            <p className="text-muted-foreground">
              Stay updated with the latest financial insights and strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card
                key={post.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-1/20 to-chart-2/20 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      by {post.author}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Stay Updated with Financial Insights
            </h2>
            <p className="text-muted-foreground mb-8">
              Get weekly tips and strategies delivered to your inbox. No spam,
              just valuable content for growing businesses.
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
              Join 1,000+ business owners already subscribed
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
