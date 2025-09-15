// Mock data store for settings
// This will be replaced with actual database operations in production

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  hireDate: string;
  salary: number;
  performance: number;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

class DataStore {
  private employees: Employee[] = [];
  private categories: Category[] = [];

  constructor() {
    // Initialize with some default data
    this.employees = [
      {
        id: '1',
        name: 'John Doe',
        role: 'Software Engineer',
        department: 'Engineering',
        hireDate: '2023-01-15',
        salary: 75000,
        performance: 85,
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'Product Manager',
        department: 'Product',
        hireDate: '2022-08-20',
        salary: 90000,
        performance: 92,
      },
    ];

    this.categories = [
      { id: '1', name: 'Salary', type: 'income' },
      { id: '2', name: 'Freelance', type: 'income' },
      { id: '3', name: 'Investments', type: 'income' },
      { id: '4', name: 'Rent', type: 'expense' },
      { id: '5', name: 'Utilities', type: 'expense' },
      { id: '6', name: 'Groceries', type: 'expense' },
      { id: '7', name: 'Transportation', type: 'expense' },
      { id: '8', name: 'Entertainment', type: 'expense' },
    ];
  }

  // Employee methods
  getEmployees(): Employee[] {
    return [...this.employees];
  }

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<Omit<Employee, 'id'>>): Employee | null {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) return null;
    
    this.employees[index] = {
      ...this.employees[index],
      ...updates,
    };
    return this.employees[index];
  }

  deleteEmployee(id: string): boolean {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) return false;
    
    this.employees.splice(index, 1);
    return true;
  }

  // Category methods
  getCategories(): Category[] {
    return [...this.categories];
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): Category | null {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index === -1) return null;
    
    this.categories[index] = {
      ...this.categories[index],
      ...updates,
    };
    return this.categories[index];
  }

  deleteCategory(id: string): boolean {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    return true;
  }
}

export const dataStore = new DataStore();