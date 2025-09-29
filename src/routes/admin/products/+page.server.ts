import { fail, redirect } from '@sveltejs/kit';


export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const fd = await request.formData();
    const name = String(fd.get('name') ?? '');
    const slugInput = String(fd.get('slug') ?? '');

    // generate fallback slug jika slug input kosong
    const slug = slugInput.trim()
      ? slugInput.trim()
      : name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    // validasi unik slug
    const { data: existing, error: existErr } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return fail(400, { errors: ['Slug sudah digunakan'] });
    }

    // insert produk
    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        price: Number(fd.get('price')),
        stock: Number(fd.get('stock')),
        category_id: fd.get('category_id')
      });

    if (error) {
      return fail(500, { errors: [error.message] });
    }

    // sukses
    throw redirect(303, '/admin/products');
  }
};
