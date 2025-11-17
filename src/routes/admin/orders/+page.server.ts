// src/routes/admin/orders/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const user = event.locals.session?.user ?? event.locals.user ?? null;
  let isAdmin = Boolean(event.locals.userIsAdmin);

  if (!isAdmin) {
    if (!user) throw redirect(303, '/');
    const { data: profile, error: profileErr } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileErr || !profile || (profile.role ?? '').toLowerCase() !== 'admin') {
      throw redirect(303, '/');
    }
    isAdmin = true;
  }

  // Ambil orders 
  const { data: ordersRaw, error: ordersErr } = await supabase
    .from('orders')
    .select(`
      id,
      order_id,
      user_id,
      total_amount,
      status,
      payment_type,
      transaction_id,
      fraud_status,
      created_at,
      order_items (
        product_id,
        quantity,
        products ( image_url )
      )
    `)
    .order('created_at', { ascending: false });

  if (ordersErr) {
    console.error('Error fetching orders:', ordersErr);
    throw error(500, 'Gagal memuat order');
  }

  // mapping: ambil image_url dari produk pertama, hitung item_count
  const orders = (ordersRaw ?? []).map((o: any) => {
    const firstItem = Array.isArray(o.order_items) && o.order_items.length > 0 ? o.order_items[0] : null;
    const image_url = firstItem?.products?.image_url ?? null;
    const item_count = Array.isArray(o.order_items)
      ? o.order_items.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 0), 0)
      : 0;

    return {
      id: o.id,
      order_id: o.order_id,
      user_id: o.user_id,
      total_amount: Number(o.total_amount),
      status: o.status,
      payment_type: o.payment_type,
      transaction_id: o.transaction_id,
      fraud_status: o.fraud_status,
      created_at: o.created_at,
      image_url,
      item_count
    };
  });

  return { orders };
};

export const actions: Actions = {
  void: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const form = await event.request.formData();
    const orderId = form.get('order_id') as string;

    // validate admin
    const user = event.locals.session?.user ?? event.locals.user ?? null;
    const isAdmin = Boolean(event.locals.userIsAdmin);
    if (!isAdmin) {
      if (!user) throw error(403, 'Not authorized');
      const { data: profile, error: profileErr } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profileErr || !profile || (profile.role ?? '').toLowerCase() !== 'admin') {
        throw error(403, 'Not authorized');
      }
    }

    // update status to 'void'
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status: 'void' })
      .eq('id', orderId);

    if (updateErr) {
      console.error('Error void order:', updateErr);
      throw error(500, 'Gagal membatalkan order');
    }

    // RPC restore stock
    const { error: rpcErr } = await supabase.rpc('restore_stock_on_cancel', {
      order_uuid: orderId
    });
    if (rpcErr) {
      console.error('Error restore stock:', rpcErr);
    }

    return { success: true };
  },

  updateStatus: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const form = await event.request.formData();
    const orderId = form.get('order_id') as string;
    const newStatus = form.get('status') as string;
    const fraudStatus = (form.get('fraud_status') as string) ?? null;

    // validate admin 
    const user = event.locals.session?.user ?? event.locals.user ?? null;
    const isAdmin = Boolean(event.locals.userIsAdmin);
    if (!isAdmin) {
      if (!user) throw error(403, 'Not authorized');
      const { data: profile, error: profileErr } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profileErr || !profile || (profile.role ?? '').toLowerCase() !== 'admin') {
        throw error(403, 'Not authorized');
      }
    }

    const { error: updateErr } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        fraud_status: fraudStatus
      })
      .eq('id', orderId);

    if (updateErr) {
      console.error('Error updating order status:', updateErr);
      throw error(500, 'Gagal mengubah status order');
    }

    return { success: true };
  }
};
