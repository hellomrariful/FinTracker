import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IncomeTable } from "@/components/income/IncomeTable";
import { IncomeFilterBar } from "@/components/income/IncomeFilterBar";
import { IncomeStats } from "@/components/income/IncomeStats";

export default function IncomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Income</h1>
        <IncomeFilterBar />
      </div>
      
      <IncomeStats />
      
      <Card>
        <CardHeader>
          <CardTitle>Income Transactions</CardTitle>
          <CardDescription>
            Manage and track all your income sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IncomeTable />
        </CardContent>
      </Card>
    </div>
  );
}