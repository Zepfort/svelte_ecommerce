<script lang="ts">
  // import { cart, type CartItem } from '$lib/stores/cart';
  import '/src/lib/style/utils.css';
  import { addToCart, loadCart } from '$lib/stores/cart';
  import type { Product } from '$lib/types/product';

  let { product, qty = 1 }: { product: Product; qty?: number } = $props();
  let loading = $state(false);

  async function handleAddToCart() {
    if (!product) return;
    loading = true;
    try {
      await addToCart(product.id, qty);
    } catch (e) {
      console.error('Gagal menambahkan ke keranjang:', e);
    } finally {
      loading = false;
    }
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
