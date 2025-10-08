// src/lib/types/product.ts
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  rating?: number;
  sold?: number;
  condition?: string;
  min_order?: string;
}

export interface Product extends ProductListItem {
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  description: string;
  category_id: string;
  from?: string;
  // properti lain jika ada
}


