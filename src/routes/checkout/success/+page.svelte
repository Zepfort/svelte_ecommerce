<!-- src/routes/checkout/success/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';

  // props masuk lemah-lembut via runes
  let { data }: { data: PageData } = $props();

  // alias supaya template bersih
  const { orderId, items, total, paidAt, paymentType } = $derived(data);
</script>

<svelte:head>
  <title>Pembelian Berhasil</title>
</svelte:head>

<section class="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
  <div class="max-w-xl w-full bg-white rounded-lg shadow p-6">
    <h1 class="text-2xl font-bold text-green-600 mb-2">Pembelian Berhasil 🎉</h1>

    <div class="text-sm text-gray-700 mb-4 space-y-1">
      <p>Nomor Order: <strong>{orderId}</strong></p>
      <p>Waktu Bayar: <strong>{paidAt}</strong></p>
      <p>Metode: <strong>{paymentType}</strong></p>
    </div>

    <div class="border-t pt-4">
      {#each items as it}
        <div class="flex justify-between py-2 text-sm">
          <span class="flex-1">{it.name}</span>
          <span class="px-2">×{it.qty}</span>
          <span class="font-medium">Rp{it.price.toLocaleString('id-ID')}</span>
        </div>
      {/each}
    </div>

    <div class="border-t pt-4 mt-4 flex justify-between text-lg font-bold">
      <span>Total</span>
      <span class="text-blue-600">Rp{total.toLocaleString('id-ID')}</span>
    </div>

    <button
      onclick={() => goto('/')}
      class="w-full mt-6 px-4 py-2 bg-[#0443F2] text-gray-200 rounded-sm hover:bg-[#0433C2]">
      Kembali ke Beranda
    </button>
  </div>
</section>