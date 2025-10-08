import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);

  // Ambil produk dari view atau dari tabel produk + kategori
 const { data: productsRaw, error } = await supabase
  .from('products_with_category')
  .select('*')
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error fetching products:', error.message);
}

// Lakukan mapping
const products = (productsRaw ?? []).map((row) => {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,                  // sekarang row.slug ada
    price: typeof row.price === 'number' ? row.price : parseFloat(row.price),
    image_url: row.image_url ?? '',
    rating: row.rating ?? 0,         // jika view tidak punya rating, ini default 0
    sold: row.sold ?? 0               // jika view tidak punya sold, default 0
  };
});

return {
  products
};
};
