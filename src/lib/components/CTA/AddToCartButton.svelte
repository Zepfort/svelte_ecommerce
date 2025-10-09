<script lang="ts">
  import { cart, type CartItem } from '$lib/stores/cart';
  import '/src/lib/style/utils.css';
  import type { Product } from '$lib/types/product';

  let { product, qty = 1 }: { product: Product; qty?: number } = $props();
  let loading = $state(false);

  function handleAddToCart() {
    if (!product) return;
    loading = true;

    cart.update((arr: CartItem[]) => {
      const idx = arr.findIndex((it) => it.product_id === product.id);

      if (idx !== -1) {
        // Jika produk sudah ada, tambahkan qty-nya
        const copy = [...arr];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      } else {
        // Jika produk belum ada, tambahkan item baru lengkap sesuai tipe CartItem
        const newItem: CartItem = {
          id: crypto.randomUUID(), // buat id unik lokal
          product_id: product.id,
          name: product.name,
          price: product.price,
          qty,
          slug: product.slug,
          image_url: product.image_url
        };
        return [...arr, newItem];
      }
    });

    loading = false;
  }
</script>

<button
  onclick={handleAddToCart}
  class="flex items-center justify-center gap-2 rounded-md py-1.5 px-12 col-bg-primary disabled:opacity-50 cursor-pointer"
  disabled={loading}
>
  {#if loading}
    Loading...
  {:else}
    +Keranjang
  {/if}
</button>
