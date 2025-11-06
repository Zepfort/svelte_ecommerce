<script lang="ts">
  let { orderId, errorMessage } = $props() as {
    orderId?: string;
    errorMessage?: string;
  };
</script>

<div class="max-w-2xl mx-auto mt-10 p-6 bg-[#FAFAFA] border border-[#ebe9e9] rounded-lg text-[#050417] text-center">
  <h1 class="text-3xl font-bold text-[#F00] mb-4">❌ Pembayaran Gagal</h1>
  {#if orderId}
    <p>Nomor Order: <strong>{orderId}</strong></p>
  {/if}
  {#if errorMessage}
    <p>{errorMessage}</p>
  {:else}
    <p>Maaf, transaksi Anda tidak dapat diproses saat ini.</p>
  {/if}

  <div class="mt-8 space-x-4">
    <a href="/checkout" class="inline-block px-6 py-3 bg-[#0443F2] text-[#FAFAFA] rounded-md hover:bg-[#0433C2]">Coba Lagi</a>
    <a href="/" class="inline-block px-6 py-3 bg-[#0443F2] text-[#FAFAFA] rounded-md hover:bg-[#0433C2]">Kembali ke Beranda</a>
  </div>
</div>
