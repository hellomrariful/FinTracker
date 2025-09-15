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
  Shield,
  Lock,
  Key,
  Database,
  Eye,
  AlertTriangle,
  CheckCircle,
  Server,
  Globe,
  Users,
  FileCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Security | FinTracker",
  description:
    "Learn about FinTracker's comprehensive security measures and data protection protocols.",
};

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description:
        "All data is encrypted in transit with TLS 1.3 and at rest with AES-256 encryption.",
      status: "Active",
    },
    {
      icon: Key,
      title: "Multi-Factor Authentication",
      description:
        "Secure your account with 2FA using authenticator apps or SMS verification.",
      status: "Available",
    },
    {
      icon: Database,
      title: "Secure Data Storage",
      description:
        "Financial data stored in SOC 2 compliant data centers with restricted access.",
      status: "Active",
    },
    {
      icon: Eye,
      title: "Privacy by Design",
      description:
        "Built with privacy-first principles and minimal data collection practices.",
      status: "Active",
    },
    {
      icon: Server,
      title: "Infrastructure Security",
      description:
        "Regular security audits, penetration testing, and vulnerability assessments.",
      status: "Ongoing",
    },
    {
      icon: Users,
      title: "Access Controls",
      description:
        "Role-based permissions and principle of least privilege access.",
      status: "Active",
    },
  ];

  const certifications = [
    {
      name: "SOC 2 Type II",
      status: "Certified",
      description: "Security, availability, and confidentiality controls",
    },
    {
      name: "ISO 27001",
      status: "In Progress",
      description: "Information security management system",
    },
    {
      name: "GDPR Compliant",
      status: "Certified",
      description: "European data protection regulation compliance",
    },
    {
      name: "CCPA Compliant",
      status: "Certified",
      description: "California consumer privacy act compliance",
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
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Security</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">
              Your Financial Data is{" "}
              <span className="text-primary">Secure</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We implement enterprise-grade security measures to protect your
              sensitive financial information. Your trust is our top priority.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                Bank-Level Security
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                SOC 2 Certified
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                GDPR Compliant
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Security Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive security measures designed to protect your financial
              data at every level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <Badge
                      variant={
                        feature.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Data Protection</h2>
              <p className="text-muted-foreground text-lg">
                How we protect your financial information throughout its
                lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Data at Rest
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">AES-256 encryption</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Encrypted database storage
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Secure backup systems</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Geographic data distribution
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Data in Transit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">TLS 1.3 encryption</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Certificate pinning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Secure API endpoints</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">HTTPS enforcement</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Compliance & Certifications
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We maintain the highest standards of compliance with industry
              regulations and best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                      {cert.name}
                    </CardTitle>
                    <Badge
                      variant={
                        cert.status === "Certified" ? "default" : "secondary"
                      }
                    >
                      {cert.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{cert.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Security Best Practices
              </h2>
              <p className="text-muted-foreground text-lg">
                How you can help keep your account secure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Account Security</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <strong>Use strong passwords:</strong> Create unique,
                      complex passwords with a mix of characters.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <strong>Enable 2FA:</strong> Add an extra layer of
                      security with two-factor authentication.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <strong>Regular reviews:</strong> Monitor your account
                      activity and review access logs.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Data Safety</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <strong>Secure connections:</strong> Always access
                      FinTracker through HTTPS connections.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <strong>Log out properly:</strong> Always log out when
                      using shared or public devices.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <strong>Report issues:</strong> Contact us immediately if
                      you notice suspicious activity.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Security Concerns?</h2>
            <p className="text-muted-foreground mb-8">
              If you discover a security vulnerability or have concerns about
              your account security, please contact our security team
              immediately.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button asChild>
                  <Link href="mailto:security@fintracker.io">
                    Report Security Issue
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Email: security@fintracker.io | Response time: &lt; 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
