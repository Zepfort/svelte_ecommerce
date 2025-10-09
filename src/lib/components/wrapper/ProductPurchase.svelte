<script lang="ts">
  import AddToCartButton from "../CTA/AddToCartButton.svelte";
  import BuyButton from "../CTA/BuyButton.svelte";
  import Quantity from "../CTA/Quantity.svelte";
  import type { Product } from '$lib/types/product';
  import { cart, updateCartItem, addToCart, loadCart } from '$lib/stores/cart';

  // quantity sekarang optional
  let { product, quantity = $bindable(1) }: { product: Product; quantity?: number } = $props();
  let qty = $state(quantity);
  let cartItemId: string | null = null;

  cart.subscribe((items) => {
    const it = items.find((it) => it.product_id === product.id);
    if (it) {
      cartItemId = it.id;
      quantity = it.qty;
    } else {
      cartItemId = null;
    }
  });

  function handleQtyChange(event: CustomEvent<{ qty: number }>) {
    const newQty = event.detail.qty;
    quantity = newQty;
    if (cartItemId) {
      updateCartItem(cartItemId, newQty);
    }
  }

  let subtotal = $derived(product ? product.price * quantity : 0);
</script>

{#if product}
<div class="flex flex-col gap-2 min-w-[16rem]">
  <div class="flex flex-row items-center py-0.5 gap-6">
    <Quantity {product} quantity={quantity} on:change={handleQtyChange} />
    <p class="text-lg font-normal text-gray-700">
      Stok: <span class="text-lg font-semibold text-gray-950">{product.stock}</span>
    </p>
  </div>

  <p class="text-lg font-normal text-gray-700 py-0.5">
    Subtotal:
    <span class="text-2xl font-semibold text-gray-950">
      Rp{subtotal.toLocaleString('id-ID')}
    </span>
  </p>

  <AddToCartButton {product} qty={quantity} />
  <BuyButton {product} />
</div>
{:else}
<p class="text-gray-500">Memuat produk...</p>
{/if}
