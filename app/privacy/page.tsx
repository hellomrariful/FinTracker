import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | FinTracker",
  description:
    "Learn how FinTracker protects your financial data and respects your privacy.",
};

export default function PrivacyPage() {
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
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
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
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Introduction</h2>
              </div>
              <p>
                At FinTracker, we understand that your financial data is among
                your most sensitive information. This Privacy Policy explains
                how we collect, use, protect, and share your information when
                you use our financial management platform.
              </p>
              <p>
                We are committed to transparency and giving you control over
                your data. This policy applies to all users of FinTracker's
                services, whether you're using our web application, mobile app,
                or API.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">
                  Information We Collect
                </h2>
              </div>

              <h3 className="text-xl font-medium">Account Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Company or business information</li>
                <li>Profile picture and preferences</li>
                <li>Authentication credentials (encrypted)</li>
              </ul>

              <h3 className="text-xl font-medium">Financial Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Income and expense transactions</li>
                <li>Budget and goal information</li>
                <li>Asset and liability records</li>
                <li>Employee performance data</li>
                <li>Category and tagging information</li>
              </ul>

              <h3 className="text-xl font-medium">Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Log data and analytics</li>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Feature usage and preferences</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">
                  How We Use Your Information
                </h2>
              </div>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service Provision:</strong> To provide, maintain, and
                  improve FinTracker's features
                </li>
                <li>
                  <strong>Analytics:</strong> To generate financial insights and
                  reports for your business
                </li>
                <li>
                  <strong>Communication:</strong> To send important updates,
                  security alerts, and support messages
                </li>
                <li>
                  <strong>Security:</strong> To detect fraud, prevent abuse, and
                  protect your account
                </li>
                <li>
                  <strong>Compliance:</strong> To meet legal and regulatory
                  requirements
                </li>
                <li>
                  <strong>Product Development:</strong> To develop new features
                  and improve existing ones
                </li>
              </ul>
            </section>

            {/* Data Protection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">
                  Data Protection & Security
                </h2>
              </div>

              <h3 className="text-xl font-medium">Encryption</h3>
              <p>
                All data is encrypted in transit using TLS 1.3 and at rest using
                AES-256 encryption. Your financial data is stored in encrypted
                databases with restricted access.
              </p>

              <h3 className="text-xl font-medium">Access Controls</h3>
              <p>
                We implement strict access controls, multi-factor
                authentication, and regular security audits. Only authorized
                personnel have access to systems containing user data.
              </p>

              <h3 className="text-xl font-medium">Data Backup</h3>
              <p>
                Your data is regularly backed up to secure, geographically
                distributed locations to ensure availability and disaster
                recovery.
              </p>
            </section>

            {/* Data Sharing */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">
                  Data Sharing & Third Parties
                </h2>
              </div>

              <p>
                We do not sell your personal or financial data. We may share
                information only in these limited circumstances:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service Providers:</strong> Trusted partners who help
                  us operate our service (hosting, analytics, support)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law,
                  court order, or to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In case of merger,
                  acquisition, or sale of assets (with user notification)
                </li>
                <li>
                  <strong>Consent:</strong> When you explicitly authorize us to
                  share specific information
                </li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Rights & Choices</h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account
                  and data
                </li>
                <li>
                  <strong>Portability:</strong> Export your data in a
                  machine-readable format
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing
                  communications
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or want to
                exercise your rights, contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: privacy@fintracker.io</li>
                <li>Address: FinTracker Privacy Team, [Your Address]</li>
                <li>Phone: [Your Phone Number]</li>
              </ul>
            </section>

            {/* Updates */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Policy Updates</h2>
              <p>
                We may update this Privacy Policy periodically. We'll notify you
                of significant changes via email or through our service. Your
                continued use of FinTracker after changes constitutes acceptance
                of the updated policy.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
