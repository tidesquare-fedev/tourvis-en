import { z } from 'zod'

export const BannerSchema = z.object({
  id: z.string().or(z.number()).transform(String),
  image: z.string().default(''),
  title: z.string().default(''),
  subtitle: z.string().default(''),
  href: z.string().optional().nullable(),
})

export type Banner = z.infer<typeof BannerSchema>

export const RegionSchema = z.object({
  id: z.string().or(z.number()).transform(String),
  name: z.string().default(''),
  subtitle: z.string().default(''),
  image: z.string().default(''),
})

export type Region = z.infer<typeof RegionSchema>

export const ProductItemSchema = z.object({
  id: z.string().or(z.number()).transform(String),
  title: z.string().default(''),
  image: z.string().default(''),
  category: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  href: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  reviewCount: z.number().optional().nullable(),
  originalPrice: z.number().or(z.string()).optional().nullable(),
  discountRate: z.number().or(z.string()).optional().nullable(),
  price: z.number().or(z.string()).optional().nullable(),
})

export type ProductItem = z.infer<typeof ProductItemSchema>

export const CategorySchema = z.object({
  title: z.string().default(''),
  items: z.array(ProductItemSchema).default([]),
})

export type Category = z.infer<typeof CategorySchema>

export const HomeDataSchema = z.object({
  banners: z.array(BannerSchema).default([]),
  regions: z.array(RegionSchema).default([]),
  categories: z.array(CategorySchema).default([]),
})

export type HomeData = z.infer<typeof HomeDataSchema>

// Template-driven sections
export type SectionTemplate =
  | 'TV_TM_CAROUSEL'
  | 'TV_TAB_BSTP'
  | 'TV_PC_IV_LINE_BANNER_A'
  | 'TV_PC_TM_PRODUCT_4X1'
  | 'TV_TAB_TWOGRID'

export type Section =
  | { templateId: 'TV_TM_CAROUSEL'; regions: Region[] }
  | { templateId: 'TV_TAB_BSTP'; categories: Category[]; title?: string }
  | { templateId: 'TV_PC_IV_LINE_BANNER_A'; banners: Banner[] }
  | { templateId: 'TV_PC_TM_PRODUCT_4X1'; category: Category }
  | { templateId: 'TV_TAB_TWOGRID'; categories: Category[]; title?: string }


