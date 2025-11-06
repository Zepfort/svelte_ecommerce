<script lang="ts">
  //<-- gunakan Run Mode
  let { orderId, items, total, paidAt } = $props() as {
    orderId: string;
    items: { name: string; qty: number; price: number }[];
    total: number;
    paidAt: string;
  };
</script>

<div class="max-w-2xl mx-auto mt-10 p-6 bg-[#FAFAFA] border border-[#ebe9e9] rounded-lg text-[#050417]">
  <h1 class="text-3xl font-bold text-[#0443F2] mb-4">🎉 Pembelian Berhasil</h1>
  <p>Nomor Order: <strong>{orderId}</strong></p>
  <p>Waktu Pembayaran: <strong>{paidAt}</strong></p>

  <div class="mt-6">
    {#each items as item}
      <div class="flex justify-between py-2 border-b border-[#ebe9e9]">
        <span class="font-medium">{item.name}</span>
        <span>×{item.qty}</span>
        <span>Rp{item.price.toLocaleString()}</span>
      </div>
    {/each}
  </div>

  <div class="mt-6 flex justify-between text-xl font-bold">
    <span>Total:</span>
    <span class="text-[#0443F2]">Rp{total.toLocaleString()}</span>
  </div>

  <a href="/" class="inline-block mt-8 px-6 py-3 bg-[#0443F2] text-[#FAFAFA] rounded-md hover:bg-[#0433C2]">Kembali ke Beranda</a>
</div>
