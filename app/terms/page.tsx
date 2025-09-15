import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Scale,
  AlertTriangle,
  CreditCard,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | FinTracker",
  description:
    "Terms and conditions for using FinTracker financial management platform.",
};

export default function TermsPage() {
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
              <FileText className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Terms of Service</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
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
            {/* Agreement */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
              </div>
              <p>
                By accessing and using FinTracker ("Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our
                financial management platform operated by FinTracker ("us",
                "we", or "our").
              </p>
            </section>

            {/* Service Description */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Service Description</h2>
              <p>
                FinTracker is a comprehensive financial management platform
                designed for digital businesses. Our service provides:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Income and expense tracking</li>
                <li>Financial analytics and reporting</li>
                <li>Budget and goal management</li>
                <li>Asset and liability tracking</li>
                <li>Employee performance monitoring</li>
                <li>Data export and integration capabilities</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">User Accounts</h2>
              </div>

              <h3 className="text-xl font-medium">Account Creation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You must provide accurate and complete information when
                  creating an account
                </li>
                <li>
                  You are responsible for maintaining the security of your
                  account credentials
                </li>
                <li>You must be at least 18 years old to create an account</li>
                <li>
                  One person or entity may not maintain more than one free
                  account
                </li>
              </ul>

              <h3 className="text-xl font-medium">Account Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You are responsible for all activities that occur under your
                  account
                </li>
                <li>
                  You must notify us immediately of any unauthorized use of your
                  account
                </li>
                <li>You must not share your account credentials with others</li>
                <li>You must keep your contact information up to date</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Acceptable Use Policy</h2>

              <h3 className="text-xl font-medium">Permitted Uses</h3>
              <p>
                You may use FinTracker for legitimate business financial
                management purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tracking business income and expenses</li>
                <li>Managing budgets and financial goals</li>
                <li>Generating financial reports and analytics</li>
                <li>Monitoring employee performance metrics</li>
              </ul>

              <h3 className="text-xl font-medium">Prohibited Uses</h3>
              <p>You may not use FinTracker to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or attempt to hack the service</li>
                <li>Share or sell access to your account</li>
                <li>
                  Use the service for money laundering or illegal financial
                  activities
                </li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Overload our systems with excessive requests</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Payment Terms</h2>
              </div>

              <h3 className="text-xl font-medium">Subscription Plans</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Subscription fees are billed in advance on a monthly or annual
                  basis
                </li>
                <li>All fees are non-refundable except as required by law</li>
                <li>
                  We may change our pricing with 30 days' notice to existing
                  subscribers
                </li>
                <li>Failed payments may result in service suspension</li>
              </ul>

              <h3 className="text-xl font-medium">Free Trial</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Free trials are available for new users for a limited time
                </li>
                <li>
                  Credit card information may be required for trial activation
                </li>
                <li>
                  Trials automatically convert to paid subscriptions unless
                  cancelled
                </li>
                <li>Trial limitations may apply to certain features</li>
              </ul>
            </section>

            {/* Data and Privacy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Data and Privacy</h2>
              <p>
                Your privacy is important to us. Our collection and use of
                personal information is governed by our Privacy Policy, which is
                incorporated into these Terms by reference.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You retain ownership of your financial data</li>
                <li>We implement industry-standard security measures</li>
                <li>You can export your data at any time</li>
                <li>
                  We may use aggregated, anonymized data for service improvement
                </li>
              </ul>
            </section>

            {/* Service Availability */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Service Availability</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  We strive for 99.9% uptime but cannot guarantee uninterrupted
                  service
                </li>
                <li>
                  Scheduled maintenance will be announced in advance when
                  possible
                </li>
                <li>
                  We are not liable for service interruptions beyond our control
                </li>
                <li>
                  We may modify or discontinue features with reasonable notice
                </li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">
                  Limitation of Liability
                </h2>
              </div>
              <p>
                FinTracker is provided "as is" without warranties of any kind.
                We shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other
                intangible losses.
              </p>
              <p>
                Our total liability to you for any claim arising out of or
                relating to these Terms or our service shall not exceed the
                amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            {/* Termination */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Termination</h2>

              <h3 className="text-xl font-medium">By You</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may cancel your subscription at any time</li>
                <li>
                  Cancellation takes effect at the end of your current billing
                  period
                </li>
                <li>You can export your data before cancellation</li>
              </ul>

              <h3 className="text-xl font-medium">By Us</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  We may suspend or terminate accounts that violate these Terms
                </li>
                <li>We may terminate the service with 30 days' notice</li>
                <li>
                  We will provide data export opportunities before termination
                </li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will
                notify users of significant changes via email or through our
                service. Your continued use of FinTracker after changes
                constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: legal@fintracker.io</li>
                <li>Address: FinTracker Legal Team, [Your Address]</li>
                <li>Phone: [Your Phone Number]</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
