import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryList } from "@/components/categories/CategoryList";
import { CategoryStats } from "@/components/categories/CategoryStats";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
      
      <CategoryStats />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income Categories</CardTitle>
            <CardDescription>
              Manage income categories and track performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryList type="income" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>
              Manage expense categories and control spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryList type="expense" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}