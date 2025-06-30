'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Building
} from 'lucide-react';
import { dataStore, type IncomeTransaction } from '@/lib/data-store';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

export default function IncomePage() {
  const [incomeTransactions, setIncomeTransactions] = useState<IncomeTransaction[]>([]);
  const [employees, setEmployees] = useState(dataStore.getEmployees());
  const [categories, setCategories] = useState(dataStore.getCategories('income'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeTransaction | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newSource, setNewSource] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewSourceInput, setShowNewSourceInput] = useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    setIncomeTransactions(dataStore.getIncomeTransactions());
    if (searchParams.get('add') === 'true') {
      setIsAddDialogOpen(true);
    }
  }, [searchParams]);

  // Calculate stats
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
  const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
  const endOfLastMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

  const lifetimeIncome = dataStore.getTotalIncome();
  const thisMonthIncome = dataStore.getTotalIncome(startOfMonth, endOfMonth);
  const lastMonthIncome = dataStore.getTotalIncome(startOfLastMonth, endOfLastMonth);
  const incomeGrowth = lastMonthIncome > 0 ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;

  // Get highest income source
  const incomeBySource = incomeTransactions.reduce((acc, income) => {
    acc[income.source] = (acc[income.source] || 0) + income.amount;
    return acc;
  }, {} as Record<string, number>);
  const highestIncomeSource = Object.entries(incomeBySource).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]);

  // Get top earning employee
  const incomeByEmployee = incomeTransactions.reduce((acc, income) => {
    acc[income.employeeId] = (acc[income.employeeId] || 0) + income.amount;
    return acc;
  }, {} as Record<string, number>);
  const topEarningEmployeeId = Object.entries(incomeByEmployee).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0];
  const topEarningEmployee = employees.find(e => e.id === topEarningEmployeeId);

  // Get unique sources for dropdown
  const existingSources = [...new Set(incomeTransactions.map(t => t.source))];

  // Filter income transactions based on search
  const filteredIncomeTransactions = incomeTransactions.filter(income =>
    income.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    income.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    income.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (income.platform && income.platform.toLowerCase().includes(searchTerm.toLowerCase())) ||
    employees.find(e => e.id === income.employeeId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let categoryName = formData.get('category') as string;
    if (categoryName === 'new' && newCategory.trim()) {
      const newCat = dataStore.addCategory({ name: newCategory.trim(), type: 'income' });
      categoryName = newCat.name;
      setCategories(dataStore.getCategories('income'));
      setNewCategory('');
      setShowNewCategoryInput(false);
    }

    let sourceName = formData.get('source') as string;
    if (sourceName === 'new' && newSource.trim()) {
      sourceName = newSource.trim();
      setNewSource('');
      setShowNewSourceInput(false);
    }

    const incomeData = {
      name: formData.get('name') as string,
      source: sourceName,
      category: categoryName,
      platform: formData.get('platform') as string || undefined,
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date') as string,
      paymentMethod: formData.get('paymentMethod') as string,
      employeeId: formData.get('employeeId') as string,
    };

    if (editingIncome) {
      dataStore.updateIncomeTransaction(editingIncome.id, incomeData);
      toast.success('Income updated successfully');
      setEditingIncome(null);
    } else {
      dataStore.addIncomeTransaction(incomeData);
      toast.success('Income added successfully');
      setIsAddDialogOpen(false);
    }

    setIncomeTransactions(dataStore.getIncomeTransactions());
    (e.target as HTMLFormElement).reset();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this income transaction?')) {
      dataStore.deleteIncomeTransaction(id);
      setIncomeTransactions(dataStore.getIncomeTransactions());
      toast.success('Income transaction deleted successfully');
    }
  };

  const IncomeForm = ({ income }: { income?: IncomeTransaction }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name/Description</Label>
          <Input
            id="name"
            name="name"
            defaultValue={income?.name}
            placeholder="Website Development"
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
            defaultValue={income?.amount}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select name="source" defaultValue={income?.source} onValueChange={(value) => {
            setShowNewSourceInput(value === 'new');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {existingSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
              <SelectItem value="new">+ Add new source</SelectItem>
            </SelectContent>
          </Select>
          {showNewSourceInput && (
            <Input
              placeholder="Enter new source name"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={income?.category} onValueChange={(value) => {
            setShowNewCategoryInput(value === 'new');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
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
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input
            id="platform"
            name="platform"
            defaultValue={income?.platform}
            placeholder="Direct, Upwork, etc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={income?.date}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select name="paymentMethod" defaultValue={income?.paymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="PayPal">PayPal</SelectItem>
              <SelectItem value="Stripe">Stripe</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Check">Check</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee</Label>
          <Select name="employeeId" defaultValue={income?.employeeId}>
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
      </div>

      <DialogFooter>
        <Button type="submit">
          {income ? 'Update Income' : 'Add Income'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Income Management</h1>
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
              <IncomeForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lifetime Income</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${lifetimeIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total accumulated income</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">${thisMonthIncome.toLocaleString()}</div>
              <div className={`flex items-center text-xs mt-1 ${incomeGrowth >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {incomeGrowth >= 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                {Math.abs(incomeGrowth).toFixed(1)}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Source</CardTitle>
              <Building className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-chart-3">{highestIncomeSource[0] || 'N/A'}</div>
              <p className="text-xs text-muted-foreground mt-1">
                ${highestIncomeSource[1].toLocaleString()} earned
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Earner</CardTitle>
              <User className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {topEarningEmployee && (
                  <>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={topEarningEmployee.avatar} />
                      <AvatarFallback className="text-xs">
                        {topEarningEmployee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-bold text-chart-4 truncate">
                      {topEarningEmployee.name}
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${incomeByEmployee[topEarningEmployeeId]?.toLocaleString() || '0'} earned
              </p>
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
                  {filteredIncomeTransactions.map((income) => {
                    const employee = employees.find(e => e.id === income.employeeId);
                    return (
                      <TableRow key={income.id}>
                        <TableCell className="font-medium">{income.name}</TableCell>
                        <TableCell>{income.source}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{income.category}</Badge>
                        </TableCell>
                        <TableCell>{income.platform || '-'}</TableCell>
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
                                {employee?.name.split(' ').map(n => n[0]).join('') || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{employee?.name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingIncome(income)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Income</DialogTitle>
                                  <DialogDescription>
                                    Update the income transaction details.
                                  </DialogDescription>
                                </DialogHeader>
                                <IncomeForm income={editingIncome || undefined} />
                              </DialogContent>
                            </Dialog>
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
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}