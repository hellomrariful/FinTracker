"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setIsSubmitting(false);
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Have questions about Fintracker? Our team is here to help you
            succeed.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Let's talk about your financial goals
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you're just getting started or looking to scale, we're
              here to help you make the most of Fintracker.
            </p>

            <div className="mt-12 space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Email us
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    hello@fintracker.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    support@fintracker.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Call us
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    +1 (555) 123-4567
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mon-Fri 9am-6pm PST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10 border border-chart-3/20">
                  <MapPin className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Visit us
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    123 Innovation Drive
                  </p>
                  <p className="text-sm text-muted-foreground">
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10 border border-chart-4/20">
                  <Clock className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Business hours
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 9am - 6pm PST
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Weekend: Emergency support only
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-8 border-t border-border">
                <h3 className="text-base font-semibold text-foreground mb-4">
                  Follow Us
                </h3>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href="https://www.linkedin.com/company/fintrackeriox"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href="https://x.com/hellomrariful"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href="https://www.youtube.com/@FinTracker-io"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      YouTube
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Stay updated with the latest FinTracker news and tips
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">How can we help?</Label>
                <Select name="subject">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales inquiry</SelectItem>
                    <SelectItem value="support">Technical support</SelectItem>
                    <SelectItem value="billing">Billing question</SelectItem>
                    <SelectItem value="partnership">
                      Partnership opportunity
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us more about your needs..."
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Sending..." : "Send message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
