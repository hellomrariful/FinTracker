import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ExpenseFilterBar } from "@/components/expenses/ExpenseFilterBar";
import { ExpenseStats } from "@/components/expenses/ExpenseStats";

export default function ExpensesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <ExpenseFilterBar />
      </div>
      
      <ExpenseStats />
      
      <Card>
        <CardHeader>
          <CardTitle>Expense Transactions</CardTitle>
          <CardDescription>
            Manage and track all your business expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable />
        </CardContent>
      </Card>
    </div>
  );
}