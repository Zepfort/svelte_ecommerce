<script lang="ts">
  import { goto } from '$app/navigation';
  import { selectedQuantity } from '$lib/stores/selectedQuantity';
  import { addToCart, loadCart } from '$lib/stores/cart';
  import type { Product } from '$lib/types/product';

  let { product }: { product: Product } = $props();
  let qty = $state(1);

  const unsubscribe = selectedQuantity.subscribe((v) => {
    qty = v;
  });

  async function handleBuyNow() {
    // Pastikan produk ini ada di cart (server side) agar checkout nanti konsisten
    try {
      await addToCart(product, qty);
      await loadCart();
    } catch (err) {
      console.error('Error adding for buy now:', err);
    }
    // kemudian navigasi ke checkout dengan param
    goto(`/checkout?slug=${product.slug}&qty=${qty}`);
  }

  import { onDestroy } from 'svelte';
  onDestroy(() => {
    unsubscribe();
  });
</script>

<button
  class="flex w-full items-center justify-center border col-background font-semibold py-1.5 rounded-lg cursor-pointer"
  onclick={handleBuyNow}
>
  Beli Langsung
</button>
