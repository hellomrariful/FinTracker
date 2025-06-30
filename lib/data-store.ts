// Simple in-memory data store for demo purposes
// In a real app, this would be replaced with a proper database

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export interface IncomeTransaction {
  id: string;
  name: string;
  source: string;
  category: string;
  platform?: string;
  amount: number;
  date: string;
  paymentMethod: string;
  employeeId: string;
}

export interface ExpenseTransaction {
  id: string;
  name: string;
  category: string;
  platform?: string;
  amount: number;
  date: string;
  paymentMethod: string;
  employeeId: string;
}

export interface Asset {
  id: string;
  name: string;
  category: 'physical' | 'digital';
  subCategory?: string;
  purchaseDate: string;
  purchasePrice: number;
  notes?: string;
}

// Initial data
const employees: Employee[] = [
  { id: '1', name: 'John Doe', role: 'CEO', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face' },
  { id: '2', name: 'Sarah Kim', role: 'CTO', avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face' },
  { id: '3', name: 'Marcus Rodriguez', role: 'Head of Sales', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face' },
  { id: '4', name: 'Emily Chen', role: 'Marketing Manager', avatar: 'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face' },
];

const categories: Category[] = [
  { id: '1', name: 'Client Projects', type: 'income' },
  { id: '2', name: 'Consulting', type: 'income' },
  { id: '3', name: 'Product Sales', type: 'income' },
  { id: '4', name: 'Subscriptions', type: 'income' },
  { id: '5', name: 'Software', type: 'expense' },
  { id: '6', name: 'Marketing', type: 'expense' },
  { id: '7', name: 'Operations', type: 'expense' },
  { id: '8', name: 'Salaries', type: 'expense' },
  { id: '9', name: 'Equipment', type: 'expense' },
  { id: '10', name: 'Travel', type: 'expense' },
];

const incomeTransactions: IncomeTransaction[] = [
  { id: '1', name: 'Website Development', source: 'TechCorp Inc', category: 'Client Projects', platform: 'Direct', amount: 15000, date: '2024-01-15', paymentMethod: 'Bank Transfer', employeeId: '1' },
  { id: '2', name: 'Mobile App Consulting', source: 'StartupXYZ', category: 'Consulting', platform: 'Upwork', amount: 8500, date: '2024-01-12', paymentMethod: 'PayPal', employeeId: '2' },
  { id: '3', name: 'SaaS Subscription', source: 'Enterprise Client', category: 'Subscriptions', platform: 'Stripe', amount: 2500, date: '2024-01-10', paymentMethod: 'Credit Card', employeeId: '3' },
  { id: '4', name: 'Digital Product Sales', source: 'Online Store', category: 'Product Sales', platform: 'Shopify', amount: 3200, date: '2024-01-08', paymentMethod: 'Stripe', employeeId: '4' },
  { id: '5', name: 'API Integration', source: 'FinTech Co', category: 'Client Projects', platform: 'Direct', amount: 12000, date: '2024-01-05', paymentMethod: 'Bank Transfer', employeeId: '1' },
];

const expenseTransactions: ExpenseTransaction[] = [
  { id: '1', name: 'AWS Services', category: 'Software', platform: 'Amazon Web Services', amount: 450, date: '2024-01-14', paymentMethod: 'Credit Card', employeeId: '2' },
  { id: '2', name: 'Google Ads Campaign', category: 'Marketing', platform: 'Google Ads', amount: 1200, date: '2024-01-13', paymentMethod: 'Credit Card', employeeId: '4' },
  { id: '3', name: 'Office Supplies', category: 'Operations', platform: 'Amazon', amount: 156, date: '2024-01-12', paymentMethod: 'Credit Card', employeeId: '1' },
  { id: '4', name: 'Software Licenses', category: 'Software', platform: 'Adobe', amount: 89, date: '2024-01-11', paymentMethod: 'Credit Card', employeeId: '2' },
  { id: '5', name: 'Team Lunch', category: 'Operations', platform: 'Restaurant', amount: 85, date: '2024-01-10', paymentMethod: 'Cash', employeeId: '3' },
];

const assets: Asset[] = [
  { id: '1', name: 'MacBook Pro 16"', category: 'physical', subCategory: 'Electronics', purchaseDate: '2023-12-01', purchasePrice: 2499, notes: 'Development machine for John' },
  { id: '2', name: 'fintracker.com', category: 'digital', subCategory: 'Domain', purchaseDate: '2023-11-15', purchasePrice: 12, notes: 'Main domain name' },
  { id: '3', name: 'Office Desk', category: 'physical', subCategory: 'Furniture', purchaseDate: '2023-10-20', purchasePrice: 450, notes: 'Standing desk for office' },
  { id: '4', name: 'Adobe Creative Suite', category: 'digital', subCategory: 'Software', purchaseDate: '2023-09-01', purchasePrice: 599, notes: 'Annual license' },
];

// Data store class
class DataStore {
  private employees: Employee[] = [...employees];
  private categories: Category[] = [...categories];
  private incomeTransactions: IncomeTransaction[] = [...incomeTransactions];
  private expenseTransactions: ExpenseTransaction[] = [...expenseTransactions];
  private assets: Asset[] = [...assets];

  // Employees
  getEmployees(): Employee[] {
    return this.employees;
  }

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee = { ...employee, id: Date.now().toString() };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.employees[index] = { ...this.employees[index], ...updates };
    return this.employees[index];
  }

  deleteEmployee(id: string): boolean {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return false;
    this.employees.splice(index, 1);
    return true;
  }

  // Categories
  getCategories(type?: 'income' | 'expense'): Category[] {
    return type ? this.categories.filter(c => c.type === type) : this.categories;
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const newCategory = { ...category, id: Date.now().toString() };
    this.categories.push(newCategory);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  deleteCategory(id: string): boolean {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.categories.splice(index, 1);
    return true;
  }

  // Income Transactions
  getIncomeTransactions(): IncomeTransaction[] {
    return this.incomeTransactions;
  }

  addIncomeTransaction(transaction: Omit<IncomeTransaction, 'id'>): IncomeTransaction {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    this.incomeTransactions.push(newTransaction);
    return newTransaction;
  }

  updateIncomeTransaction(id: string, updates: Partial<IncomeTransaction>): IncomeTransaction | null {
    const index = this.incomeTransactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.incomeTransactions[index] = { ...this.incomeTransactions[index], ...updates };
    return this.incomeTransactions[index];
  }

  deleteIncomeTransaction(id: string): boolean {
    const index = this.incomeTransactions.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.incomeTransactions.splice(index, 1);
    return true;
  }

  // Expense Transactions
  getExpenseTransactions(): ExpenseTransaction[] {
    return this.expenseTransactions;
  }

  addExpenseTransaction(transaction: Omit<ExpenseTransaction, 'id'>): ExpenseTransaction {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    this.expenseTransactions.push(newTransaction);
    return newTransaction;
  }

  updateExpenseTransaction(id: string, updates: Partial<ExpenseTransaction>): ExpenseTransaction | null {
    const index = this.expenseTransactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.expenseTransactions[index] = { ...this.expenseTransactions[index], ...updates };
    return this.expenseTransactions[index];
  }

  deleteExpenseTransaction(id: string): boolean {
    const index = this.expenseTransactions.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.expenseTransactions.splice(index, 1);
    return true;
  }

  // Assets
  getAssets(): Asset[] {
    return this.assets;
  }

  addAsset(asset: Omit<Asset, 'id'>): Asset {
    const newAsset = { ...asset, id: Date.now().toString() };
    this.assets.push(newAsset);
    return newAsset;
  }

  updateAsset(id: string, updates: Partial<Asset>): Asset | null {
    const index = this.assets.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.assets[index] = { ...this.assets[index], ...updates };
    return this.assets[index];
  }

  deleteAsset(id: string): boolean {
    const index = this.assets.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.assets.splice(index, 1);
    return true;
  }

  // Analytics helpers
  getTotalIncome(startDate?: string, endDate?: string): number {
    let transactions = this.incomeTransactions;
    if (startDate || endDate) {
      transactions = transactions.filter(t => {
        const date = new Date(t.date);
        if (startDate && date < new Date(startDate)) return false;
        if (endDate && date > new Date(endDate)) return false;
        return true;
      });
    }
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(startDate?: string, endDate?: string): number {
    let transactions = this.expenseTransactions;
    if (startDate || endDate) {
      transactions = transactions.filter(t => {
        const date = new Date(t.date);
        if (startDate && date < new Date(startDate)) return false;
        if (endDate && date > new Date(endDate)) return false;
        return true;
      });
    }
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  getTopEmployee(startDate?: string, endDate?: string): { employee: Employee; income: number; transactions: number } | null {
    let transactions = this.incomeTransactions;
    if (startDate || endDate) {
      transactions = transactions.filter(t => {
        const date = new Date(t.date);
        if (startDate && date < new Date(startDate)) return false;
        if (endDate && date > new Date(endDate)) return false;
        return true;
      });
    }

    // Return null if no transactions found
    if (transactions.length === 0) {
      return null;
    }

    const employeeStats = transactions.reduce((acc, t) => {
      if (!acc[t.employeeId]) {
        acc[t.employeeId] = { income: 0, transactions: 0 };
      }
      acc[t.employeeId].income += t.amount;
      acc[t.employeeId].transactions += 1;
      return acc;
    }, {} as Record<string, { income: number; transactions: number }>);

    const employeeIds = Object.keys(employeeStats);
    
    // Return null if no employee stats found
    if (employeeIds.length === 0) {
      return null;
    }

    const topEmployeeId = employeeIds.reduce((a, b) => 
      employeeStats[a].income > employeeStats[b].income ? a : b
    );

    const employee = this.employees.find(e => e.id === topEmployeeId);
    if (!employee) return null;

    return {
      employee,
      income: employeeStats[topEmployeeId].income,
      transactions: employeeStats[topEmployeeId].transactions
    };
  }
}

// Export singleton instance
export const dataStore = new DataStore();