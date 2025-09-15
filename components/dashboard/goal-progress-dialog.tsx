'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProgressUpdateDialogProps {
  goal: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProgressUpdateDialog({ goal, onClose, onSuccess }: ProgressUpdateDialogProps) {
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'add' | 'subtract'>('add');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const finalAmount = type === 'add' ? amount : -amount;
      
      const response = await fetch(`/api/goals/${goal._id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          description,
          source: 'manual',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      toast.success('Progress updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update progress');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentProgress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            Track your progress towards "{goal.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Progress</span>
              <span className="font-medium">
                ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentProgress}% complete</span>
              <span>${remaining.toFixed(2)} remaining</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type */}
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select value={type} onValueChange={(value: 'add' | 'subtract') => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span>Add to Goal</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="subtract">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span>Subtract from Goal</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="pl-8"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a note about this update"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Preview */}
            {amount > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-1">
                <p className="text-sm font-medium">After this update:</p>
                <p className="text-sm text-muted-foreground">
                  New amount: ${(type === 'add' ? goal.currentAmount + amount : goal.currentAmount - amount).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Progress: {((type === 'add' ? goal.currentAmount + amount : goal.currentAmount - amount) / goal.targetAmount * 100).toFixed(1)}%
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || amount <= 0}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Progress
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}