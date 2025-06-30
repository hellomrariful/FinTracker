'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { dataStore, type IncomeTransaction, type Employee, type Category } from '@/lib/data-store';
import { toast } from 'sonner';

interface IncomeFormProps {
  income?: IncomeTransaction;
  employees: Employee[];
  categories: Category[];
  existingSources: string[];
  onSuccess: () => void;
  onClose: () => void;
}

export function IncomeForm({ 
  income, 
  employees, 
  categories, 
  existingSources, 
  onSuccess, 
  onClose 
}: IncomeFormProps) {
  const [newCategory, setNewCategory] = useState('');
  const [newSource, setNewSource] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewSourceInput, setShowNewSourceInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  useEffect(() => {
    if (income) {
      setSelectedCategory(income.category);
      setSelectedSource(income.source);
    }
  }, [income]);

  const resetForm = () => {
    setNewCategory('');
    setNewSource('');
    setShowNewCategoryInput(false);
    setShowNewSourceInput(false);
    setSelectedCategory('');
    setSelectedSource('');
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setShowNewCategoryInput(value === 'new');
    if (value !== 'new') {
      setNewCategory('');
    }
  };

  const handleSourceChange = (value: string) => {
    setSelectedSource(value);
    setShowNewSourceInput(value === 'new');
    if (value !== 'new') {
      setNewSource('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let categoryName = selectedCategory;
    if (selectedCategory === 'new' && newCategory.trim()) {
      const newCat = dataStore.addCategory({ name: newCategory.trim(), type: 'income' });
      categoryName = newCat.name;
    }

    let sourceName = selectedSource;
    if (selectedSource === 'new' && newSource.trim()) {
      sourceName = newSource.trim();
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

    if (income) {
      dataStore.updateIncomeTransaction(income.id, incomeData);
      toast.success('Income updated successfully');
    } else {
      dataStore.addIncomeTransaction(incomeData);
      toast.success('Income added successfully');
    }

    resetForm();
    onSuccess();
    onClose();
  };

  return (
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
          <Select value={selectedSource} onValueChange={handleSourceChange}>
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
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(category => category.name && category.name.trim() !== '').map((category) => (
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
}