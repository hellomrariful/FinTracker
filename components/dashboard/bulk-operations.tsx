'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronDown, 
  Trash2, 
  Edit, 
  Download, 
  Tag, 
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Copy,
  Archive,
  MoreVertical,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { cn } from '@/lib/utils';

interface BulkOperationsProps {
  items: any[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onBulkAction: (action: string, ids: string[]) => Promise<void>;
  itemType: 'income' | 'expense' | 'asset' | 'budget' | 'goal';
  customActions?: BulkAction[];
}

interface BulkAction {
  label: string;
  value: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  requireConfirm?: boolean;
}

export function BulkOperations({
  items,
  selectedIds,
  onSelectionChange,
  onBulkAction,
  itemType,
  customActions = [],
}: BulkOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [processProgress, setProcessProgress] = useState(0);

  const handleSelectAll = () => {
    if (selectedIds.size === items.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(items.map(item => item.id || item._id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  const handleSelectRange = (startId: string, endId: string) => {
    const startIndex = items.findIndex(item => (item.id || item._id) === startId);
    const endIndex = items.findIndex(item => (item.id || item._id) === endId);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const [start, end] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
      const rangeIds = items.slice(start, end + 1).map(item => item.id || item._id);
      const newSelection = new Set(selectedIds);
      rangeIds.forEach(id => newSelection.add(id));
      onSelectionChange(newSelection);
    }
  };

  const getDefaultActions = (): BulkAction[] => {
    const actions: BulkAction[] = [];

    switch (itemType) {
      case 'income':
      case 'expense':
        actions.push(
          { label: 'Edit Category', value: 'edit-category', icon: <Tag className="h-4 w-4" /> },
          { label: 'Update Status', value: 'update-status', icon: <CheckCircle className="h-4 w-4" /> },
          { label: 'Change Date', value: 'change-date', icon: <Calendar className="h-4 w-4" /> },
          { label: 'Add Tags', value: 'add-tags', icon: <Tag className="h-4 w-4" /> },
          { label: 'Export Selected', value: 'export', icon: <Download className="h-4 w-4" /> },
          { label: 'Duplicate', value: 'duplicate', icon: <Copy className="h-4 w-4" /> },
          { label: 'Archive', value: 'archive', icon: <Archive className="h-4 w-4" /> },
          { label: 'Delete', value: 'delete', icon: <Trash2 className="h-4 w-4" />, variant: 'destructive', requireConfirm: true }
        );
        break;

      case 'asset':
        actions.push(
          { label: 'Update Value', value: 'update-value', icon: <DollarSign className="h-4 w-4" /> },
          { label: 'Change Status', value: 'change-status', icon: <CheckCircle className="h-4 w-4" /> },
          { label: 'Add Maintenance', value: 'add-maintenance', icon: <FileText className="h-4 w-4" /> },
          { label: 'Export Selected', value: 'export', icon: <Download className="h-4 w-4" /> },
          { label: 'Archive', value: 'archive', icon: <Archive className="h-4 w-4" /> },
          { label: 'Delete', value: 'delete', icon: <Trash2 className="h-4 w-4" />, variant: 'destructive', requireConfirm: true }
        );
        break;

      case 'budget':
        actions.push(
          { label: 'Activate', value: 'activate', icon: <CheckCircle className="h-4 w-4" /> },
          { label: 'Deactivate', value: 'deactivate', icon: <XCircle className="h-4 w-4" /> },
          { label: 'Reset', value: 'reset', icon: <AlertCircle className="h-4 w-4" /> },
          { label: 'Duplicate', value: 'duplicate', icon: <Copy className="h-4 w-4" /> },
          { label: 'Export Selected', value: 'export', icon: <Download className="h-4 w-4" /> },
          { label: 'Delete', value: 'delete', icon: <Trash2 className="h-4 w-4" />, variant: 'destructive', requireConfirm: true }
        );
        break;

      case 'goal':
        actions.push(
          { label: 'Update Progress', value: 'update-progress', icon: <TrendingUp className="h-4 w-4" /> },
          { label: 'Change Priority', value: 'change-priority', icon: <AlertCircle className="h-4 w-4" /> },
          { label: 'Pause Goals', value: 'pause', icon: <XCircle className="h-4 w-4" /> },
          { label: 'Resume Goals', value: 'resume', icon: <CheckCircle className="h-4 w-4" /> },
          { label: 'Export Selected', value: 'export', icon: <Download className="h-4 w-4" /> },
          { label: 'Delete', value: 'delete', icon: <Trash2 className="h-4 w-4" />, variant: 'destructive', requireConfirm: true }
        );
        break;
    }

    return actions;
  };

  const allActions = [...getDefaultActions(), ...customActions];

  const handleAction = async (action: string) => {
    const actionConfig = allActions.find(a => a.value === action);
    
    if (actionConfig?.requireConfirm) {
      setPendingAction(action);
      setShowConfirmDialog(true);
      return;
    }

    await executeAction(action);
  };

  const executeAction = async (action: string) => {
    setIsProcessing(true);
    setProcessProgress(0);

    try {
      const selectedIdArray = Array.from(selectedIds);
      const batchSize = 10; // Process in batches of 10
      const totalBatches = Math.ceil(selectedIdArray.length / batchSize);

      for (let i = 0; i < totalBatches; i++) {
        const batch = selectedIdArray.slice(i * batchSize, (i + 1) * batchSize);
        await onBulkAction(action, batch);
        setProcessProgress(((i + 1) / totalBatches) * 100);
      }

      toast.success(`Successfully completed ${action} for ${selectedIds.size} items`);
      onSelectionChange(new Set());
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error(`Failed to complete ${action}`);
    } finally {
      setIsProcessing(false);
      setProcessProgress(0);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const selectedCount = selectedIds.size;
  const isAllSelected = selectedCount === items.length && items.length > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < items.length;

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onCheckedChange={handleSelectAll}
            aria-label="Select all"
          />
          
          {selectedCount > 0 && (
            <>
              <Badge variant="secondary" className="font-medium">
                {selectedCount} selected
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isProcessing}>
                    Bulk Actions
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allActions.map((action) => (
                    <DropdownMenuItem
                      key={action.value}
                      onClick={() => handleAction(action.value)}
                      className={cn(
                        action.variant === 'destructive' && 'text-destructive focus:text-destructive'
                      )}
                    >
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectionChange(new Set())}
                >
                  Clear selection
                </Button>
              )}
            </>
          )}
        </div>

        {isProcessing && (
          <div className="flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            <Progress value={processProgress} className="w-32" />
            <span className="text-sm text-muted-foreground">
              Processing...
            </span>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {pendingAction} {selectedCount} selected items?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will affect {selectedCount} {itemType}{selectedCount > 1 ? 's' : ''}.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => pendingAction && executeAction(pendingAction)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm ${pendingAction}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Selectable Table Row Component
interface SelectableRowProps {
  id: string;
  selected: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function SelectableRow({
  id,
  selected,
  onSelect,
  children,
  className,
}: SelectableRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors",
        selected && "bg-muted",
        className
      )}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={() => onSelect(id)}
        aria-label={`Select item ${id}`}
      />
      {children}
    </div>
  );
}

// Bulk Action Menu for Individual Items
interface ItemActionMenuProps {
  item: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  customActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
}

export function ItemActionMenu({
  item,
  onEdit,
  onDelete,
  onDuplicate,
  customActions = [],
}: ItemActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
        )}
        {customActions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.onClick}>
            {action.icon}
            <span className="ml-2">{action.label}</span>
          </DropdownMenuItem>
        ))}
        {(onEdit || onDuplicate || customActions.length > 0) && onDelete && (
          <DropdownMenuSeparator />
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}