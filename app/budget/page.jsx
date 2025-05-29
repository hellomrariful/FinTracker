import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { BudgetCategoryList } from "@/components/budget/BudgetCategoryList";

export default function BudgetPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
      
      <BudgetOverview />
      
      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
          <CardDescription>
            Manage your budget allocation by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetCategoryList />
        </CardContent>
      </Card>
    </div>
  );
}