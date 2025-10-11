import { writable, derived } from 'svelte/store';

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  qty: number;
  slug: string;
  image_url: string;
};

export const cart = writable<CartItem[]>([]);

export const total = derived(
  cart,
  ($cart) => $cart.reduce((sum, item) => sum + item.price * item.qty, 0)
);

export async function loadCart() {
  const res = await fetch('/api/cart');
  if (!res.ok) {
    console.error('Failed to load cart', await res.text());
    return;
  }
  let j;
  try {
    j = await res.json();
  } catch (e) {
    console.warn('loadCart got no JSON', e);
    return;
  }
  cart.set(j.items ?? []);
}

export async function addToCart(productId: string, qty: number) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, qty })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    console.warn('addToCart got no JSON', e);
  }
  if (data?.items) {
    cart.set(data.items);
  }
  return data;
}

export async function updateCartItem(itemId: string, qty: number) {
  const res = await fetch(`/api/cart/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty })
  });
  if (!res.ok) {
    console.error('updateCartItem failed', await res.text());
  }
  await loadCart();
}

export async function removeCartItem(itemId: string) {
  const res = await fetch(`/api/cart/${itemId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    console.error('removeCartItem failed', await res.text());
  }
  await loadCart();
}
