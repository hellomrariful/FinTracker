"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, Mail, Share2 } from "lucide-react";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("income");
  const [dateRange, setDateRange] = useState("month");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Select defaultValue={selectedReport} onValueChange={setSelectedReport}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income Report</SelectItem>
            <SelectItem value="expenses">Expense Report</SelectItem>
            <SelectItem value="profit">Profit & Loss</SelectItem>
            <SelectItem value="tax">Tax Summary</SelectItem>
            <SelectItem value="budget">Budget Analysis</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        
        {dateRange === "custom" && (
          <div className="flex gap-2">
            <Input type="date" className="w-[150px]" />
            <Input type="date" className="w-[150px]" />
          </div>
        )}
        
        <div className="flex gap-2 ml-auto">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>
              Your recent report history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Monthly Income Report",
                  date: "2023-10-15",
                  type: "Income Report",
                  format: "PDF"
                },
                {
                  name: "Q3 Expense Summary",
                  date: "2023-10-01",
                  type: "Expense Report",
                  format: "Excel"
                },
                {
                  name: "Annual Tax Report",
                  date: "2023-09-30",
                  type: "Tax Summary",
                  format: "PDF"
                },
                {
                  name: "Budget vs Actual",
                  date: "2023-09-15",
                  type: "Budget Analysis",
                  format: "Excel"
                }
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.type} • Generated on {report.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{report.format}</Badge>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}