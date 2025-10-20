// src/routes/products/category/[slug]/+page.server.ts

import { createSupabaseServerClient } from '$lib/supabaseServer';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
  const { params } = event;
  const { slug } = params;
  const supabase = createSupabaseServerClient(event);

  // Ambil kategori berdasarkan slug
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (catError || !category) {
    throw error(404, `Kategori dengan slug "${slug}" tidak ditemukan.`);
  }

  // Ambil produk berdasarkan category_id
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (prodError) {
    console.error('Error fetching products:', prodError.message);
  }

  return {
    category,
    products
  };
};
