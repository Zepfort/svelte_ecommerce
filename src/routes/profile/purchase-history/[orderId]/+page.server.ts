import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) redirect(303, '/login');

	const { orderId } = params;

	const { data: order, error: errOrder } = await locals.supabase
		.from('orders')
		.select(
			`
      id,
      order_id,
      total_amount,
      currency,
      status,
      payment_type,
      transaction_id,
      redirect_url,
      created_at,
      updated_at,
      addresses (
        id,
        recipient,
        phone,
        full_address,
        province,
        city,
        district,
        village,
        postal_code
      )
    `
		)
		.eq('order_id', orderId)
		.single();

	if (!order) throw error(404, 'Pesanan tidak ditemukan');
	if (errOrder) throw error(500, 'Terjadi error saat memuat pesanan');

	const { data: items, error: errItems } = await locals.supabase
		.from('order_items')
		.select(
			`
      id,
      quantity,
      price_at_purchase,
      products (
        id,
        name,
        image_url
      )
    `
		)
		.eq('order_id', order.id);

	if (errItems) throw error(500, 'Gagal memuat barang');

	return { order, items };
};
