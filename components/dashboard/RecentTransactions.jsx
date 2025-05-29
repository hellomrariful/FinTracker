"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: 1,
    type: "income",
    description: "Client Project - Website Redesign",
    amount: 2500.00,
    category: "Web Development",
    date: "2023-10-15",
  },
  {
    id: 2,
    type: "expense",
    description: "Adobe Creative Cloud",
    amount: 52.99,
    category: "Software",
    date: "2023-10-14",
  },
  {
    id: 3,
    type: "expense",
    description: "Facebook Ads",
    amount: 350.00,
    category: "Advertising",
    date: "2023-10-12",
  },
  {
    id: 4,
    type: "income",
    description: "SEO Consulting - Acme Corp",
    amount: 1200.00,
    category: "Consulting",
    date: "2023-10-10",
  },
  {
    id: 5,
    type: "expense",
    description: "Office Supplies",
    amount: 85.75,
    category: "Office",
    date: "2023-10-08",
  },
];

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full mr-4",
            transaction.type === "income" 
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300" 
              : "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300"
          )}>
            {transaction.type === "income" ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownLeft className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.description}
            </p>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{new Date(transaction.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
              <span>·</span>
              <Badge variant="outline" className="text-xs">
                {transaction.category}
              </Badge>
            </div>
          </div>
          <div className={cn(
            "font-medium",
            transaction.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}>
            {transaction.type === "income" ? "+" : "-"}
            ${transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}