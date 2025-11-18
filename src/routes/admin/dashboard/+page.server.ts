// src/routes/(app)/admin/dashboard/+page.server.ts
import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer'; // sesuaikan path-nya
import type { RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
  const sb = createSupabaseServerClient(event); // <-- pakai helper-mu

  const [
    { data: revenue,   error: e1 },
    { data: orders,    error: e2 },
    { data: customers, error: e3 },
    { data: products,  error: e4 },
    { data: recent,    error: e5 },
    { data: chart,     error: e6 }
  ] = await Promise.all([
    sb.rpc('revenue_this_month'),
    sb.rpc('order_count_this_month'),
    sb.rpc('customer_count'),
    sb.rpc('product_count'),
    sb.rpc('recent_orders', {  limit_count: 5}),
    sb.rpc('sales_chart', { days: 7 }),
  ]);

  if (e1 || e2 || e3 || e4 || e5 || e6) {
    console.error({ e1, e2, e3, e4, e5, e6 });
    throw error(500, 'Gagal memuat metrik dashboard');
  }

  return {
    revenue:   Number(revenue   ?? 0),
    orders:    Number(orders    ?? 0),
    customers: Number(customers ?? 0),
    products:  Number(products  ?? 0),
    recent:    recent ?? [],
    chart
  };
}