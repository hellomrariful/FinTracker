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

// Enhanced initial data with comprehensive historical data
const employees: Employee[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    role: 'CEO', 
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

// Generate comprehensive historical data for the last 12 months
const generateHistoricalData = () => {
  const incomeTransactions: IncomeTransaction[] = [];
  const expenseTransactions: ExpenseTransaction[] = [];
  
  const now = new Date();
  
  // Generate data for each of the last 12 months
  for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    
    // Generate 8-15 income transactions per month
    const incomeCount = 8 + Math.floor(Math.random() * 8);
    for (let i = 0; i < incomeCount; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(year, month, day);
      
      const incomeCategories = ['Client Projects', 'Consulting', 'Product Sales', 'Subscriptions', 'Licensing', 'Training', 'Partnerships'];
      const sources = ['TechCorp Inc', 'StartupXYZ', 'Enterprise Client A', 'Online Store', 'FinTech Co', 'Tech Solutions Ltd', 'Corporate Training Co', 'MegaCorp', 'Strategic Partner', 'Analytics Corp', 'Design Agency', 'Education Platform', 'Legacy Systems Inc', 'Marketplace'];
      const platforms = ['Direct', 'Upwork', 'Stripe', 'Shopify', 'PayPal', 'Amazon', 'Freelancer'];
      const paymentMethods = ['Bank Transfer', 'PayPal', 'Credit Card', 'Stripe', 'Check', 'Amazon Pay'];
      
      const category = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const employeeId = employees[Math.floor(Math.random() * employees.length)].id;
      
      // Vary amounts based on category
      let baseAmount = 5000;
      if (category === 'Client Projects') baseAmount = 25000;
      else if (category === 'Consulting') baseAmount = 15000;
      else if (category === 'Subscriptions') baseAmount = 8000;
      else if (category === 'Product Sales') baseAmount = 6000;
      else if (category === 'Licensing') baseAmount = 12000;
      else if (category === 'Training') baseAmount = 7000;
      else if (category === 'Partnerships') baseAmount = 18000;
      
      const amount = baseAmount + (Math.random() * baseAmount * 0.5);
      
      const projectNames = [
        'E-commerce Platform Development', 'Mobile App Consulting', 'SaaS Monthly Subscription',
        'Digital Product Sales', 'API Integration Project', 'Software License Revenue',
        'Training Workshop', 'Year-end Consulting Bonus', 'Partnership Revenue Share',
        'Custom Dashboard Development', 'UI/UX Design Project', 'Technical Training Series',
        'Cloud Migration Consulting', 'Product Sales Q4', 'Enterprise Integration',
        'Marketing Automation Setup', 'Data Analytics Platform', 'Security Audit Services'
      ];
      
      incomeTransactions.push({
        id: `income-${year}-${month}-${i}`,
        name: projectNames[Math.floor(Math.random() * projectNames.length)],
        source,
        category,
        platform,
        amount: Math.round(amount),
        date: date.toISOString().split('T')[0],
        paymentMethod,
        employeeId,
        status: 'completed',
        recurring: category === 'Subscriptions' && Math.random() > 0.7
      });
    }
    
    // Generate 12-20 expense transactions per month
    const expenseCount = 12 + Math.floor(Math.random() * 9);
    for (let i = 0; i < expenseCount; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(year, month, day);
      
      const expenseCategories = ['Software', 'Marketing', 'Operations', 'Salaries', 'Equipment', 'Travel', 'Office Rent', 'Utilities', 'Legal & Professional', 'Insurance', 'Training & Development', 'Entertainment'];
      const platforms = ['Amazon Web Services', 'Google Ads', 'Amazon Business', 'Adobe', 'Local Restaurant', 'Property Management', 'Telecom Provider', 'Insurance Co', 'Online Learning', 'Law Firm', 'Travel Agency', 'Apple Store', 'Print Shop', 'JetBrains'];
      const paymentMethods = ['Credit Card', 'Bank Transfer', 'Auto Pay', 'Check', 'Cash', 'PayPal'];
      
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const employeeId = employees[Math.floor(Math.random() * employees.length)].id;
      
      // Vary amounts based on category
      let baseAmount = 500;
      if (category === 'Salaries') baseAmount = 15000;
      else if (category === 'Office Rent') baseAmount = 8000;
      else if (category === 'Marketing') baseAmount = 4000;
      else if (category === 'Software') baseAmount = 2000;
      else if (category === 'Equipment') baseAmount = 2500;
      else if (category === 'Travel') baseAmount = 1500;
      else if (category === 'Insurance') baseAmount = 1800;
      else if (category === 'Legal & Professional') baseAmount = 2200;
      else if (category === 'Training & Development') baseAmount = 950;
      else if (category === 'Utilities') baseAmount = 450;
      else if (category === 'Operations') baseAmount = 800;
      else if (category === 'Entertainment') baseAmount = 300;
      
      const amount = baseAmount + (Math.random() * baseAmount * 0.3);
      
      const expenseNames = [
        'AWS Cloud Services', 'Google Ads Campaign', 'Office Supplies & Equipment',
        'Adobe Creative Suite Licenses', 'Team Building Lunch', 'Office Rent',
        'Internet & Phone Services', 'Business Insurance Premium', 'Employee Training Course',
        'Legal Consultation', 'Year-end Bonuses', 'Conference Travel Expenses',
        'New Laptop Purchase', 'Marketing Materials', 'Software Development Tools',
        'Client Dinner', 'Printer Maintenance', 'Security Software', 'Accounting Software'
      ];
      
      expenseTransactions.push({
        id: `expense-${year}-${month}-${i}`,
        name: expenseNames[Math.floor(Math.random() * expenseNames.length)],
        category,
        platform,
        amount: Math.round(amount),
        date: date.toISOString().split('T')[0],
        paymentMethod,
        employeeId,
        status: 'completed',
        businessPurpose: `${category} related expense for business operations`
      });
    }
  }
  
  return { incomeTransactions, expenseTransactions };
};

const { incomeTransactions, expenseTransactions } = generateHistoricalData();

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
    assignedTo: 'John Doe'
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

  // New method to get monthly data for charts
  getMonthlyData(months: number = 6): Array<{ month: string; revenue: number; expenses: number }> {
    const now = new Date();
    const data = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const revenue = this.getTotalIncome(startDate, endDate);
      const expenses = this.getTotalExpenses(startDate, endDate);
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue,
        expenses
      });
    }

    return data;
  }
}

// Export singleton instance
export const dataStore = new DataStore();