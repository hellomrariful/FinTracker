"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';

// Dynamically import the DashboardLayout with no SSR
const DashboardLayout = dynamic(
  () =>
    import("@/components/dashboard/dashboard-layout").then(
      (mod) => mod.DashboardLayout
    ),
  { ssr: false }
);
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Plus,
  Search,
  Edit,
  Trash2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

// Types
type ExpenseTransaction = {
  id: string;
  name: string;
  category: string;
  platform?: string;
  amount: number;
  date: string;
  paymentMethod: string;
  employeeId?: string;
  status: string;
  reimbursable?: boolean;
  reimbursementStatus?: 'pending' | 'approved' | 'rejected' | 'paid';
};

type Employee = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

type Category = {
  id: string;
  name: string;
  type: string;
};

type Stats = {
  lifetimeExpenses: number;
  thisMonthExpenses: number;
  lastMonthExpenses: number;
  expenseGrowth: number;
  byCategory: Record<string, number>;
  highestCategory: [string, number];
  byEmployee: Record<string, number>;
  topSpender?: Employee & { totalSpent: number };
};

type ClientExpensesProps = {
  initialShowAddDialog?: boolean;
};

export function ClientExpenses({
  initialShowAddDialog = false,
}: ClientExpensesProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<ExpenseTransaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(initialShowAddDialog);
  const [editingExpense, setEditingExpense] = useState<ExpenseTransaction | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Function to fetch all required data
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
      const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
      const endOfLastMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

      // Fetch all required data in parallel using authenticated API client
      const [expensesResponse, employeesResponse, categoriesResponse, statsResponse] = await Promise.all([
        api.get('/api/expenses'),
        api.get('/api/employees'),
        api.get('/api/categories?type=expense'),
        Promise.all([
          api.get('/api/expenses/statistics'),
          api.get(`/api/expenses/statistics?startDate=${startOfMonth}&endDate=${endOfMonth}`),
          api.get(`/api/expenses/statistics?startDate=${startOfLastMonth}&endDate=${endOfLastMonth}`),
          api.get('/api/employees/spending?months=1')
        ])
      ]);

      // Set expenses
      setExpenses(expensesResponse.data);
      
      // Set employees
      setEmployees(employeesResponse.data);
      
      // Set categories
      setCategories(categoriesResponse.data);

      // Extract and process statistics
      const [lifetimeStats, currentMonthStats, lastMonthStats, employeeStats] = statsResponse;
      const topEmployee = employeeStats.data[0]; // First employee is the top spender due to sorting
      
      const expenseGrowth = lastMonthStats.total > 0
        ? ((currentMonthStats.total - lastMonthStats.total) / lastMonthStats.total) * 100
        : 0;

      // Compute category stats from the expenses
      const byCategory = expensesResponse.data.reduce((acc: Record<string, number>, exp: ExpenseTransaction) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});

      const highestCategory: [string, number] = (Object.entries(byCategory) as [string, number][])
        .sort(([,a], [,b]) => b - a)
        .at(0) || ['', 0];

      setStats({
        lifetimeExpenses: lifetimeStats.total,
        thisMonthExpenses: currentMonthStats.total,
        lastMonthExpenses: lastMonthStats.total,
        expenseGrowth,
        byCategory,
        highestCategory,
        byEmployee: employeeStats.data.reduce((acc: Record<string, number>, emp: any) => {
          acc[emp.id] = emp.totalSpent;
          return acc;
        }, {}),
        topSpender: topEmployee
      });

    } catch (error) {
      console.error('Error fetching expense data:', error);
      toast.error('Failed to load expense data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter expenses based on search
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.platform &&
        expense.platform.toLowerCase().includes(searchTerm.toLowerCase())) ||
      employees
        .find((e) => e.id === expense.employeeId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setNewCategory("");
    setShowNewCategoryInput(false);
    setSelectedCategory("");
    setEditingExpense(null);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setShowNewCategoryInput(value === "new");
    if (value !== "new") {
      setNewCategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      let categoryName = selectedCategory;
      
      // Create new category if needed
      if (selectedCategory === "new" && newCategory.trim()) {
        const newCat = await api.post('/api/categories', {
          name: newCategory.trim(),
          type: 'expense'
        });
        
        categoryName = newCat.data.name;
        
        // Refresh categories list
        const updatedCategories = await api.get('/api/categories?type=expense');
        setCategories(updatedCategories.data);
      }

      const expenseData = {
        name: formData.get("name") as string,
        category: categoryName,
        platform: (formData.get("platform") as string) || undefined,
        amount: parseFloat(formData.get("amount") as string),
        date: formData.get("date") as string,
        paymentMethod: formData.get("paymentMethod") as string,
        employeeId: formData.get("employeeId") as string,
        status: "completed",
        reimbursable: false
      };

      if (editingExpense) {
        // Update existing expense
        await api.put(`/api/expenses/${editingExpense.id}`, expenseData);
        toast.success("Expense updated successfully");
        setIsEditDialogOpen(false);
      } else {
        // Create new expense
        await api.post('/api/expenses', expenseData);
        toast.success("Expense added successfully");
        setIsAddDialogOpen(false);
      }

      // Refresh all data
      await fetchData();
      resetForm();
      
    } catch (error) {
      console.error('Error submitting expense:', error);
      toast.error(editingExpense ? 'Failed to update expense' : 'Failed to add expense');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await api.delete(`/api/expenses/${id}`);
        toast.success("Expense deleted successfully");
        await fetchData(); // Refresh all data
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleEditClick = (expense: ExpenseTransaction) => {
    setEditingExpense(expense);
    setSelectedCategory(expense.category);
    setIsEditDialogOpen(true);
  };

  const handleDialogClose = (isAdd: boolean) => {
    if (isAdd) {
      setIsAddDialogOpen(false);
    } else {
      setIsEditDialogOpen(false);
    }
    resetForm();
  };

  const ExpenseForm = ({ expense }: { expense?: ExpenseTransaction }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name/Description</Label>
          <Input
            id="name"
            name="name"
            defaultValue={expense?.name}
            placeholder="Office supplies"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            defaultValue={expense?.amount}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter(
                  (category) => category.name && category.name.trim() !== ""
                )
                .map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              <SelectItem value="new">+ Add new category</SelectItem>
            </SelectContent>
          </Select>
          {showNewCategoryInput && (
            <Input
              placeholder="Enter new category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="platform">Platform/Vendor</Label>
          <Input
            id="platform"
            name="platform"
            defaultValue={expense?.platform}
            placeholder="Amazon, Google, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={expense?.date}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select name="paymentMethod" defaultValue={expense?.paymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="PayPal">PayPal</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Check">Check</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeeId">Employee</Label>
        <Select name="employeeId" defaultValue={expense?.employeeId}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name} - {employee.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="submit">
          {expense ? "Update Expense" : "Add Expense"}
        </Button>
      </DialogFooter>
    </form>
  );

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Expenses
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track and manage all your business expenses and spending.
            </p>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              if (!open) handleDialogClose(true);
              else setIsAddDialogOpen(true);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your new expense transaction.
                </DialogDescription>
              </DialogHeader>
              <ExpenseForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lifetime Expenses
              </CardTitle>
              <CreditCard className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ${stats?.lifetimeExpenses?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total all-time spending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">
                ${stats?.thisMonthExpenses?.toLocaleString() || '0'}
              </div>
              <div
                className={`flex items-center text-xs mt-1 ${
                  (stats?.expenseGrowth || 0) <= 0 ? "text-accent" : "text-destructive"
                }`}
              >
                {(stats?.expenseGrowth || 0) >= 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                {Math.abs(stats?.expenseGrowth || 0).toFixed(1)}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-5/10 to-chart-5/5 border-chart-5/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Category
              </CardTitle>
              <Filter className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-chart-5">
                {stats?.highestCategory?.[0] || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${(stats?.highestCategory?.[1] || 0).toLocaleString()} spent
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Spender</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-primary">
                {stats?.topSpender?.name || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${stats?.topSpender?.totalSpent?.toLocaleString() || "0"} spent
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Transactions</CardTitle>
            <CardDescription>
              Manage and track all your business expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => {
                    const employee = employees.find(
                      (e) => e.id === expense.employeeId
                    );
                    return (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell>{expense.platform || "-"}</TableCell>
                        <TableCell className="font-mono text-destructive">
                          ${expense.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                        <TableCell>{employee?.name || "Unknown"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleDialogClose(false);
            else setIsEditDialogOpen(true);
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>
                Update the expense transaction details.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm expense={editingExpense || undefined} />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
