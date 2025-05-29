"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Edit, 
  MoreHorizontal, 
  Paperclip, 
  Plus, 
  Trash2 
} from "lucide-react";

const dummyData = [
  {
    id: 1,
    title: "Adobe Creative Cloud Subscription",
    description: "Monthly subscription for design software",
    category: "Software",
    subCategory: "Design Tools",
    platform: "Adobe",
    amount: 52.99,
    date: "2023-10-15",
    paymentMethod: "Credit Card",
    responsible: "Jane Smith",
  },
  {
    id: 2,
    title: "Facebook Ads Campaign",
    description: "Monthly ad spend for client XYZ",
    category: "Advertising",
    subCategory: "Social Media",
    platform: "Facebook",
    amount: 1200.00,
    date: "2023-10-12",
    paymentMethod: "Company Card",
    responsible: "John Doe",
  },
  {
    id: 3,
    title: "Office Supplies",
    description: "Paper, pens, and other office essentials",
    category: "Office",
    subCategory: "Supplies",
    platform: "Amazon",
    amount: 85.75,
    date: "2023-10-10",
    paymentMethod: "Credit Card",
    responsible: "Jane Smith",
  },
  {
    id: 4,
    title: "Freelancer Payment",
    description: "Logo design project for client ABC",
    category: "Contractors",
    subCategory: "Design",
    platform: "Upwork",
    amount: 350.00,
    date: "2023-10-08",
    paymentMethod: "Bank Transfer",
    responsible: "John Doe",
  },
  {
    id: 5,
    title: "Office Rent",
    description: "Monthly office space rent",
    category: "Rent",
    subCategory: "Office Space",
    platform: "Direct",
    amount: 1500.00,
    date: "2023-10-01",
    paymentMethod: "Bank Transfer",
    responsible: "Jane Smith",
  },
];

export function ExpenseTable() {
  const [data, setData] = useState(dummyData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    platform: "",
    amount: "",
    date: "",
    paymentMethod: "",
    responsible: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newItem = {
      id: data.length + 1,
      ...formData,
      amount: parseFloat(formData.amount),
    };
    
    setData([...data, newItem]);
    setIsDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      category: "",
      subCategory: "",
      platform: "",
      amount: "",
      date: "",
      paymentMethod: "",
      responsible: "",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Select defaultValue="10">
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">entries per page</span>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the details for the new expense transaction
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("category", value)}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Advertising">Advertising</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Contractors">Contractors</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="subCategory">Sub-Category</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("subCategory", value)}
                    >
                      <SelectTrigger id="subCategory">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Design Tools">Design Tools</SelectItem>
                        <SelectItem value="Marketing Tools">Marketing Tools</SelectItem>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Search Engines">Search Engines</SelectItem>
                        <SelectItem value="Supplies">Supplies</SelectItem>
                        <SelectItem value="Office Space">Office Space</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Input
                      id="platform"
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                      required
                    >
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Company Card">Company Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="responsible">Responsible Person</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("responsible", value)}
                    required
                  >
                    <SelectTrigger id="responsible">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="attachment"
                      type="file"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('attachment').click()}
                    >
                      <Paperclip className="mr-2 h-4 w-4" />
                      Attach File
                    </Button>
                    <span className="text-sm text-muted-foreground">No file selected</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Responsible</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div>{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                      {item.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.category}</Badge>
                  {item.subCategory && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.subCategory}
                    </div>
                  )}
                </TableCell>
                <TableCell>{item.platform}</TableCell>
                <TableCell className="text-right font-medium text-rose-600 dark:text-rose-400">
                  -${item.amount.toFixed(2)}
                </TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>{item.paymentMethod}</TableCell>
                <TableCell>{item.responsible}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{data.length}</span> of{" "}
          <span className="font-medium">{data.length}</span> entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}