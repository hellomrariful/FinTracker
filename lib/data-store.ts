// Simple in-memory data store for demo purposes
// In a real app, this would be replaced with a proper database

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  department: string;
  hireDate: string;
  salary: number;
  performance: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description?: string;
  icon?: string;
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
  status: 'completed' | 'pending' | 'cancelled';
  recurring?: boolean;
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
  status: 'completed' | 'pending' | 'cancelled';
  receipt?: string;
  businessPurpose?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: 'physical' | 'digital';
  subCategory?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue?: number;
  depreciation?: number;
  location?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  warranty?: string;
  notes?: string;
  assignedTo?: string;
}

export interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
}

export interface Goal {
  id: string;
  name: string;
  type: 'revenue' | 'expense' | 'profit' | 'savings';
  target: number;
  current: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

// Enhanced initial data with demo user context
const employees: Employee[] = [
  { 
    id: '1', 
    name: 'Demo User', 
    role: 'CEO & Founder', 
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Executive',
    hireDate: '2020-01-15',
    salary: 180000,
    performance: 95
  },
  { 
    id: '2', 
    name: 'Sarah Kim', 
    role: 'CTO', 
    avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Technology',
    hireDate: '2020-03-01',
    salary: 165000,
    performance: 92
  },
  { 
    id: '3', 
    name: 'Marcus Rodriguez', 
    role: 'Head of Sales', 
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Sales',
    hireDate: '2020-06-15',
    salary: 145000,
    performance: 88
  },
  { 
    id: '4', 
    name: 'Emily Chen', 
    role: 'Marketing Manager', 
    avatar: 'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Marketing',
    hireDate: '2021-02-01',
    salary: 95000,
    performance: 90
  },
  { 
    id: '5', 
    name: 'David Wilson', 
    role: 'Senior Developer', 
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Technology',
    hireDate: '2021-04-12',
    salary: 115000,
    performance: 87
  },
  { 
    id: '6', 
    name: 'Lisa Thompson', 
    role: 'Product Manager', 
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Product',
    hireDate: '2021-08-20',
    salary: 125000,
    performance: 91
  },
  { 
    id: '7', 
    name: 'Michael Brown', 
    role: 'Sales Representative', 
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Sales',
    hireDate: '2022-01-10',
    salary: 75000,
    performance: 85
  },
  { 
    id: '8', 
    name: 'Jessica Davis', 
    role: 'UX Designer', 
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Design',
    hireDate: '2022-03-15',
    salary: 85000,
    performance: 89
  },
  { 
    id: '9', 
    name: 'Robert Johnson', 
    role: 'DevOps Engineer', 
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Technology',
    hireDate: '2022-05-01',
    salary: 105000,
    performance: 86
  },
  { 
    id: '10', 
    name: 'Amanda Garcia', 
    role: 'Content Strategist', 
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    department: 'Marketing',
    hireDate: '2022-09-12',
    salary: 70000,
    performance: 83
  }
];

const categories: Category[] = [
  // Income Categories
  { id: '1', name: 'Client Projects', type: 'income', description: 'Revenue from client work', icon: '💼' },
  { id: '2', name: 'Consulting', type: 'income', description: 'Consulting services', icon: '🎯' },
  { id: '3', name: 'Product Sales', type: 'income', description: 'Digital product sales', icon: '📦' },
  { id: '4', name: 'Subscriptions', type: 'income', description: 'Recurring subscription revenue', icon: '🔄' },
  { id: '5', name: 'Licensing', type: 'income', description: 'Software licensing fees', icon: '📜' },
  { id: '6', name: 'Training', type: 'income', description: 'Training and workshops', icon: '🎓' },
  { id: '7', name: 'Partnerships', type: 'income', description: 'Partner revenue sharing', icon: '🤝' },
  
  // Expense Categories
  { id: '8', name: 'Software', type: 'expense', description: 'Software tools and licenses', icon: '💻' },
  { id: '9', name: 'Marketing', type: 'expense', description: 'Marketing and advertising', icon: '📢' },
  { id: '10', name: 'Operations', type: 'expense', description: 'General operations', icon: '⚙️' },
  { id: '11', name: 'Salaries', type: 'expense', description: 'Employee salaries', icon: '👥' },
  { id: '12', name: 'Equipment', type: 'expense', description: 'Hardware and equipment', icon: '🖥️' },
  { id: '13', name: 'Travel', type: 'expense', description: 'Business travel expenses', icon: '✈️' },
  { id: '14', name: 'Office Rent', type: 'expense', description: 'Office space rental', icon: '🏢' },
  { id: '15', name: 'Utilities', type: 'expense', description: 'Internet, phone, electricity', icon: '⚡' },
  { id: '16', name: 'Legal & Professional', type: 'expense', description: 'Legal and professional services', icon: '⚖️' },
  { id: '17', name: 'Insurance', type: 'expense', description: 'Business insurance', icon: '🛡️' },
  { id: '18', name: 'Training & Development', type: 'expense', description: 'Employee training', icon: '📚' },
  { id: '19', name: 'Entertainment', type: 'expense', description: 'Client entertainment', icon: '🍽️' }
];

const incomeTransactions: IncomeTransaction[] = [
  // Recent transactions (2024) - mostly attributed to Demo User as CEO
  { id: '1', name: 'E-commerce Platform Development', source: 'TechCorp Inc', category: 'Client Projects', platform: 'Direct', amount: 45000, date: '2024-01-15', paymentMethod: 'Bank Transfer', employeeId: '1', status: 'completed', recurring: false },
  { id: '2', name: 'Mobile App Consulting', source: 'StartupXYZ', category: 'Consulting', platform: 'Upwork', amount: 12500, date: '2024-01-12', paymentMethod: 'PayPal', employeeId: '2', status: 'completed', recurring: false },
  { id: '3', name: 'SaaS Monthly Subscription', source: 'Enterprise Client A', category: 'Subscriptions', platform: 'Stripe', amount: 8500, date: '2024-01-10', paymentMethod: 'Credit Card', employeeId: '3', status: 'completed', recurring: true },
  { id: '4', name: 'Digital Product Sales', source: 'Online Store', category: 'Product Sales', platform: 'Shopify', amount: 6200, date: '2024-01-08', paymentMethod: 'Stripe', employeeId: '4', status: 'completed', recurring: false },
  { id: '5', name: 'API Integration Project', source: 'FinTech Co', category: 'Client Projects', platform: 'Direct', amount: 28000, date: '2024-01-05', paymentMethod: 'Bank Transfer', employeeId: '1', status: 'completed', recurring: false },
  { id: '6', name: 'Software License Revenue', source: 'Tech Solutions Ltd', category: 'Licensing', platform: 'Direct', amount: 15000, date: '2024-01-03', paymentMethod: 'Bank Transfer', employeeId: '6', status: 'completed', recurring: false },
  { id: '7', name: 'Training Workshop', source: 'Corporate Training Co', category: 'Training', platform: 'Direct', amount: 9500, date: '2024-01-02', paymentMethod: 'Check', employeeId: '4', status: 'completed', recurring: false },
  
  // December 2023
  { id: '8', name: 'Year-end Consulting Bonus', source: 'MegaCorp', category: 'Consulting', platform: 'Direct', amount: 22000, date: '2023-12-28', paymentMethod: 'Bank Transfer', employeeId: '1', status: 'completed', recurring: false },
  { id: '9', name: 'Partnership Revenue Share', source: 'Strategic Partner', category: 'Partnerships', platform: 'Direct', amount: 18500, date: '2023-12-25', paymentMethod: 'Bank Transfer', employeeId: '3', status: 'completed', recurring: true },
  { id: '10', name: 'Custom Dashboard Development', source: 'Analytics Corp', category: 'Client Projects', platform: 'Direct', amount: 35000, date: '2023-12-20', paymentMethod: 'Bank Transfer', employeeId: '5', status: 'completed', recurring: false },
  
  // November 2023
  { id: '11', name: 'Monthly SaaS Revenue', source: 'Enterprise Client B', category: 'Subscriptions', platform: 'Stripe', amount: 12000, date: '2023-11-30', paymentMethod: 'Credit Card', employeeId: '3', status: 'completed', recurring: true },
  { id: '12', name: 'UI/UX Design Project', source: 'Design Agency', category: 'Client Projects', platform: 'Direct', amount: 16500, date: '2023-11-25', paymentMethod: 'PayPal', employeeId: '8', status: 'completed', recurring: false },
  { id: '13', name: 'Technical Training Series', source: 'Education Platform', category: 'Training', platform: 'Direct', amount: 8000, date: '2023-11-20', paymentMethod: 'Bank Transfer', employeeId: '2', status: 'completed', recurring: false },
  
  // October 2023
  { id: '14', name: 'Cloud Migration Consulting', source: 'Legacy Systems Inc', category: 'Consulting', platform: 'Direct', amount: 42000, date: '2023-10-15', paymentMethod: 'Bank Transfer', employeeId: '9', status: 'completed', recurring: false },
  { id: '15', name: 'Product Sales Q4', source: 'Marketplace', category: 'Product Sales', platform: 'Amazon', amount: 14200, date: '2023-10-10', paymentMethod: 'Amazon Pay', employeeId: '4', status: 'completed', recurring: false }
];

const expenseTransactions: ExpenseTransaction[] = [
  // January 2024 - Demo User as CEO handling major expenses
  { id: '1', name: 'AWS Cloud Services', category: 'Software', platform: 'Amazon Web Services', amount: 2450, date: '2024-01-14', paymentMethod: 'Credit Card', employeeId: '2', status: 'completed', businessPurpose: 'Infrastructure hosting' },
  { id: '2', name: 'Google Ads Campaign Q1', category: 'Marketing', platform: 'Google Ads', amount: 6200, date: '2024-01-13', paymentMethod: 'Credit Card', employeeId: '4', status: 'completed', businessPurpose: 'Lead generation campaign' },
  { id: '3', name: 'Office Supplies & Equipment', category: 'Operations', platform: 'Amazon Business', amount: 850, date: '2024-01-12', paymentMethod: 'Credit Card', employeeId: '1', status: 'completed', businessPurpose: 'General office supplies' },
  { id: '4', name: 'Adobe Creative Suite Licenses', category: 'Software', platform: 'Adobe', amount: 1200, date: '2024-01-11', paymentMethod: 'Credit Card', employeeId: '8', status: 'completed', businessPurpose: 'Design software licenses' },
  { id: '5', name: 'Team Building Lunch', category: 'Entertainment', platform: 'Local Restaurant', amount: 320, date: '2024-01-10', paymentMethod: 'Cash', employeeId: '1', status: 'completed', businessPurpose: 'Team morale event' },
  { id: '6', name: 'Office Rent January', category: 'Office Rent', platform: 'Property Management', amount: 8500, date: '2024-01-01', paymentMethod: 'Bank Transfer', employeeId: '1', status: 'completed', businessPurpose: 'Monthly office rent' },
  { id: '7', name: 'Internet & Phone Services', category: 'Utilities', platform: 'Telecom Provider', amount: 450, date: '2024-01-05', paymentMethod: 'Auto Pay', employeeId: '1', status: 'completed', businessPurpose: 'Monthly utilities' },
  { id: '8', name: 'Business Insurance Premium', category: 'Insurance', platform: 'Insurance Co', amount: 1800, date: '2024-01-03', paymentMethod: 'Bank Transfer', employeeId: '1', status: 'completed', businessPurpose: 'Quarterly insurance premium' },
  { id: '9', name: 'Employee Training Course', category: 'Training & Development', platform: 'Online Learning', amount: 950, date: '2024-01-08', paymentMethod: 'Credit Card', employeeId: '6', status: 'completed', businessPurpose: 'Professional development' },
  { id: '10', name: 'Legal Consultation', category: 'Legal & Professional', platform: 'Law Firm', amount: 2200, date: '2024-01-09', paymentMethod: 'Check', employeeId: '1', status: 'completed', businessPurpose: 'Contract review' },
  
  // December 2023
  { id: '11', name: 'Year-end Bonuses', category: 'Salaries', platform: 'Payroll', amount: 25000, date: '2023-12-31', paymentMethod: 'Bank Transfer', employeeId: '1', status: 'completed', businessPurpose: 'Employee bonuses' },
  { id: '12', name: 'Conference Travel Expenses', category: 'Travel', platform: 'Travel Agency', amount: 3200, date: '2023-12-15', paymentMethod: 'Credit Card', employeeId: '2', status: 'completed', businessPurpose: 'Tech conference attendance' },
  { id: '13', name: 'New Laptop Purchase', category: 'Equipment', platform: 'Apple Store', amount: 2800, date: '2023-12-10', paymentMethod: 'Credit Card', employeeId: '5', status: 'completed', businessPurpose: 'Developer equipment' },
  { id: '14', name: 'Marketing Materials', category: 'Marketing', platform: 'Print Shop', amount: 680, date: '2023-12-08', paymentMethod: 'Credit Card', employeeId: '4', status: 'completed', businessPurpose: 'Trade show materials' },
  { id: '15', name: 'Software Development Tools', category: 'Software', platform: 'JetBrains', amount: 1500, date: '2023-12-05', paymentMethod: 'Credit Card', employeeId: '5', status: 'completed', businessPurpose: 'Development IDE licenses' }
];

const assets: Asset[] = [
  // Physical Assets - Technology
  { 
    id: '1', 
    name: 'MacBook Pro 16" M2 Max', 
    category: 'physical', 
    subCategory: 'Laptops', 
    purchaseDate: '2023-12-01', 
    purchasePrice: 3499, 
    currentValue: 3200,
    depreciation: 8.5,
    location: 'Office - Dev Team',
    condition: 'excellent',
    warranty: '2025-12-01',
    notes: 'Primary development machine for senior developers',
    assignedTo: 'David Wilson'
  },
  { 
    id: '2', 
    name: 'Dell UltraSharp 32" 4K Monitor', 
    category: 'physical', 
    subCategory: 'Monitors', 
    purchaseDate: '2023-11-15', 
    purchasePrice: 899, 
    currentValue: 750,
    depreciation: 16.6,
    location: 'Office - Design Team',
    condition: 'excellent',
    warranty: '2026-11-15',
    notes: 'High-resolution monitor for design work',
    assignedTo: 'Jessica Davis'
  },
  { 
    id: '3', 
    name: 'Herman Miller Aeron Chair', 
    category: 'physical', 
    subCategory: 'Furniture', 
    purchaseDate: '2023-10-20', 
    purchasePrice: 1395, 
    currentValue: 1200,
    depreciation: 14.0,
    location: 'Office - Executive',
    condition: 'excellent',
    warranty: '2035-10-20',
    notes: 'Ergonomic office chair for executive team',
    assignedTo: 'Demo User'
  },
  { 
    id: '4', 
    name: 'iPhone 15 Pro Max', 
    category: 'physical', 
    subCategory: 'Mobile Devices', 
    purchaseDate: '2023-09-22', 
    purchasePrice: 1199, 
    currentValue: 950,
    depreciation: 20.8,
    location: 'Mobile - Sales Team',
    condition: 'good',
    warranty: '2024-09-22',
    notes: 'Company phone for sales team lead',
    assignedTo: 'Marcus Rodriguez'
  },
  { 
    id: '5', 
    name: 'Conference Room Smart TV 75"', 
    category: 'physical', 
    subCategory: 'Audio/Visual', 
    purchaseDate: '2023-08-10', 
    purchasePrice: 2200, 
    currentValue: 1800,
    depreciation: 18.2,
    location: 'Conference Room A',
    condition: 'excellent',
    warranty: '2025-08-10',
    notes: 'Main presentation display for client meetings'
  },
  
  // Digital Assets
  { 
    id: '6', 
    name: 'fintracker.com', 
    category: 'digital', 
    subCategory: 'Domains', 
    purchaseDate: '2020-01-15', 
    purchasePrice: 12, 
    currentValue: 5000,
    location: 'Namecheap',
    condition: 'excellent',
    notes: 'Primary domain name - premium value due to brand recognition'
  },
  { 
    id: '7', 
    name: 'Adobe Creative Cloud Enterprise', 
    category: 'digital', 
    subCategory: 'Software Licenses', 
    purchaseDate: '2023-01-01', 
    purchasePrice: 3600, 
    currentValue: 2400,
    depreciation: 33.3,
    location: 'Cloud License',
    condition: 'excellent',
    warranty: '2024-01-01',
    notes: 'Annual enterprise license for design team'
  },
  { 
    id: '8', 
    name: 'Slack Enterprise Grid', 
    category: 'digital', 
    subCategory: 'Software Licenses', 
    purchaseDate: '2023-01-01', 
    purchasePrice: 2400, 
    currentValue: 1600,
    depreciation: 33.3,
    location: 'Cloud License',
    condition: 'excellent',
    warranty: '2024-01-01',
    notes: 'Team communication platform'
  },
  { 
    id: '9', 
    name: 'GitHub Enterprise Server', 
    category: 'digital', 
    subCategory: 'Software Licenses', 
    purchaseDate: '2023-01-01', 
    purchasePrice: 5000, 
    currentValue: 3333,
    depreciation: 33.3,
    location: 'Cloud License',
    condition: 'excellent',
    warranty: '2024-01-01',
    notes: 'Code repository and collaboration platform'
  },
  { 
    id: '10', 
    name: 'AWS Reserved Instances', 
    category: 'digital', 
    subCategory: 'Cloud Infrastructure', 
    purchaseDate: '2023-01-01', 
    purchasePrice: 15000, 
    currentValue: 10000,
    depreciation: 33.3,
    location: 'AWS Cloud',
    condition: 'excellent',
    warranty: '2024-01-01',
    notes: '3-year reserved instances for cost optimization'
  },
  
  // Office Equipment
  { 
    id: '11', 
    name: 'Steelcase Series 1 Desk', 
    category: 'physical', 
    subCategory: 'Furniture', 
    purchaseDate: '2023-06-15', 
    purchasePrice: 650, 
    currentValue: 520,
    depreciation: 20.0,
    location: 'Office - Open Area',
    condition: 'good',
    warranty: '2028-06-15',
    notes: 'Height-adjustable standing desk'
  },
  { 
    id: '12', 
    name: 'Xerox VersaLink C405 Printer', 
    category: 'physical', 
    subCategory: 'Office Equipment', 
    purchaseDate: '2023-05-01', 
    purchasePrice: 899, 
    currentValue: 650,
    depreciation: 27.7,
    location: 'Office - Print Station',
    condition: 'good',
    warranty: '2024-05-01',
    notes: 'Color laser printer for office documents'
  }
];

const budgets: Budget[] = [
  { id: '1', category: 'Software', allocated: 15000, spent: 8650, period: 'monthly', startDate: '2024-01-01', endDate: '2024-01-31' },
  { id: '2', category: 'Marketing', allocated: 25000, spent: 18200, period: 'monthly', startDate: '2024-01-01', endDate: '2024-01-31' },
  { id: '3', category: 'Operations', allocated: 12000, spent: 9500, period: 'monthly', startDate: '2024-01-01', endDate: '2024-01-31' },
  { id: '4', category: 'Equipment', allocated: 8000, spent: 3200, period: 'monthly', startDate: '2024-01-01', endDate: '2024-01-31' },
  { id: '5', category: 'Travel', allocated: 5000, spent: 2100, period: 'monthly', startDate: '2024-01-01', endDate: '2024-01-31' },
  { id: '6', category: 'Training & Development', allocated: 6000, spent: 3800, period: 'monthly', startDate: '2024-01-01', endDate: '2024-01-31' }
];

const goals: Goal[] = [
  { id: '1', name: 'Q1 Revenue Target', type: 'revenue', target: 500000, current: 125000, deadline: '2024-03-31', priority: 'high' },
  { id: '2', name: 'Reduce Software Costs', type: 'expense', target: 40000, current: 45000, deadline: '2024-06-30', priority: 'medium' },
  { id: '3', name: 'Increase Profit Margin', type: 'profit', target: 150000, current: 85000, deadline: '2024-12-31', priority: 'high' },
  { id: '4', name: 'Emergency Fund', type: 'savings', target: 100000, current: 65000, deadline: '2024-12-31', priority: 'medium' }
];

// Data store class with enhanced functionality
class DataStore {
  private employees: Employee[] = [...employees];
  private categories: Category[] = [...categories];
  private incomeTransactions: IncomeTransaction[] = [...incomeTransactions];
  private expenseTransactions: ExpenseTransaction[] = [...expenseTransactions];
  private assets: Asset[] = [...assets];
  private budgets: Budget[] = [...budgets];
  private goals: Goal[] = [...goals];

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

  // Budgets
  getBudgets(): Budget[] {
    return this.budgets;
  }

  addBudget(budget: Omit<Budget, 'id'>): Budget {
    const newBudget = { ...budget, id: Date.now().toString() };
    this.budgets.push(newBudget);
    return newBudget;
  }

  updateBudget(id: string, updates: Partial<Budget>): Budget | null {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.budgets[index] = { ...this.budgets[index], ...updates };
    return this.budgets[index];
  }

  deleteBudget(id: string): boolean {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.budgets.splice(index, 1);
    return true;
  }

  // Goals
  getGoals(): Goal[] {
    return this.goals;
  }

  addGoal(goal: Omit<Goal, 'id'>): Goal {
    const newGoal = { ...goal, id: Date.now().toString() };
    this.goals.push(newGoal);
    return newGoal;
  }

  updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) return null;
    this.goals[index] = { ...this.goals[index], ...updates };
    return this.goals[index];
  }

  deleteGoal(id: string): boolean {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) return false;
    this.goals.splice(index, 1);
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

  // Enhanced analytics
  getAssetsByCategory(): Record<string, Asset[]> {
    return this.assets.reduce((acc, asset) => {
      if (!acc[asset.category]) {
        acc[asset.category] = [];
      }
      acc[asset.category].push(asset);
      return acc;
    }, {} as Record<string, Asset[]>);
  }

  getTotalAssetValue(): number {
    return this.assets.reduce((sum, asset) => sum + (asset.currentValue || asset.purchasePrice), 0);
  }

  getDepreciationTotal(): number {
    return this.assets.reduce((sum, asset) => {
      if (asset.depreciation && asset.currentValue) {
        return sum + (asset.purchasePrice - asset.currentValue);
      }
      return sum;
    }, 0);
  }

  getBudgetUtilization(): Array<Budget & { utilization: number }> {
    return this.budgets.map(budget => ({
      ...budget,
      utilization: budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0
    }));
  }

  getGoalProgress(): Array<Goal & { progress: number }> {
    return this.goals.map(goal => ({
      ...goal,
      progress: goal.target > 0 ? (goal.current / goal.target) * 100 : 0
    }));
  }

  getEmployeePerformanceMetrics(): Array<Employee & { totalIncome: number; avgTransaction: number; efficiency: number }> {
    return this.employees.map(employee => {
      const employeeTransactions = this.incomeTransactions.filter(t => t.employeeId === employee.id);
      const totalIncome = employeeTransactions.reduce((sum, t) => sum + t.amount, 0);
      const avgTransaction = employeeTransactions.length > 0 ? totalIncome / employeeTransactions.length : 0;
      const efficiency = employee.salary > 0 ? (totalIncome / employee.salary) * 100 : 0;

      return {
        ...employee,
        totalIncome,
        avgTransaction,
        efficiency
      };
    });
  }

  getCashFlow(months: number = 12): Array<{ month: string; income: number; expenses: number; netFlow: number }> {
    const now = new Date();
    const cashFlow = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const income = this.getTotalIncome(startDate, endDate);
      const expenses = this.getTotalExpenses(startDate, endDate);
      
      cashFlow.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income,
        expenses,
        netFlow: income - expenses
      });
    }

    return cashFlow;
  }
}

// Export singleton instance
export const dataStore = new DataStore();