// src/routes/product/[slug]/+page.server.ts

import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';  // path menyesuaikan
import type { PageServerLoad } from './$types';
import type { Product } from '$lib/types/Product';

export const load: PageServerLoad = async (event) => {
  const { params } = event;
  const slug = params.slug

  // buat client Supabase server-side
  const supabase = createSupabaseServerClient(event);

  // query produk berdasarkan slug
  const { data, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();  // hanya satu record diharapkan

  if (fetchError) {
    console.error('Error fetching product', fetchError);
    throw error(500, 'Error fetching product');
  }

  if (!data) {
    // jika tidak ada produk dengan slug tersebut
    throw error(404, 'Produk tidak ditemukan');
  }

  // data ada — map ke shape yang diharapkan oleh frontend (jika perlu transformasi)
  const product: Product = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: parseFloat(data.price as unknown as string),  // karena `numeric`
    stock: data.stock,
    image_url: data.image_url ?? '',  // atau default
    isActive: data.is_active,
    category_id: data.category_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,

    // jika kamu punya field tambahan seperti sold, rating, condition, min_order, from, dsb,
    // dan data itu ada di tabel atau di join tabel lain, kamu perlu join / query tambahan di sini
    sold: (data).sold ?? 0,
    rating: (data).rating ?? 0,
    condition: (data).condition ?? '',
    min_order: (data).min_order ?? 1,
    from: (data).from ?? ''
  };

  return {
    product
  };
};
