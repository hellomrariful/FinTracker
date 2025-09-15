"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content:
      "FinTracker transformed how we manage our agency finances. What used to take hours of spreadsheet work now happens automatically. Our ROI visibility has never been clearer.",
    author: {
      name: "Sarah Chen",
      role: "CEO",
      company: "Digital Growth Co",
      avatar: "/avatars/sarah.jpg",
      initials: "SC",
    },
    rating: 5,
    category: "Agency",
  },
  {
    id: 2,
    content:
      "As a performance marketer, tracking ad spend across platforms was a nightmare. FinTracker's unified dashboard gives me real-time insights that help optimize campaigns instantly.",
    author: {
      name: "Marcus Rodriguez",
      role: "Performance Marketing Manager",
      company: "Scale Media",
      avatar: "/avatars/marcus.jpg",
      initials: "MR",
    },
    rating: 5,
    category: "Marketing",
  },
  {
    id: 3,
    content:
      "The employee performance tracking feature is game-changing. We can now identify our top performers and optimize team compensation based on actual revenue contribution.",
    author: {
      name: "Emily Watson",
      role: "Operations Director",
      company: "TechFlow Solutions",
      avatar: "/avatars/emily.jpg",
      initials: "EW",
    },
    rating: 5,
    category: "Operations",
  },
  {
    id: 4,
    content:
      "FinTracker's expense categorization and ROI analytics helped us cut unnecessary costs by 30% while doubling our profitable campaigns. It pays for itself.",
    author: {
      name: "David Kim",
      role: "Founder",
      company: "Growth Hackers Inc",
      avatar: "/avatars/david.jpg",
      initials: "DK",
    },
    rating: 5,
    category: "Startup",
  },
  {
    id: 5,
    content:
      "The asset management feature keeps track of all our software subscriptions and hardware. No more surprise renewals or forgotten licenses eating into profits.",
    author: {
      name: "Lisa Thompson",
      role: "CFO",
      company: "Digital Dynamics",
      avatar: "/avatars/lisa.jpg",
      initials: "LT",
    },
    rating: 5,
    category: "Finance",
  },
  {
    id: 6,
    content:
      "Integration with our existing tools was seamless. The reporting features give our investors exactly what they need without manual data compilation.",
    author: {
      name: "Alex Johnson",
      role: "Co-founder",
      company: "AdTech Ventures",
      avatar: "/avatars/alex.jpg",
      initials: "AJ",
    },
    rating: 5,
    category: "SaaS",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Growing Businesses
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            See how FinTracker is helping digital businesses streamline their
            financial operations and boost profitability.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="text-sm leading-6 text-muted-foreground mb-6">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={testimonial.author.avatar}
                      alt={testimonial.author.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.author.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-foreground">
                      {testimonial.author.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.author.role} at {testimonial.author.company}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Join 500+ businesses already using FinTracker to optimize their
            finances
          </p>
        </div>
      </div>
    </section>
  );
}
