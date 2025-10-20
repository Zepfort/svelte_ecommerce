// src/routes/products/subcategory/[slug]/+page.server.ts

import { createSupabaseServerClient } from '$lib/supabaseServer';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
  const { params } = event;
  const { slug } = params;
  const supabase = createSupabaseServerClient(event);

  // Ambil subkategori berdasarkan slug
  const { data: subcategory, error: subcatError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (subcatError || !subcategory) {
    throw error(404, `Subkategori dengan slug "${slug}" tidak ditemukan.`);
  }

  // Ambil produk berdasarkan category_id
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', subcategory.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (prodError) {
    console.error('Error fetching products:', prodError.message);
  }

  return {
    subcategory,
    products
  };
};
