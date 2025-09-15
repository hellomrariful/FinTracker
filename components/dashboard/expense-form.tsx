"use client";

import { useState } from "react";
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
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ExpenseFormProps {
  onSubmit: (data: any) => Promise<void>;
  expense?: any;
  categories?: Array<{ id: string; name: string }>;
  onCancel?: () => void;
}

export function ExpenseForm({
  onSubmit,
  expense,
  categories = [],
  onCancel,
}: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const data = {
        name: formData.get("name") as string,
        amount: parseFloat(formData.get("amount") as string),
        category: showNewCategory
          ? newCategory
          : (formData.get("category") as string),
        description: formData.get("description") as string,
        date: formData.get("date") as string,
        paymentMethod: formData.get("paymentMethod") as string,
        vendor: formData.get("vendor") as string,
        tags: (formData.get("tags") as string)
          ?.split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        attachments: attachedFiles.map((f) => f.id),
        isRecurring: formData.get("isRecurring") === "on",
        recurringFrequency: formData.get("recurringFrequency") as string,
      };

      await onSubmit(data);

      // Reset form
      setAttachedFiles([]);
      setNewCategory("");
      setShowNewCategory(false);

      toast.success(
        expense ? "Expense updated successfully" : "Expense added successfully"
      );
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Expense Name*</Label>
          <Input
            id="name"
            name="name"
            defaultValue={expense?.name}
            placeholder="Office supplies, Internet bill, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount*</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={expense?.amount}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category*</Label>
          {!showNewCategory ? (
            <Select
              name="category"
              defaultValue={expense?.category}
              onValueChange={(value) => {
                if (value === "new-category") {
                  setShowNewCategory(true);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat, index) => (
                  <SelectItem
                    key={cat.id || `category-${index}`}
                    value={cat.name}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
                <SelectItem key="new-category" value="new-category">
                  + Add new category
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewCategory(false);
                  setNewCategory("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date*</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={
              expense?.date || new Date().toISOString().split("T")[0]
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor/Merchant</Label>
          <Input
            id="vendor"
            name="vendor"
            defaultValue={expense?.vendor}
            placeholder="Amazon, Walmart, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method*</Label>
          <Select
            name="paymentMethod"
            defaultValue={expense?.paymentMethod || "credit_card"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="debit_card">Debit Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          defaultValue={expense?.description}
          placeholder="Additional details about this expense"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={expense?.tags?.join(", ")}
          placeholder="tax-deductible, business, travel (comma separated)"
        />
      </div>

      {/* Recurring Expense Options */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isRecurring"
            name="isRecurring"
            defaultChecked={expense?.isRecurring}
            className="h-4 w-4"
          />
          <Label htmlFor="isRecurring">This is a recurring expense</Label>
        </div>

        <Select
          name="recurringFrequency"
          defaultValue={expense?.recurringFrequency || "monthly"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* File Upload Section */}
      <div className="space-y-2">
        <Label>Receipts & Attachments</Label>
        <FileUpload
          category="receipts"
          entityType="expense"
          entityId={expense?.id}
          maxFiles={5}
          acceptedTypes={[
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
          ]}
          onUploadComplete={(files) => {
            setAttachedFiles(files);
            toast.success(`${files.length} file(s) attached`);
          }}
          onFileRemove={(fileId) => {
            setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
          }}
          existingFiles={attachedFiles}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {expense ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
}
