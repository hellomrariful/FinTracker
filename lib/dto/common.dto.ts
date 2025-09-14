import { z } from 'zod';

/**
 * MongoDB ObjectId validation
 */
export const objectIdSchema = z.string().regex(
  /^[0-9a-fA-F]{24}$/,
  'Invalid ID format'
);

/**
 * Pagination query parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Sort query parameters
 */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Date range query parameters base schema
 */
export const dateRangeBaseSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

/**
 * Date range query parameters with validation
 */
export const dateRangeSchema = dateRangeBaseSchema.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  }
);

/**
 * Search query parameters
 */
export const searchSchema = z.object({
  q: z.string().min(1).optional(),
  search: z.string().min(1).optional(),
});

/**
 * Currency amount validation (in cents)
 */
export const amountSchema = z.number()
  .int()
  .min(0)
  .max(999999999) // Max ~10 million
  .or(z.string().regex(/^\d+$/).transform(Number));

/**
 * Email validation
 */
export const emailSchema = z.string()
  .email('Invalid email address')
  .toLowerCase()
  .trim();

/**
 * Password validation
 */
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

/**
 * Phone number validation
 */
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');

/**
 * URL validation
 */
export const urlSchema = z.string().url('Invalid URL');

/**
 * Color hex code validation
 */
export const colorSchema = z.string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format');

/**
 * Tag validation
 */
export const tagSchema = z.string()
  .min(1)
  .max(50)
  .regex(/^[a-zA-Z0-9-_]+$/, 'Tags can only contain letters, numbers, hyphens, and underscores');

/**
 * File attachment schema
 */
export const attachmentSchema = z.object({
  url: z.string().url(),
  filename: z.string(),
  size: z.number().int().positive(),
  contentType: z.string(),
  uploadedAt: z.coerce.date().optional(),
});

/**
 * Address schema
 */
export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

/**
 * Create a partial schema for updates
 */
export function createUpdateSchema<T extends z.ZodObject<any>>(
  schema: T
): z.ZodObject<any> {
  const shape = schema.shape;
  const partialShape: any = {};
  
  for (const key in shape) {
    partialShape[key] = shape[key].optional();
  }
  
  return z.object(partialShape);
}

/**
 * ID parameter schema
 */
export const idParamSchema = z.object({
  id: objectIdSchema,
});

/**
 * Batch operation schema
 */
export const batchSchema = z.object({
  ids: z.array(objectIdSchema).min(1).max(100),
});

/**
 * Status enum
 */
export const statusSchema = z.enum(['active', 'inactive', 'pending', 'completed', 'cancelled']);

/**
 * Priority enum
 */
export const prioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

/**
 * Frequency enum for recurring items
 */
export const frequencySchema = z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']);

export type PaginationParams = z.infer<typeof paginationSchema>;
export type SortParams = z.infer<typeof sortSchema>;
export type DateRangeParams = z.infer<typeof dateRangeSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
export type AttachmentData = z.infer<typeof attachmentSchema>;
export type AddressData = z.infer<typeof addressSchema>;