// src/routes/checkout/success/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/supabaseServer';

export const load: PageServerLoad = async ({ url }) => {
  const orderId = url.searchParams.get('orderId');
  if (!orderId) throw error(400, 'Missing orderId');

  const supabase = createSupabaseServerClient({ request: { headers: new Headers() } } as any);

  // fetching
  const { data: order, error: err } = await supabase
    .from('orders')
    .select(
      `order_id,
       total_amount,
       payment_type,
       updated_at,
       order_items (
         quantity,
         price_at_purchase,
         products ( name )
       )`
    )
    .eq('order_id', orderId)
    .single();

  if (err || !order) throw error(404, 'Order not found');

  const items = order.order_items.map((oi: any) => ({
    name: oi.products?.name ?? 'Produk tidak tersedia',
    qty: oi.quantity,
    price: Number(oi.price_at_purchase),
    subtotal: Number(oi.quantity) * Number(oi.price_at_purchase)
  }));

  return {
    orderId: order.order_id,
    total: Number(order.total_amount),
    paidAt: new Date(order.updated_at).toLocaleString('id-ID'),
    paymentType: order.payment_type ?? '-',
    items
  };
};