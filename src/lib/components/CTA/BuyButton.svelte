<script lang="ts">
  import { goto } from '$app/navigation';
  import { cart, addToCart, loadCart, updateCartItem } from '$lib/stores/cart';
  import type { Product } from '$lib/types/product';

  let { product, qty = $bindable(1) }: { product: Product, qty: number } = $props();

  let itemId: string | null = null;
  
  cart.subscribe((items) => {
    const it = items.find(i => i.product_id === product.id);
    itemId = it?.id ?? null;
  });

  async function handleBuyNow() {
    if (!product) return;
    goto(`/checkout?slug=${product.slug}&qty=${qty}`);
    console.log('qty buy used:', qty);
  }
</script>

<button
  class="flex w-full items-center justify-center border col-background font-semibold py-1.5 rounded-lg cursor-pointer"
  onclick={handleBuyNow}
>
  Beli Langsung
</button>
