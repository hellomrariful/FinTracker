"use client";

import { useState } from "react";
import { 
  Edit2, 
  Trash2, 
  Plus, 
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample budget categories data
const initialBudgetCategories = [
  {
    id: 1,
    name: "Marketing",
    budgetAmount: 10000.00,
    spentAmount: 6800.00,
    period: "Monthly",
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    notes: "Budget for all marketing activities including ads, content, and promotions"
  },
  {
    id: 2,
    name: "Software & Tools",
    budgetAmount: 3500.00,
    spentAmount: 1850.00,
    period: "Monthly",
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    notes: "Subscriptions and licenses for business software"
  },
  {
    id: 3,
    name: "Team & Contractors",
    budgetAmount: 8500.00,
    spentAmount: 6950.00,
    period: "Monthly",
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    notes: "Payments to freelancers and team members"
  },
  {
    id: 4,
    name: "Office & Utilities",
    budgetAmount: 1500.00,
    spentAmount: 1200.00,
    period: "Monthly",
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    notes: "Office rent, utilities, and supplies"
  },
  {
    id: 5,
    name: "Professional Development",
    budgetAmount: 1500.00,
    spentAmount: 500.00,
    period: "Quarterly",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    notes: "Courses, conferences, and learning materials"
  },
];

export function BudgetCategoryList() {
  const [budgetCategories, setBudgetCategories] = useState(initialBudgetCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    budgetAmount: "",
    period: "Monthly",
    startDate: "",
    endDate: "",
    notes: ""
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle dropdown select changes
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add new budget category
  const handleAddCategory = (e) => {
    e.preventDefault();
    
    const newCategory = {
      id: budgetCategories.length + 1,
      ...formData,
      budgetAmount: parseFloat(formData.budgetAmount),
      spentAmount: 0,
    };
    
    setBudgetCategories([...budgetCategories, newCategory]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Set up edit form with current category data
  const handleEditSetup = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      budgetAmount: category.budgetAmount.toString(),
      period: category.period,
      startDate: category.startDate,
      endDate: category.endDate,
      notes: category.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  // Update existing budget category
  const handleUpdateCategory = (e) => {
    e.preventDefault();
    
    const updatedCategories = budgetCategories.map(category => {
      if (category.id === currentCategory.id) {
        return {
          ...category,
          name: formData.name,
          budgetAmount: parseFloat(formData.budgetAmount),
          period: formData.period,
          startDate: formData.startDate,
          endDate: formData.endDate,
          notes: formData.notes,
        };
      }
      return category;
    });
    
    setBudgetCategories(updatedCategories);
    setIsEditDialogOpen(false);
    resetForm();
  };

  // Delete a budget category
  const handleDeleteCategory = (id) => {
    const updatedCategories = budgetCategories.filter(category => category.id !== id);
    setBudgetCategories(updatedCategories);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      budgetAmount: "",
      period: "Monthly",
      startDate: "",
      endDate: "",
      notes: ""
    });
    setCurrentCategory(null);
  };

  // Calculate percentage and determine status
  const calculateStatus = (budgetAmount, spentAmount) => {
    const percentage = (spentAmount / budgetAmount) * 100;
    
    if (percentage > 95) {
      return "over-budget";
    } else if (percentage < 50) {
      return "under-budget";
    } else {
      return "on-track";
    }
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Budget Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Budget Category</DialogTitle>
              <DialogDescription>
                Set up a new budget category with allocation and time period
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="budgetAmount">Budget Amount ($)</Label>
                  <Input
                    id="budgetAmount"
                    name="budgetAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.budgetAmount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="period">Budget Period</Label>
                  <Select 
                    name="period"
                    defaultValue={formData.period}
                    onValueChange={(value) => handleSelectChange("period", value)}
                  >
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Budget</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Budget Category</DialogTitle>
              <DialogDescription>
                Update your budget category settings
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateCategory}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Category Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-budgetAmount">Budget Amount ($)</Label>
                  <Input
                    id="edit-budgetAmount"
                    name="budgetAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.budgetAmount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-period">Budget Period</Label>
                  <Select 
                    name="period"
                    defaultValue={formData.period}
                    onValueChange={(value) => handleSelectChange("period", value)}
                  >
                    <SelectTrigger id="edit-period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-notes">Notes (Optional)</Label>
                  <Input
                    id="edit-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Budget</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {budgetCategories.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No budget categories yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const percent = Math.round((category.spentAmount / category.budgetAmount) * 100);
            const status = calculateStatus(category.budgetAmount, category.spentAmount);
            const remaining = category.budgetAmount - category.spentAmount;
            
            return (
              <div 
                key={category.id} 
                className="p-4 border rounded-md"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div className="flex-1 mb-2 md:mb-0">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <Badge 
                        variant="outline" 
                        className="ml-2"
                      >
                        {category.period}
                      </Badge>
                      <Badge 
                        variant={
                          status === "on-track" 
                            ? "outline" 
                            : status === "over-budget" 
                              ? "destructive" 
                              : "secondary"
                        }
                        className="ml-2"
                      >
                        {status === "on-track" ? "On Track" : status === "over-budget" ? "Over Budget" : "Under Budget"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(category.startDate)} to {formatDate(category.endDate)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditSetup(category)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">${category.budgetAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Spent</p>
                    <p className="font-semibold">${category.spentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className={`font-semibold ${remaining < 0 ? 'text-destructive' : ''}`}>
                      ${remaining.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span>Progress</span>
                    <span className={
                      percent > 95 
                        ? 'text-destructive' 
                        : percent > 75 
                          ? 'text-amber-500 dark:text-amber-400' 
                          : 'text-emerald-500 dark:text-emerald-400'
                    }>
                      {percent}%
                    </span>
                  </div>
                  <Progress 
                    value={percent} 
                    className={
                      percent > 95 
                        ? 'bg-rose-100 dark:bg-rose-900' 
                        : percent > 75 
                          ? 'bg-amber-100 dark:bg-amber-900' 
                          : 'bg-emerald-100 dark:bg-emerald-900'
                    }
                  />
                </div>
                
                {category.notes && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>{category.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}