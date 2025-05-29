"use client";

import { useState } from "react";
import { 
  Edit2, 
  Trash2, 
  Plus, 
  MoreHorizontal,
  Circle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const incomeCategories = [
  { id: 1, name: "Web Development", color: "#3B82F6", count: 12, amount: 24500 },
  { id: 2, name: "SEO", color: "#10B981", count: 8, amount: 12800 },
  { id: 3, name: "Social Media", color: "#F59E0B", count: 5, amount: 8200 },
  { id: 4, name: "Consulting", color: "#6366F1", count: 7, amount: 14500 },
  { id: 5, name: "PPC", color: "#EC4899", count: 3, amount: 5800 },
];

const expenseCategories = [
  { id: 1, name: "Software", color: "#3B82F6", count: 9, amount: 1850 },
  { id: 2, name: "Advertising", color: "#EF4444", count: 7, amount: 6800 },
  { id: 3, name: "Office", color: "#F59E0B", count: 5, amount: 2200 },
  { id: 4, name: "Contractors", color: "#8B5CF6", count: 4, amount: 4100 },
  { id: 5, name: "Rent", color: "#10B981", count: 1, amount: 1500 },
];

const colors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
  { name: "Purple", value: "#8B5CF6" },
];

export function CategoryList({ type }) {
  const [categories, setCategories] = useState(
    type === "income" ? incomeCategories : expenseCategories
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    color: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleColorChange = (value) => {
    setFormData({
      ...formData,
      color: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCategory = {
      id: categories.length + 1,
      name: formData.name,
      color: formData.color,
      count: 0,
      amount: 0,
    };
    
    setCategories([...categories, newCategory]);
    setIsDialogOpen(false);
    setFormData({
      name: "",
      color: "",
    });
  };

  return (
    <div>
      <div className="mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New {type === "income" ? "Income" : "Expense"} Category</DialogTitle>
              <DialogDescription>
                Add a new category to better organize your finances
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
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
                  <Label htmlFor="color">Color</Label>
                  <Select onValueChange={handleColorChange} required>
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div 
                              className="h-4 w-4 rounded-full mr-2" 
                              style={{ backgroundColor: color.value }}
                            ></div>
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="flex items-center justify-between p-3 border rounded-md"
          >
            <div className="flex items-center">
              <div 
                className="h-4 w-4 rounded-full mr-3" 
                style={{ backgroundColor: category.color }}
              ></div>
              <div>
                <div className="font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground">
                  {category.count} transactions · ${category.amount.toLocaleString()}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}