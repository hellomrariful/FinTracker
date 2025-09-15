import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Code,
  Book,
  Zap,
  Shield,
  ArrowRight,
  Copy,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "API Documentation | FinTracker",
  description:
    "Complete API documentation for FinTracker. Integrate financial data into your applications with our RESTful API.",
};

const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/v1/dashboard/overview",
    description: "Get financial overview and key metrics",
    auth: "Required",
  },
  {
    method: "GET",
    endpoint: "/api/v1/transactions",
    description: "Retrieve transaction history with filters",
    auth: "Required",
  },
  {
    method: "POST",
    endpoint: "/api/v1/transactions",
    description: "Create a new transaction record",
    auth: "Required",
  },
  {
    method: "GET",
    endpoint: "/api/v1/analytics/roi",
    description: "Get ROI analytics and performance metrics",
    auth: "Required",
  },
  {
    method: "GET",
    endpoint: "/api/v1/integrations",
    description: "List connected integrations and their status",
    auth: "Required",
  },
  {
    method: "POST",
    endpoint: "/api/v1/reports/generate",
    description: "Generate custom financial reports",
    auth: "Required",
  },
];

const sdks = [
  {
    name: "JavaScript/Node.js",
    description: "Official SDK for JavaScript and Node.js applications",
    install: "npm install @fintracker/sdk",
    docs: "/docs/sdk/javascript",
    status: "Stable",
  },
  {
    name: "Python",
    description: "Python SDK for data analysis and automation",
    install: "pip install fintracker-python",
    docs: "/docs/sdk/python",
    status: "Stable",
  },
  {
    name: "PHP",
    description: "PHP SDK for web applications and integrations",
    install: "composer require fintracker/php-sdk",
    docs: "/docs/sdk/php",
    status: "Beta",
  },
  {
    name: "Go",
    description: "Go SDK for high-performance applications",
    install: "go get github.com/fintracker/go-sdk",
    docs: "/docs/sdk/go",
    status: "Coming Soon",
  },
];

const quickStartSteps = [
  {
    step: 1,
    title: "Get API Key",
    description: "Generate your API key from the FinTracker dashboard",
    code: `// Navigate to Settings > API Keys
// Click "Generate New Key"
// Copy your API key securely`,
  },
  {
    step: 2,
    title: "Make Your First Request",
    description: "Test the API with a simple overview request",
    code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.fintracker.com/v1/dashboard/overview`,
  },
  {
    step: 3,
    title: "Handle the Response",
    description: "Process the JSON response in your application",
    code: `{
  "revenue": {
    "total": 125000,
    "growth": 15.2
  },
  "expenses": {
    "total": 85000,
    "categories": {...}
  },
  "profit": 40000
}`,
  },
];

const webhookEvents = [
  {
    event: "transaction.created",
    description: "Triggered when a new transaction is recorded",
  },
  {
    event: "integration.connected",
    description: "Fired when a new integration is successfully connected",
  },
  {
    event: "report.generated",
    description: "Sent when a scheduled report is generated",
  },
  {
    event: "alert.triggered",
    description: "Triggered when financial alerts are activated",
  },
];

export default function DocsPage() {
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
              <Code className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">API Documentation</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">
              Build with the{" "}
              <span className="text-primary">FinTracker API</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Integrate financial data and analytics into your applications with
              our powerful, developer-friendly REST API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#quick-start">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#api-reference">
                  API Reference
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get up and running with the FinTracker API in just a few minutes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {quickStartSteps.map((step) => (
                <Card key={step.step}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {step.step}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4 relative">
                      <pre className="text-sm overflow-x-auto">
                        <code>{step.code}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section id="api-reference" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">API Reference</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete reference for all available endpoints and methods.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="endpoints" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
              </TabsList>

              <TabsContent value="endpoints" className="mt-8">
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge
                              variant={
                                endpoint.method === "GET"
                                  ? "secondary"
                                  : "default"
                              }
                              className="font-mono"
                            >
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {endpoint.endpoint}
                            </code>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {endpoint.auth}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mt-2">
                          {endpoint.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="webhooks" className="mt-8">
                <div className="space-y-4">
                  {webhookEvents.map((webhook, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <Zap className="h-5 w-5 text-primary" />
                          <div>
                            <code className="text-sm font-semibold">
                              {webhook.event}
                            </code>
                            <p className="text-muted-foreground text-sm">
                              {webhook.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="authentication" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      API Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      The FinTracker API uses API keys for authentication.
                      Include your API key in the Authorization header of each
                      request.
                    </p>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-sm">
                        <code>
                          {`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
                        </code>
                      </pre>
                    </div>
                    <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Security Best Practices
                        </p>
                        <p className="text-sm text-blue-700">
                          Keep your API keys secure and never expose them in
                          client-side code. Rotate keys regularly and use
                          environment variables.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Official SDKs</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Use our official SDKs to integrate FinTracker into your preferred
              programming language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {sdks.map((sdk, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{sdk.name}</CardTitle>
                    <Badge
                      variant={
                        sdk.status === "Stable"
                          ? "default"
                          : sdk.status === "Beta"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {sdk.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    {sdk.description}
                  </p>
                  <div className="bg-muted rounded-lg p-3">
                    <code className="text-sm">{sdk.install}</code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={sdk.docs}>
                      View Documentation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-8">
              Our developer support team is here to help you integrate and build
              with the FinTracker API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help">Browse Help Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
