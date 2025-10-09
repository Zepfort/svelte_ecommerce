// import dan setup supabase server client
import { json, error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const supabase = createSupabaseServerClient(event);
  // fetch cart (active) + items for current user
  const { data: cartList, error: errCart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', event.locals.session?.user.id)
    .eq('status', 'active')
    .limit(1)
    .single();
  if (errCart) throw error(500, 'Error getting cart');

  if (!cartList) {
    return json({ items: [] });
  }

  const cartId = cartList.id;
  const { data: items, error: errItems } = await supabase
    .from('cart_items')
    .select('id, product_id, qty, price_at_addition, products(name, slug, image_url, price)')
    .eq('cart_id', cartId);
  if (errItems) throw error(500, 'Error getting cart items');

  return json({ items });
};

export const POST: RequestHandler = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const body = await event.request.json();
  const { product_id, qty } = body;

  // Pastikan user punya cart aktif, atau buat baru
  const { data: existingCart, error: errCart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', event.locals.session?.user.id)
    .eq('status', 'active')
    .limit(1)
    .single();

  let cartId: string;
  if (!existingCart) {
    const { data: newCart, error: errNewCart } = await supabase
      .from('carts')
      .insert([{ user_id: event.locals.session?.user.id }])
      .select('id')
      .single();
    if (errNewCart) throw error(500, 'Error creating cart');
    cartId = newCart.id;
  } else {
    cartId = existingCart.id;
  }

  // tambah atau update item
  const { data: existingItem, error: errItem } = await supabase
    .from('cart_items')
    .select('id, qty')
    .eq('cart_id', cartId)
    .eq('product_id', product_id)
    .limit(1)
    .single();

  if (existingItem) {
    // update qty
    const newQty = existingItem.qty + qty;
    await supabase
      .from('cart_items')
      .update({ qty: newQty })
      .eq('id', existingItem.id);
  } else {
    // insert baru
    // ambil harga produk sekarang
    const { data: prod, error: errProd } = await supabase
      .from('products')
      .select('price')
      .eq('id', product_id)
      .single();
    if (errProd || !prod) throw error(500, 'Product not found');

    await supabase
      .from('cart_items')
      .insert([{
        cart_id: cartId,
        product_id,
        qty,
        price_at_addition: prod.price
      }]);
  }

  return new Response(null, { status: 204 });
};
