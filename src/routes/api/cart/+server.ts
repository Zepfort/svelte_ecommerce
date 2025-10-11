// src/routes/api/cart/+server.ts
import { json, error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const userId = event.locals.session?.user.id;
  if (!userId) throw error(401, 'Unauthorized');

  const { data: cartList, error: errCart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .single();
  if (errCart && errCart.code !== 'PGRST116') throw error(500, 'Error getting cart');

  if (!cartList) {
    return json({ items: [] });
  }

  const cartId = cartList.id;
  const { data: items, error: errItems } = await supabase
    .from('cart_items')
    .select(`
      id,
      product_id,
      qty,
      price_at_addition,
      products (
        name,
        slug,
        image_url,
        price
      )
    `)
    .eq('cart_id', cartId);

  if (errItems) throw error(500, 'Error getting cart items');

  const mapped = (items ?? []).map((it) => {
  const prod = Array.isArray(it.products) ? it.products[0] : it.products;
  return {
    id: it.id,
    product_id: it.product_id,
    qty: it.qty,
    price_at_addition: it.price_at_addition,
    name: prod?.name ?? '',
    slug: prod?.slug ?? '',
    image_url: prod?.image_url ?? '',
    price: prod?.price ?? 0
  };
});

return new Response(JSON.stringify({ items: mapped }), { status: 200 });
};

export const POST: RequestHandler = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const userId = event.locals.session?.user.id;
  if (!userId) throw error(401, 'Unauthorized');

  const body = await event.request.json();
  const { product_id, qty } = body;

  // cari atau buat cart aktif
  const { data: existingCart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  let cartId = existingCart?.id;
  if (!cartId) {
    const { data: newCart, error: errNew } = await supabase
      .from('carts')
      .insert([{ user_id: userId, status: 'active' }])
      .select('id')
      .single();
    if (errNew) throw error(500, 'Error creating cart');
    cartId = newCart.id;
  }

  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id, qty')
    .eq('cart_id', cartId)
    .eq('product_id', product_id)
    .maybeSingle();

  if (existingItem) {
    await supabase
      .from('cart_items')
      .update({ qty: existingItem.qty + qty })
      .eq('id', existingItem.id);
  } else {
    const { data: prod } = await supabase
      .from('products')
      .select('price')
      .eq('id', product_id)
      .single();
    if (!prod) throw error(404, 'Product not found');

    await supabase.from('cart_items').insert([{
      cart_id: cartId,
      product_id,
      qty,
      price_at_addition: prod.price
    }]);
  }

  // Setelah insert/update, ambil ulang data cart items untuk dikembalikan
  const { data: itemsAfter, error: errItemsAfter } = await supabase
    .from('cart_items')
    .select(`
      id,
      product_id,
      qty,
      price_at_addition,
      products (
        name,
        slug,
        image_url,
        price
      )
    `)
    .eq('cart_id', cartId);

  if (errItemsAfter) {
    console.error('Error fetching items after POST', errItemsAfter);
  }

  const mappedAfter = (itemsAfter ?? []).map((i) => {
  const prodRel = i.products;
  let prod: { name: string; slug: string; image_url: string; price: number } | null = null;

  if (Array.isArray(prodRel)) {
    prod = prodRel[0] ?? null;
  } else {
    prod = prodRel ?? null;
  }

  return {
    id: i.id,
    product_id: i.product_id,
    qty: i.qty,
    name: prod?.name ?? '',
    slug: prod?.slug ?? '',
    image_url: prod?.image_url ?? '',
    price: Number(prod?.price ?? i.price_at_addition ?? 0)
  };
});
  return json({ items: mappedAfter });
};
