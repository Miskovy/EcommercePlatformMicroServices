import { z } from 'zod';

// Regex for strict MongoDB ObjectId validation
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const createPurchaseSchema = z.object({
    productId: objectIdSchema,
    supplierId: objectIdSchema,
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    totalPrice: z.coerce.number().positive('Total price must be positive'),
    financialAccountId: objectIdSchema
});

export type createPurchaseInput = z.infer<typeof createPurchaseSchema>;