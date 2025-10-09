import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const itemId = event.params.itemId;
  const body = await event.request.json();
  const { qty } = body;

  const { error: err } = await supabase
    .from('cart_items')
    .update({ qty })
    .eq('id', itemId);
  if (err) throw error(500, 'Error updating item');

  return new Response(null, { status: 204 });
};

export const DELETE: RequestHandler = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const itemId = event.params.itemId;

  const { error: err } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);
  if (err) throw error(500, 'Error deleting item');

  return new Response(null, { status: 204 });
};
