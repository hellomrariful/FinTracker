import { z } from 'zod';
import { 
  objectIdSchema, 
  amountSchema, 
  attachmentSchema,
  tagSchema,
  paginationSchema,
  sortSchema,
  dateRangeBaseSchema,
  searchSchema,
  createUpdateSchema
} from './common.dto';

/**
 * Income creation schema
 */
export const createIncomeSchema = z.object({
  name: z.string().min(1).max(200),
  source: z.string().min(1).max(200),
  category: z.string().min(1),
  platform: z.string().optional(),
  amount: amountSchema,
  date: z.coerce.date(),
  paymentMethod: z.enum(['Bank Transfer', 'PayPal', 'Credit Card', 'Stripe', 'Check', 'Cash', 'Cryptocurrency', 'Other']),
  employeeId: objectIdSchema.optional(),
  status: z.enum(['completed', 'pending', 'cancelled']).default('pending'),
  recurring: z.boolean().optional(),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional(),
  description: z.string().max(1000).optional(),
  attachments: z.array(attachmentSchema).optional(),
  tags: z.array(tagSchema).optional(),
});

/**
 * Income update schema (partial)
 */
export const updateIncomeSchema = createUpdateSchema(createIncomeSchema);

/**
 * Income query filters
 */
export const incomeFiltersSchema = z.object({
  ...paginationSchema.shape,
  ...sortSchema.shape,
  ...dateRangeBaseSchema.shape,
  ...searchSchema.shape,
  category: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(['completed', 'pending', 'cancelled']).optional(),
  paymentMethod: z.string().optional(),
  employeeId: objectIdSchema.optional(),
  recurring: z.coerce.boolean().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
});

export type CreateIncomeData = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeData = z.infer<typeof updateIncomeSchema>;
export type IncomeFilters = z.infer<typeof incomeFiltersSchema>;