export type ProductItem = {
  id: string
  title: string
  image?: string | null
  price?: number | null
  originalPrice?: number | null
  discountRate?: number | null
  rating?: number | null
  reviewCount?: number | null
  location?: string | null
  category?: string | null
}

export type ProductSearchResponse = {
  total: number
  offset?: number
  count?: number
  list: any[]
}


