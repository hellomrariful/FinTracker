import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Heart,
  Zap,
  Target,
  Coffee,
  Laptop,
  Globe,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | FinTracker",
  description:
    "Join the FinTracker team and help build the future of financial management for digital businesses.",
};

const openPositions = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Build scalable financial analytics platform using React, Node.js, and modern cloud technologies.",
    requirements: [
      "5+ years full-stack development experience",
      "Strong React and Node.js skills",
      "Experience with financial or fintech products",
      "AWS/cloud infrastructure knowledge",
    ],
  },
  {
    id: 2,
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description:
      "Drive product positioning, messaging, and go-to-market strategy for our financial management platform.",
    requirements: [
      "3+ years product marketing experience",
      "B2B SaaS background preferred",
      "Strong analytical and communication skills",
      "Experience with digital marketing tools",
    ],
  },
  {
    id: 3,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    description:
      "Help our customers maximize value from FinTracker and drive retention and expansion.",
    requirements: [
      "2+ years customer success experience",
      "Strong relationship building skills",
      "Experience with SaaS platforms",
      "Financial services background a plus",
    ],
  },
  {
    id: 4,
    title: "Data Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Build robust data pipelines and integrations to power our financial analytics platform.",
    requirements: [
      "3+ years data engineering experience",
      "Strong Python and SQL skills",
      "Experience with ETL/ELT processes",
      "Knowledge of data warehousing concepts",
    ],
  },
];

const benefits = [
  {
    icon: Globe,
    title: "Remote-First Culture",
    description:
      "Work from anywhere with flexible hours and async communication",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance and wellness stipend",
  },
  {
    icon: Laptop,
    title: "Equipment & Setup",
    description: "Top-tier equipment and home office setup allowance",
  },
  {
    icon: Target,
    title: "Growth & Learning",
    description: "Professional development budget and conference attendance",
  },
  {
    icon: Coffee,
    title: "Team Retreats",
    description: "Annual team retreats and quarterly virtual events",
  },
  {
    icon: Zap,
    title: "Equity & Ownership",
    description: "Competitive equity package with upside potential",
  },
];

const values = [
  {
    title: "Customer Obsession",
    description:
      "We're relentlessly focused on solving real problems for digital businesses and making their financial management effortless.",
  },
  {
    title: "Move Fast, Think Long-term",
    description:
      "We ship quickly and iterate based on feedback, while building sustainable solutions that scale.",
  },
  {
    title: "Transparency & Trust",
    description:
      "We communicate openly, share context freely, and build trust through consistent actions and honest feedback.",
  },
  {
    title: "Continuous Learning",
    description:
      "We embrace curiosity, learn from failures, and constantly improve our skills and processes.",
  },
];

export default function CareersPage() {
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
              <Users className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Careers</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">
              Build the Future of{" "}
              <span className="text-primary">Financial Management</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our mission to empower digital businesses with intelligent
              financial tools. We're a remote-first team building the next
              generation of fintech solutions.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>Remote-First</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>15+ Team Members</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Series A Funded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're looking for talented individuals who are passionate about
              building great products and solving complex problems.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openPositions.map((position) => (
              <Card
                key={position.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {position.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{position.department}</Badge>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {position.type}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {position.description}
                  </p>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      Key Requirements:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {position.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Don't see a role that fits? We're always looking for exceptional
              talent.
            </p>
            <Button variant="outline" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Join FinTracker?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We believe in creating an environment where our team can do their
              best work and grow their careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These principles guide how we work, make decisions, and build
              products that our customers love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Hiring Process</h2>
              <p className="text-muted-foreground text-lg">
                We've designed our process to be transparent, efficient, and
                respectful of your time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Application</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your application and we'll review it within 48 hours
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Initial Call</h3>
                <p className="text-sm text-muted-foreground">
                  30-minute chat to discuss your background and the role
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Technical/Skills</h3>
                <p className="text-sm text-muted-foreground">
                  Role-specific assessment or portfolio review
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">Team Interview</h3>
                <p className="text-sm text-muted-foreground">
                  Meet the team and discuss culture fit and collaboration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Join Us?</h2>
            <p className="text-muted-foreground mb-8">
              Be part of building the future of financial management for digital
              businesses. We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Apply Now</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
