<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cart, total, type CartItem } from '$lib/stores/cart';
  import { updateCartItem, removeCartItem } from '$lib/stores/cart';

  let open = $state(false);
  let items = $state<CartItem[]>([]);
  let totalValue = $state(0);

  cart.subscribe((v) => (items = v));
  total.subscribe((v) => (totalValue = v));

async function inc(id: string) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const newQty = item.qty + 1;
  await updateCartItem(id, newQty); // API call ke Supabase
}

async function dec(id: string) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  if (item.qty > 1) {
    const newQty = item.qty - 1;
    await updateCartItem(id, newQty);
  } else {
    await removeCartItem(id);
  }
}

async function delItem(id: string) {
  await removeCartItem(id);
}

</script>

<div class="relative">
  <button onclick={() => (open = !open)} class="flex items-center gap-2 rounded-sm bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700">
    <Icon icon="icon-park-outline:shopping" width="24" height="24" />
    <span class="text-sm font-semibold">{items.length}</span>
  </button>

  {#if open}
    <div class="absolute right-0 z-50 mt-2 w-[25rem] rounded-sm border bg-white p-4 shadow-xl">
      {#if items.length === 0}
        <p class="text-center text-gray-500">Keranjang kosong</p>
      {:else}
        <ul class="max-h-96 overflow-auto space-y-3">
          {#each items as it}
            <li class="flex items-center justify-between">
              <div>
                <p class="font-medium">{it.name}</p>
                <p class="text-sm text-gray-500">Rp Rp {(it.price ?? 0).toLocaleString('id-ID')}</p>
              </div>
              <div class="flex items-center gap-2">
                <button onclick={() => dec(it.id)} class="h-7 w-7 bg-gray-200 rounded hover:bg-gray-300">-</button>
                <span class="w-6 text-center">{it.qty}</span>
                <button onclick={() => inc(it.id)} class="h-7 w-7 bg-gray-200 rounded hover:bg-gray-300">+</button>
                <button onclick={() => delItem(it.id)} class="ml-2 py-1 px-3 text-sm rounded-sm bg-red-500 text-white hover:bg-red-700 duration-150">Hapus</button>
              </div>
            </li>
          {/each}
        </ul>

        <div class="mt-4 border-t pt-3 text-right">
          <div class="flex justify-between py-4">
            <p class="text-lg font-medium">Subtotal</p>
            <p class="text-lg font-bold">Rp {(items.reduce((acc, it) => acc + ((it?.price ?? 0) * (it?.qty ?? 0)), 0)).toLocaleString('id-ID')}</p>
          </div>
          <button 
          class="flex justify-center w-full text-center text-pmb px-4 py-2 rounded-sm"
          >
            Pembayaran
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .text-pmb {
    background-color: #0443F2;
    color: #FFFFFF;
    transition: ease-in-out 0.2;
  }

  .text-pmb:hover {
    background-color: #0433C2;
  }
</style>
