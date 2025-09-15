"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

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
  onClose,
}: IncomeFormProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newSource, setNewSource] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewSourceInput, setShowNewSourceInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("Bank Transfer");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("none");

  useEffect(() => {
    if (income) {
      setSelectedCategory(income.category);
      setSelectedSource(income.source);
      setSelectedPaymentMethod(income.paymentMethod || "Bank Transfer");
      setSelectedEmployeeId(
        typeof income.employeeId === "object" && income.employeeId !== null
          ? income.employeeId._id
          : income.employeeId || "none"
      );
    }
  }, [income]);

  const resetForm = () => {
    setNewCategory("");
    setNewSource("");
    setShowNewCategoryInput(false);
    setShowNewSourceInput(false);
    setSelectedCategory("");
    setSelectedSource("");
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setShowNewCategoryInput(value === "new-category");
    if (value !== "new-category") {
      setNewCategory("");
    }
  };

  const handleSourceChange = (value: string) => {
    setSelectedSource(value);
    setShowNewSourceInput(value === "new-source");
    if (value !== "new-source") {
      setNewSource("");
    }
  };

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      let categoryName = selectedCategory;
      if (selectedCategory === "new-category" && newCategory.trim()) {
        // Create new category
        const result = await api.post<any>("/api/categories", {
          name: newCategory.trim(),
          type: "income",
        });
        // Handle both possible response structures
        categoryName = result?.data?.name || result?.name || newCategory.trim();
      }

      let sourceName = selectedSource;
      if (selectedSource === "new-source" && newSource.trim()) {
        sourceName = newSource.trim();
      }

      // Validate required fields
      if (!sourceName) {
        toast.error("Please select or create a source");
        setIsSubmitting(false);
        return;
      }

      if (!categoryName) {
        toast.error("Please select or create a category");
        setIsSubmitting(false);
        return;
      }

      // Validate and parse amount
      const amountStr = formData.get("amount") as string;
      const amount = parseFloat(amountStr);

      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount greater than 0");
        setIsSubmitting(false);
        return;
      }

      const incomeData = {
        name: formData.get("name") as string,
        source: sourceName,
        category: categoryName,
        platform: (formData.get("platform") as string) || undefined,
        amount: amount,
        date: formData.get("date") as string,
        paymentMethod: selectedPaymentMethod,
        employeeId:
          selectedEmployeeId === "none"
            ? undefined
            : selectedEmployeeId || undefined,
        status: "completed" as const,
      };

      const result = income
        ? await api.patch(`/api/income/${income.id}`, incomeData)
        : await api.post("/api/income", incomeData);

      toast.success(
        income ? "Income updated successfully" : "Income added successfully"
      );
      router.refresh(); // Refresh the page data
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
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
              <SelectItem key="new-source" value="new-source">
                + Add new source
              </SelectItem>
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
              {categories
                .filter(
                  (category) => category.name && category.name.trim() !== ""
                )
                .map((category, index) => (
                  <SelectItem
                    key={category.id || `category-${index}`}
                    value={category.name}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              <SelectItem key="new-category" value="new-category">
                + Add new category
              </SelectItem>
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
          <Select
            value={selectedPaymentMethod}
            onValueChange={setSelectedPaymentMethod}
          >
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
        {employees && employees.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee (Optional)</Label>
            <Select
              value={selectedEmployeeId}
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Employee</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {income ? "Updating..." : "Adding..."}
            </>
          ) : income ? (
            "Update Income"
          ) : (
            "Add Income"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
