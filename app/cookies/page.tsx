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
import {
  ArrowLeft,
  Cookie,
  Settings,
  Eye,
  BarChart3,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | FinTracker",
  description:
    "Learn about how FinTracker uses cookies and similar technologies.",
};

export default function CookiesPage() {
  const cookieTypes = [
    {
      icon: Shield,
      title: "Essential Cookies",
      description: "Required for basic site functionality and security",
      examples: [
        "Authentication tokens",
        "Session management",
        "Security preferences",
      ],
      canDisable: false,
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      description: "Remember your preferences and settings",
      examples: ["Language preferences", "Theme settings", "Dashboard layout"],
      canDisable: true,
    },
    {
      icon: BarChart3,
      title: "Analytics Cookies",
      description: "Help us understand how you use our service",
      examples: ["Page views", "Feature usage", "Performance metrics"],
      canDisable: true,
    },
    {
      icon: Eye,
      title: "Marketing Cookies",
      description: "Used to deliver relevant advertisements",
      examples: [
        "Ad preferences",
        "Campaign tracking",
        "Social media integration",
      ],
      canDisable: true,
    },
  ];

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
              <Cookie className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Cookie Policy</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground text-lg">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="grid gap-8">
            {/* Introduction */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences, keeping you signed
                in, and helping us understand how you use FinTracker.
              </p>
              <p>
                This Cookie Policy explains what cookies we use, why we use
                them, and how you can control them. By using FinTracker, you
                consent to our use of cookies as described in this policy.
              </p>
            </section>

            {/* Cookie Types */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">
                Types of Cookies We Use
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cookieTypes.map((type, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <type.icon className="h-5 w-5 text-primary" />
                        {type.title}
                      </CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Examples:</h4>
                        <ul className="text-sm space-y-1">
                          {type.examples.map((example, i) => (
                            <li key={i}>• {example}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Can be disabled:
                        </span>
                        <span
                          className={`text-sm ${
                            type.canDisable ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {type.canDisable ? "Yes" : "No"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Detailed Cookie Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Detailed Cookie Information
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Cookie Name
                      </th>
                      <th className="border border-border p-3 text-left">
                        Purpose
                      </th>
                      <th className="border border-border p-3 text-left">
                        Duration
                      </th>
                      <th className="border border-border p-3 text-left">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-mono text-sm">
                        ft_session
                      </td>
                      <td className="border border-border p-3">
                        Maintains your login session
                      </td>
                      <td className="border border-border p-3">Session</td>
                      <td className="border border-border p-3">Essential</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-mono text-sm">
                        ft_auth_token
                      </td>
                      <td className="border border-border p-3">
                        Authentication and security
                      </td>
                      <td className="border border-border p-3">30 days</td>
                      <td className="border border-border p-3">Essential</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-mono text-sm">
                        ft_preferences
                      </td>
                      <td className="border border-border p-3">
                        Stores your dashboard preferences
                      </td>
                      <td className="border border-border p-3">1 year</td>
                      <td className="border border-border p-3">Functional</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-mono text-sm">
                        ft_analytics
                      </td>
                      <td className="border border-border p-3">
                        Usage analytics and improvements
                      </td>
                      <td className="border border-border p-3">2 years</td>
                      <td className="border border-border p-3">Analytics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Third-Party Cookies</h2>
              <p>
                We may also use third-party services that set their own cookies.
                These include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Google Analytics:</strong> Helps us understand website
                  usage and performance
                </li>
                <li>
                  <strong>Intercom:</strong> Powers our customer support chat
                  system
                </li>
                <li>
                  <strong>Stripe:</strong> Processes payments securely (only on
                  payment pages)
                </li>
                <li>
                  <strong>Social Media:</strong> Enables social sharing and
                  login features
                </li>
              </ul>
              <p>
                These third parties have their own privacy policies and cookie
                practices. We recommend reviewing their policies to understand
                how they use cookies.
              </p>
            </section>

            {/* Managing Cookies */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Managing Your Cookie Preferences
              </h2>

              <h3 className="text-xl font-medium">Browser Settings</h3>
              <p>
                You can control cookies through your browser settings. Most
                browsers allow you to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>View and delete existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block third-party cookies</li>
                <li>Clear all cookies when you close the browser</li>
                <li>Set up notifications when cookies are set</li>
              </ul>

              <h3 className="text-xl font-medium">
                FinTracker Cookie Settings
              </h3>
              <p>
                You can also manage your cookie preferences directly in
                FinTracker:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <Button className="mb-4">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Cookie Preferences
                </Button>
                <p className="text-sm text-muted-foreground">
                  Click here to customize which cookies you allow FinTracker to
                  use.
                </p>
              </div>
            </section>

            {/* Impact of Disabling Cookies */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Impact of Disabling Cookies
              </h2>
              <p>
                While you can disable most cookies, please note that doing so
                may affect your experience with FinTracker:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Essential cookies:</strong> Disabling these will
                  prevent you from using FinTracker
                </li>
                <li>
                  <strong>Functional cookies:</strong> You'll need to reset
                  preferences each visit
                </li>
                <li>
                  <strong>Analytics cookies:</strong> We won't be able to
                  improve our service based on usage data
                </li>
                <li>
                  <strong>Marketing cookies:</strong> You may see less relevant
                  advertisements
                </li>
              </ul>
            </section>

            {/* Updates */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify you of any material changes
                by posting the updated policy on our website.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please
                contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: privacy@fintracker.io</li>
                <li>Address: FinTracker Privacy Team, [Your Address]</li>
                <li>Phone: [Your Phone Number]</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
