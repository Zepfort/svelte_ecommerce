// src/routes/admin/orders/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const user = event.locals.session?.user ?? event.locals.user ?? null;
  const isAdmin = Boolean(event.locals.userIsAdmin);

  if (!isAdmin) {
    if (!user) throw error(303, '/');
    const { data: profile, error: profileErr } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (profileErr || !profile || (profile.role ?? '').toLowerCase() !== 'admin') {
      throw error(303, '/');
    }
  }

  const orderId = event.params.orderId;
  const { data: orderRaw, error: orderErr } = await supabase
    .from('orders')
    .select(`
      id,
      order_id,
      user_id,
      total_amount,
      status,
      fraud_status,
      payment_type,
      transaction_id,
      created_at,
      order_items (
        product_id,
        quantity,
        products ( id, name, image_url, price )
      )
    `)
    .eq('id', orderId)
    .maybeSingle();

  if (orderErr) {
    console.error('Error fetching order detail:', orderErr);
    throw error(500, 'Gagal memuat detail order');
  }
  if (!orderRaw) {
    throw error(404, 'Order tidak ditemukan');
  }

  const items = (orderRaw.order_items ?? []).map((it: any) => ({
    product_id: it.product_id,
    quantity: Number(it.quantity),
    name: it.products?.name,
    image_url: it.products?.image_url,
    price: Number(it.products?.price)
  }));
  const item_count = items.reduce((sum, it) => sum + it.quantity, 0);

  return {
    order: {
      id: orderRaw.id,
      order_id: orderRaw.order_id,
      user_id: orderRaw.user_id,
      total_amount: Number(orderRaw.total_amount),
      status: orderRaw.status,
      fraud_status: orderRaw.fraud_status,
      payment_type: orderRaw.payment_type,
      transaction_id: orderRaw.transaction_id,
      created_at: orderRaw.created_at,
      items,
      item_count
    }
  };
};

export const actions: Actions = {
  updateStatus: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const form = await event.request.formData();
    const orderId = form.get('order_id') as string;
    const newStatus = form.get('status') as string;
    const fraudStatus = (form.get('fraud_status') as string) ?? null;

    // validasi admin (sama seperti load)
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

    return { status: 'ok' };
  },

  void: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const form = await event.request.formData();
    const orderId = form.get('order_id') as string;

    // validasi admin
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
      .update({ status: 'void' })
      .eq('id', orderId);

    if (updateErr) {
      console.error('Error void order:', updateErr);
      throw error(500, 'Gagal membatalkan order');
    }
    const { error: rpcErr } = await supabase.rpc('restore_stock_on_cancel', {
      order_uuid: orderId
    });
    if (rpcErr) {
      console.error('Error restore stock:', rpcErr);
    }

    return { voided: true };
  }
};
