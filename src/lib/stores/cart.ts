// src/lib/stores/cart.ts
import { writable } from 'svelte/store';
import { derived } from 'svelte/store';

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  qty: number;
  slug: string;
  image_url: string;
  // properti lain
};

export const cart = writable<CartItem[]>([]);

export const total = derived(
  cart,
  ($cart) => $cart.reduce((sum, item) => sum + item.price * item.qty, 0)
);


export async function loadCart() {
  const res = await fetch('/api/cart');
  if (res.ok) {
    const j = await res.json();
    cart.set(j.items);
  } else {
    console.error('Failed to load cart', await res.text());
  }
}

export async function addToCart(product: { id: string; slug: string; name: string; price: number; image_url: string }, qty: number) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: product.id,
      qty,
      // optional: you might send slug, name, image_url, but API backend can lookup
    })
  });
  if (!res.ok) {
    console.error('Failed to add to cart', await res.text());
  }
  await loadCart();
}

export async function updateCartItem(itemId: string, qty: number) {
  const res = await fetch(`/api/cart/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty })
  });
  if (!res.ok) {
    console.error('Failed to update cart item', await res.text());
  }
  await loadCart();
}

export async function removeCartItem(itemId: string) {
  const res = await fetch(`/api/cart/${itemId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    console.error('Failed to remove cart item', await res.text());
  }
  await loadCart();
}
