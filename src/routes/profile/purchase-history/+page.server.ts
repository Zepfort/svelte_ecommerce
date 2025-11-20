// src/routes/profile/purchase-history/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) redirect(303, '/login');

  const { data: orders, error: err } = await locals.supabase
    .from('orders')
    .select(`
      id,
      order_id,
      total_amount,
      currency,
      status,
      payment_type,
      created_at,
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          id,
          name,
          image_url
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (err) throw error(500, 'Gagal memuat riwayat: ' + err.message);
  return { orders };
};