import { z } from "zod";

export const ProductSchema = z
  .object({
    _id: z.string().readonly(),
    __v: z.number().readonly(),
    is_enabled: z.boolean().optional(),
    primary_category: z.string(),
    sub_category: z.array(z.string()),
    name: z.string(),
    price: z.number(),
    strength: z.string().optional(),
    type: z.string().optional(),
    model: z.string().optional(),
    size: z.string().optional(),
    quantity: z.number().optional(),
    quantity_unit: z.string().optional(),
    company_name: z.string().optional(),
    generic_name: z.string().optional(),
    discount_amount: z.number().optional(),
    discount_percentage: z.number().optional(),
    is_hot_deal: z.boolean().optional(),
    is_featured: z.boolean().optional(),
    is_daily_deal: z.boolean().optional(),
    images: z.array(z.array(z.string())),
    stock: z.number().optional(),
    code: z.number().optional(),
    batch_id: z.number().optional(),
    manufacture_date: z.coerce.date().optional(),
    expiration_date: z.coerce.date().optional(),
    description: z.string().optional(),
    createdAt: z.coerce.date().readonly(),
    updatedAt: z.coerce.date().readonly(),
  })
  .strict();

export const ProductsSchema = z.array(ProductSchema);

export type ProductType = z.infer<typeof ProductSchema>;
