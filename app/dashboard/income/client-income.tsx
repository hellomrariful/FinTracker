"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DollarSign,
  Plus,
  Search,
  Edit,
  Trash2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Building,
  Loader2,
} from "lucide-react";
import { IncomeForm } from "@/components/dashboard/income-form";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

type IncomeTransaction = {
  id: string;
  name: string;
  source: string;
  category: string;
  platform?: string;
  amount: number;
  date: string;
  paymentMethod: string;
  employeeId?:
    | string
    | { _id: string; name: string; email: string; avatar?: string };
  status: string;
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
  lifetimeIncome: number;
  thisMonthIncome: number;
  lastMonthIncome: number;
  incomeGrowth: number;
  bySource: Record<string, number>;
  byEmployee: Record<string, number>;
  highestSource: [string, number];
  topEarner?: Employee & { totalIncome: number };
};

type ClientIncomeProps = {
  initialShowAddDialog?: boolean;
};

export function ClientIncome({
  initialShowAddDialog = false,
}: ClientIncomeProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [incomeTransactions, setIncomeTransactions] = useState<
    IncomeTransaction[]
  >([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(initialShowAddDialog);
  const [editingIncome, setEditingIncome] = useState<IncomeTransaction | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Function to fetch all required data
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const startOfMonth = new Date(currentYear, currentMonth, 1)
        .toISOString()
        .split("T")[0];
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0)
        .toISOString()
        .split("T")[0];
      const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1)
        .toISOString()
        .split("T")[0];
      const endOfLastMonth = new Date(currentYear, currentMonth, 0)
        .toISOString()
        .split("T")[0];

      // Fetch all required data in parallel using authenticated API client with error handling
      const [
        incomeResponse,
        employeesResponse,
        categoriesResponse,
        statsResponse,
      ] = await Promise.all([
        api.get<any>("/api/income").catch((err) => {
          console.error("Failed to fetch income:", err);
          return { data: { incomes: [] } };
        }),
        api.get<any>("/api/employees").catch((err) => {
          console.error("Failed to fetch employees:", err);
          return { data: { data: [] } };
        }),
        api.get<any>("/api/categories?type=income").catch((err) => {
          console.error("Failed to fetch categories:", err);
          return { data: { data: [] } };
        }),
        Promise.all([
          api.get<any>("/api/income/statistics").catch((err) => {
            console.error("Failed to fetch lifetime stats:", err);
            return { data: { statistics: { totalIncome: 0 } } };
          }),
          api
            .get<any>(
              `/api/income/statistics?startDate=${startOfMonth}&endDate=${endOfMonth}`
            )
            .catch((err) => {
              console.error("Failed to fetch current month stats:", err);
              return { data: { statistics: { totalIncome: 0 } } };
            }),
          api
            .get<any>(
              `/api/income/statistics?startDate=${startOfLastMonth}&endDate=${endOfLastMonth}`
            )
            .catch((err) => {
              console.error("Failed to fetch last month stats:", err);
              return { data: { statistics: { totalIncome: 0 } } };
            }),
          api.get<any>("/api/employees/performance?months=1").catch((err) => {
            console.error("Failed to fetch employee performance:", err);
            return { data: [] };
          }),
        ]),
      ]);

      // Set income transactions - ensure it's always an array
      // API returns { success: true, data: { incomes: [...] } }
      const incomeData =
        incomeResponse?.data?.incomes || incomeResponse?.incomes || [];
      console.log("Income API Response:", incomeResponse);
      console.log("Extracted income data:", incomeData);
      // Map _id to id for consistency and ensure unique keys
      const mappedIncome = Array.isArray(incomeData)
        ? incomeData.map((income: any) => ({
            ...income,
            id:
              income._id ||
              income.id ||
              `income-${Date.now()}-${Math.random()}`,
          }))
        : [];
      setIncomeTransactions(mappedIncome);

      // Set employees
      // API might return { success: true, data: { data: [...] } } or { success: true, data: [...] }
      const employeesData =
        employeesResponse?.data?.data || employeesResponse?.data || [];
      setEmployees(Array.isArray(employeesData) ? employeesData : []);

      // Set categories - extract from data property
      // API returns { success: true, data: [...] }
      const categoriesData =
        categoriesResponse?.data?.data || categoriesResponse?.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      // Extract and process statistics with proper error handling
      const [lifetimeStats, currentMonthStats, lastMonthStats, employeeStats] =
        statsResponse;

      // Safely extract employee data
      const employeeData = Array.isArray(employeeStats?.data?.data)
        ? employeeStats.data.data
        : Array.isArray(employeeStats?.data)
        ? employeeStats.data
        : [];

      // Find top earner from actual income transactions if API data is not available
      let topEmployee = employeeData[0]; // First employee is the top earner due to sorting

      if (!topEmployee && incomeData.length > 0) {
        // Calculate top earner from current income transactions
        const employeeIncomeMap = new Map();
        incomeData.forEach((income: any) => {
          if (income.employeeId && typeof income.employeeId === "object") {
            const empId = income.employeeId._id;
            const empName = income.employeeId.name;
            const current = employeeIncomeMap.get(empId) || {
              name: empName,
              totalIncome: 0,
              transactions: 0,
            };
            current.totalIncome += income.amount;
            current.transactions += 1;
            employeeIncomeMap.set(empId, current);
          }
        });

        if (employeeIncomeMap.size > 0) {
          const topEarnerEntry = Array.from(employeeIncomeMap.entries()).sort(
            ([, a], [, b]) => b.totalIncome - a.totalIncome
          )[0];
          if (topEarnerEntry) {
            topEmployee = {
              id: topEarnerEntry[0],
              name: topEarnerEntry[1].name,
              totalIncome: topEarnerEntry[1].totalIncome,
              transactions: topEarnerEntry[1].transactions,
            };
          }
        }
      }

      // Get total income from statistics response
      const lifetimeTotal = lifetimeStats?.data?.statistics?.totalIncome || 0;
      const currentMonthTotal =
        currentMonthStats?.data?.statistics?.totalIncome || 0;
      const lastMonthTotal = lastMonthStats?.data?.statistics?.totalIncome || 0;

      const incomeGrowth =
        lastMonthTotal > 0
          ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
          : 0;

      // Get source stats from API response or compute from transactions
      const sourceStats = lifetimeStats?.data?.statistics?.incomeBySource;
      const bySource = Array.isArray(sourceStats)
        ? sourceStats.reduce((acc: Record<string, number>, item: any) => {
            acc[item._id] = item.total;
            return acc;
          }, {})
        : incomeData.reduce(
            (acc: Record<string, number>, inc: IncomeTransaction) => {
              acc[inc.source] = (acc[inc.source] || 0) + inc.amount;
              return acc;
            },
            {}
          );

      const highestSource: [string, number] = (
        Object.entries(bySource) as [string, number][]
      )
        .sort(([, a], [, b]) => b - a)
        .at(0) || ["", 0];

      setStats({
        lifetimeIncome: lifetimeTotal,
        thisMonthIncome: currentMonthTotal,
        lastMonthIncome: lastMonthTotal,
        incomeGrowth,
        bySource,
        byEmployee: employeeData.reduce(
          (acc: Record<string, number>, emp: any) => {
            acc[emp.id] = emp.totalIncome;
            return acc;
          },
          {}
        ),
        highestSource,
        topEarner: topEmployee,
      });
    } catch (error) {
      console.error("Error fetching income data:", error);
      toast.error("Failed to load income data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Get unique sources for dropdown - filter out empty strings
  const existingSources = Array.isArray(incomeTransactions)
    ? [...new Set(incomeTransactions.map((t) => t.source))].filter(
        (source) => source && source.trim() !== ""
      )
    : [];

  // Filter income transactions based on search
  const filteredIncomeTransactions = Array.isArray(incomeTransactions)
    ? incomeTransactions.filter(
        (income) =>
          income.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          income.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          income.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (income.platform &&
            income.platform.toLowerCase().includes(searchTerm.toLowerCase())) ||
          employees
            .find((e) => e.id === income.employeeId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSuccess = () => {
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this income transaction?")) {
      try {
        await api.delete(`/api/income/${id}`);
        await fetchData();
        toast.success("Income transaction deleted successfully");
      } catch (error) {
        console.error("Error deleting income:", error);
        toast.error("Failed to delete income transaction");
      }
    }
  };

  const handleEditClick = (income: IncomeTransaction) => {
    setEditingIncome(income);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading income data...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading stats...</p>
          </div>
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
              Income Management
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track and manage all your income sources and revenue streams.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Income</DialogTitle>
                <DialogDescription>
                  Enter the details of your new income transaction.
                </DialogDescription>
              </DialogHeader>
              <IncomeForm
                employees={employees}
                categories={categories}
                existingSources={existingSources}
                onSuccess={handleSuccess}
                onClose={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lifetime Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${stats.lifetimeIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total accumulated income
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                ${stats.thisMonthIncome.toLocaleString()}
              </div>
              <div
                className={`flex items-center text-xs mt-1 ${
                  stats.incomeGrowth >= 0 ? "text-accent" : "text-destructive"
                }`}
              >
                {stats.incomeGrowth >= 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                {Math.abs(stats.incomeGrowth).toFixed(1)}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Source</CardTitle>
              <Building className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-chart-3">
                {stats.highestSource[0] || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${stats.highestSource[1].toLocaleString()} earned
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Earner</CardTitle>
              <User className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              {stats.topEarner ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={stats.topEarner.avatar} />
                      <AvatarFallback className="text-xs">
                        {stats.topEarner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-bold text-chart-4 truncate">
                        {stats.topEarner.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stats.topEarner.transactions || 0} transactions
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-chart-4">
                    ${stats.topEarner.totalIncome.toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="text-sm text-muted-foreground">No data</div>
                  <div className="text-xs text-muted-foreground">
                    Assign employees to income
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Income Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Income Transactions</CardTitle>
            <CardDescription>
              Manage and track all your income transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search income transactions..."
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
                    <TableHead className="w-10">Select</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Source</TableHead>
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
                  {filteredIncomeTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        {searchTerm ? (
                          <p className="text-muted-foreground">
                            No income transactions match your search
                          </p>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-muted-foreground">
                              No income transactions yet
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsAddDialogOpen(true)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Your First Income
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredIncomeTransactions.map((income) => {
                      // Handle both populated and non-populated employee data
                      const employee =
                        typeof income.employeeId === "object" &&
                        income.employeeId !== null
                          ? {
                              id: income.employeeId._id,
                              name: income.employeeId.name,
                              avatar: income.employeeId.avatar,
                            } // Use populated employee data directly
                          : employees.find((e) => e.id === income.employeeId); // Find by ID if not populated
                      return (
                        <TableRow key={income.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.has(income.id)}
                              onCheckedChange={() => {
                                const next = new Set(selectedIds);
                                if (next.has(income.id)) next.delete(income.id);
                                else next.add(income.id);
                                setSelectedIds(next);
                              }}
                              aria-label={`Select ${income.name}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {income.name}
                          </TableCell>
                          <TableCell>{income.source}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{income.category}</Badge>
                          </TableCell>
                          <TableCell>{income.platform || "-"}</TableCell>
                          <TableCell className="font-mono text-accent">
                            ${income.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>{income.date}</TableCell>
                          <TableCell>{income.paymentMethod}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={employee?.avatar} />
                                <AvatarFallback className="text-xs">
                                  {employee?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("") || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {employee?.name || "Unknown"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(income)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(income.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Income</DialogTitle>
              <DialogDescription>
                Update the income transaction details.
              </DialogDescription>
            </DialogHeader>
            <IncomeForm
              income={editingIncome || undefined}
              employees={employees}
              categories={categories}
              existingSources={existingSources}
              onSuccess={handleSuccess}
              onClose={() => {
                setIsEditDialogOpen(false);
                setEditingIncome(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
