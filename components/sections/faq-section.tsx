"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    id: "item-1",
    question: "How does FinTracker integrate with my existing tools?",
    answer:
      "FinTracker connects with popular platforms like Facebook Ads, Google Ads, Stripe, PayPal, QuickBooks, and many more through secure APIs. We also support CSV imports and manual data entry for any custom workflows.",
  },
  {
    id: "item-2",
    question: "Is my financial data secure?",
    answer:
      "Absolutely. We use bank-level security with AES-256 encryption, SOC 2 compliance, and never store sensitive banking credentials. All data is encrypted in transit and at rest, with regular security audits.",
  },
  {
    id: "item-3",
    question: "Can I track multiple businesses or clients?",
    answer:
      "Yes! FinTracker supports multi-business management. You can create separate workspaces for different businesses or clients, each with their own financial tracking, team access, and reporting.",
  },
  {
    id: "item-4",
    question: "How accurate is the ROI calculation?",
    answer:
      "Our ROI calculations are based on real-time data from your connected platforms. We track revenue attribution, factor in all associated costs (ads, tools, salaries), and provide detailed breakdowns so you can verify the accuracy.",
  },
  {
    id: "item-5",
    question: "What happens to my data if I cancel?",
    answer:
      "You own your data. Before canceling, you can export all your financial data, reports, and analytics. We provide a 30-day grace period to download everything, after which data is securely deleted.",
  },
  {
    id: "item-6",
    question: "Do you offer custom reporting?",
    answer:
      "Yes! Beyond our standard reports, you can create custom dashboards, set up automated report delivery, and export data in various formats (PDF, Excel, CSV) for deeper analysis or investor presentations.",
  },
  {
    id: "item-7",
    question: "How does employee performance tracking work?",
    answer:
      "You can assign revenue sources to team members and track their contribution to overall business performance. This includes campaign management, client relationships, and project-based revenue attribution.",
  },
  {
    id: "item-8",
    question: "Is there a mobile app?",
    answer:
      "Currently, FinTracker is web-based and fully responsive on mobile devices. A dedicated mobile app is on our roadmap for 2025, focusing on expense tracking and quick financial insights on the go.",
  },
  {
    id: "item-9",
    question: "What support do you provide?",
    answer:
      "We offer email support for all plans, with priority support for Pro and Enterprise users. This includes onboarding assistance, integration help, and ongoing technical support. Enterprise customers get dedicated account management.",
  },
  {
    id: "item-10",
    question: "Can I try FinTracker before committing?",
    answer:
      "Absolutely! We offer a 14-day free trial with full access to all features. No credit card required. You can also schedule a demo with our team to see how FinTracker fits your specific business needs.",
  },
];

export function FAQSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Everything you need to know about FinTracker. Can't find what you're
            looking for? Contact our support team.
          </p>
        </div>

        <div className="mt-16">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {displayedFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {!showAll && faqs.length > 5 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              className="gap-2"
            >
              Show {faqs.length - 5} More Questions
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        {showAll && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(false)}
              className="gap-2"
            >
              Show Less
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-muted/50 p-8">
            <h3 className="text-xl font-semibold mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you get the most out of FinTracker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
