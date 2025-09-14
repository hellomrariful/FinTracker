'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';

const budgetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(500).optional(),
  period: z.enum(['monthly', 'quarterly', 'yearly', 'custom']),
  periodStart: z.date(),
  periodEnd: z.date(),
  currency: z.string().default('USD'),
  totalAmount: z.number().positive('Amount must be positive'),
  rollover: z.boolean().default(false),
  alertsEnabled: z.boolean().default(true),
  defaultAlertThreshold: z.number().min(1).max(100).default(80),
  tags: z.array(z.string()).optional(),
  allocations: z.array(z.object({
    categoryName: z.string().min(1),
    limit: z.number().positive(),
    alertThreshold: z.number().min(1).max(100).optional(),
  })).min(1, 'At least one category allocation is required'),
}).refine(data => data.periodEnd > data.periodStart, {
  message: 'End date must be after start date',
  path: ['periodEnd'],
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  budget?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function BudgetForm({ budget, onClose, onSuccess }: BudgetFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: budget ? {
      name: budget.name,
      description: budget.description,
      period: budget.period,
      periodStart: new Date(budget.periodStart),
      periodEnd: new Date(budget.periodEnd),
      currency: budget.currency,
      totalAmount: budget.totalAmount,
      rollover: budget.rollover,
      alertsEnabled: budget.alertsEnabled,
      defaultAlertThreshold: budget.defaultAlertThreshold || 80,
      tags: budget.tags || [],
      allocations: budget.allocations.map((a: any) => ({
        categoryName: a.categoryName,
        limit: a.limit,
        alertThreshold: a.alertThreshold,
      })),
    } : {
      name: '',
      description: '',
      period: 'monthly',
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      currency: 'USD',
      totalAmount: 0,
      rollover: false,
      alertsEnabled: true,
      defaultAlertThreshold: 80,
      tags: [],
      allocations: [],
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.get('/api/categories');
      setCategories(data.map((cat: any) => cat.name));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const onSubmit = async (data: BudgetFormData) => {
    setLoading(true);
    try {
      if (budget) {
        await api.patch(`/api/budgets/${budget._id}`, data);
      } else {
        await api.post('/api/budgets', data);
      }

      toast.success(budget ? 'Budget updated successfully' : 'Budget created successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period: string) => {
    const start = new Date();
    let end = new Date();

    switch (period) {
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'quarterly':
        end.setMonth(end.getMonth() + 3);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
    }

    if (period !== 'custom') {
      form.setValue('periodStart', start);
      form.setValue('periodEnd', end);
    }
  };

  const addAllocation = () => {
    const allocations = form.getValues('allocations');
    form.setValue('allocations', [
      ...allocations,
      { categoryName: '', limit: 0, alertThreshold: undefined },
    ]);
  };

  const removeAllocation = (index: number) => {
    const allocations = form.getValues('allocations');
    form.setValue('allocations', allocations.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim()) {
      const tags = form.getValues('tags') || [];
      if (!tags.includes(newTag.trim())) {
        form.setValue('tags', [...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    const tags = form.getValues('tags') || [];
    form.setValue('tags', tags.filter(t => t !== tag));
  };

  const validateAllocations = () => {
    const allocations = form.getValues('allocations');
    const totalAllocated = allocations.reduce((sum, a) => sum + (a.limit || 0), 0);
    const totalAmount = form.getValues('totalAmount');
    
    if (totalAllocated > totalAmount) {
      toast.error(`Total allocations ($${totalAllocated}) exceed budget amount ($${totalAmount})`);
      return false;
    }
    return true;
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Create New Budget'}</DialogTitle>
          <DialogDescription>
            Set spending limits and track expenses by category
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Monthly Expenses" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Budget Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add notes about this budget" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Period Settings */}
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handlePeriodChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category Allocations */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Category Allocations</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAllocation}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {form.watch('allocations').map((_, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`allocations.${index}.categoryName`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`allocations.${index}.limit`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Limit"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`allocations.${index}.alertThreshold`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Alert %"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAllocation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {form.formState.errors.allocations && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.allocations.message}
                </p>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rollover"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="cursor-pointer">Enable Rollover</FormLabel>
                        <FormDescription className="text-xs">
                          Carry unused budget to next period
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alertsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="cursor-pointer">Enable Alerts</FormLabel>
                        <FormDescription className="text-xs">
                          Get notified when approaching limits
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="defaultAlertThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Alert Threshold (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Alert when budget usage reaches this percentage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <FormLabel>Tags (Optional)</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(form.watch('tags') || []).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  if (!validateAllocations()) {
                    e.preventDefault();
                  }
                }}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {budget ? 'Update' : 'Create'} Budget
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}