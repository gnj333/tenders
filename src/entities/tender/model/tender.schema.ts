import { z } from 'zod';

export const TenderStatusSchema = z.enum(['draft', 'open', 'closed', 'awarded']);
export type TenderStatus = z.infer<typeof TenderStatusSchema>;

export const TenderSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  status: TenderStatusSchema,
  budget: z.number().nonnegative(),
  currency: z.string().length(3),
  deadline: z.string().datetime(),
  publishedAt: z.string().datetime(),
  category: z.string().min(1),
  organization: z.string().min(1),
});

export type Tender = z.infer<typeof TenderSchema>;

export const TenderListParamsSchema = z.object({
  q: z.string().trim().min(1).optional(),
  status: TenderStatusSchema.optional(),
  category: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type TenderListParams = z.input<typeof TenderListParamsSchema>;

export const TenderListResponseSchema = z.object({
  items: TenderSchema.array(),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
});

export type TenderListResponse = z.infer<typeof TenderListResponseSchema>;

/**
 * Input shape for creating a tender. Subset of {@link TenderSchema}: server
 * fills in `id`, `slug`, `publishedAt`, and defaults `status` to `'open'`.
 */
export const TenderCreateInputSchema = z.object({
  title: z.string().trim().min(3, 'Название должно содержать не менее 3 символов'),
  summary: z.string().trim().min(10, 'Краткое описание должно содержать не менее 10 символов'),
  description: z.string().trim().min(20, 'Подробное описание должно содержать не менее 20 символов'),
  budget: z.coerce.number().nonnegative('Бюджет не может быть отрицательным'),
  currency: z.enum(['RUB', 'USD', 'EUR']),
  deadline: z.string().datetime({ message: 'Неверный формат даты-времени ISO' }),
  category: z.string().trim().min(2, 'Категория должна содержать не менее 2 символов'),
  organization: z.string().trim().min(2, 'Название организации должно содержать не менее 2 символов'),
});

/** Output type — what the server receives after Zod coercion. */
export type TenderCreateInput = z.output<typeof TenderCreateInputSchema>;

/** Input type — what the form holds before coercion (e.g. budget is string). */
export type TenderCreateFormValues = z.input<typeof TenderCreateInputSchema>;
