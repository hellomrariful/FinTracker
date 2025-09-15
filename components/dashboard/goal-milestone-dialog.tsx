'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

interface Milestone {
  _id?: string;
  title: string;
  description?: string;
  targetDate?: Date;
  targetAmount: number;
  completed: boolean;
  completedAt?: Date;
}

interface MilestoneDialogProps {
  goal: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function MilestoneDialog({ goal, onClose, onSuccess }: MilestoneDialogProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load existing milestones
    if (goal.milestones) {
      setMilestones(goal.milestones.map((m: any) => ({
        ...m,
        targetDate: m.targetDate ? new Date(m.targetDate) : undefined,
        completedAt: m.completedAt ? new Date(m.completedAt) : undefined,
      })));
    }
  }, [goal]);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: '',
        description: '',
        targetAmount: 0,
        completed: false,
      },
    ]);
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-set completedAt when marking as complete
    if (field === 'completed' && value === true) {
      updated[index].completedAt = new Date();
    } else if (field === 'completed' && value === false) {
      updated[index].completedAt = undefined;
    }
    
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Validate milestones
    const invalidMilestones = milestones.filter(m => !m.title || m.targetAmount <= 0);
    if (invalidMilestones.length > 0) {
      toast.error('Please fill in all required milestone fields');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/goals/${goal._id}/milestones`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestones }),
      });

      if (!response.ok) {
        throw new Error('Failed to update milestones');
      }

      toast.success('Milestones updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update milestones');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const totalAmount = milestones.reduce((sum, m) => sum + m.targetAmount, 0);

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Milestones</DialogTitle>
          <DialogDescription>
            Set milestones to track your progress towards "{goal.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          {milestones.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Milestones</p>
                <p className="text-lg font-semibold">{milestones.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-lg font-semibold">{completedCount} / {milestones.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Milestones List */}
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={cn(
                  "border rounded-lg p-4 space-y-3",
                  milestone.completed && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={milestone.completed}
                      onCheckedChange={(checked) => updateMilestone(index, 'completed', checked)}
                    />
                    {milestone.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Title*</Label>
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      placeholder="Milestone title"
                      disabled={milestone.completed}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Target Amount*</Label>
                    <Input
                      type="number"
                      value={milestone.targetAmount}
                      onChange={(e) => updateMilestone(index, 'targetAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      disabled={milestone.completed}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={milestone.description || ''}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                    placeholder="Describe this milestone"
                    rows={2}
                    disabled={milestone.completed}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !milestone.targetDate && "text-muted-foreground"
                        )}
                        disabled={milestone.completed}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {milestone.targetDate ? (
                          format(milestone.targetDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={milestone.targetDate}
                        onSelect={(date) => updateMilestone(index, 'targetDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {milestone.completed && milestone.completedAt && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Completed on {format(milestone.completedAt, 'PPP')}
                  </p>
                )}
              </div>
            ))}

            {/* Add Milestone Button */}
            <Button
              type="button"
              variant="outline"
              onClick={addMilestone}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Milestones
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}