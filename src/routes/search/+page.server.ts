import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/supabaseServer';

export const load: PageServerLoad = async (event) => {
  const q = event.url.searchParams.get('q')?.trim() ?? '';
  if (!q) {
    return { products: [], q };
  }

  const supabase = createSupabaseServerClient(event);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description, image_url, price, slug')
    .ilike('name', `%${q}%`)
    .limit(20);

  if (error) {
    console.error('Supabase search error:', error);
    return { products: [], q };
  }

  return { products, q };
};
