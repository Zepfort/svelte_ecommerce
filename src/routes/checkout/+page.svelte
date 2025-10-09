<script lang="ts">
  export let data;
  const { items, total } = data;
</script>

<div class="container mx-auto py-8 px-4">
  <h1 class="text-2xl font-bold mb-4">Checkout</h1>

  {#if items.length > 0}
    <div class="space-y-4">
      {#each items as it}
        <div class="flex justify-between">
          <div>
            <p class="font-medium">{it.name}</p>
            <p class="text-sm">Qty: {it.qty}</p>
          </div>
          <p class="font-semibold">Rp {(Number(it.price) * it.qty).toLocaleString('id-ID')}</p>
        </div>
      {/each}

      <div class="border-t pt-4 flex justify-between text-xl font-bold">
        <span>Total</span>
        <span>Rp {total.toLocaleString('id-ID')}</span>
      </div>

      <!-- Form alamat, metode pembayaran, tombol konfirmasi, dsb -->
      <button class="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg">
        Bayar Sekarang
      </button>
    </div>
  {:else}
    <p>Keranjang kosong atau tidak ada item untuk checkout.</p>
  {/if}
</div>
