<script lang="ts">
	import { goto } from "$app/navigation";
  import { page } from '$app/stores';

  let { orderId, errorMessage } = $props() as {
    orderId?: string;
    errorMessage?: string;
  };

  let slug = $page.url.searchParams.get('slug');
  let qty = $page.url.searchParams.get('qty');

  function goToCheckout(){
     if (slug && qty) {
      goto(`/checkout?slug=${encodeURIComponent(slug)}&qty=${encodeURIComponent(qty)}`);
    } else {
      goto('/checkout');
    }
  }

  function contactSupport(){
    goto('/')
  }

</script>

<section class="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
  <div class="max-w-md w-full bg-[#FAFAFA] rounded-lg shadow-lg p-8 text-center">
    <h1 class="text-2xl font-semibold text-red-700 mb-4">Pembayaran Gagal</h1>
    <div class="my-4">
      {#if orderId}
      <p>Nomor Order: <strong>{orderId}</strong></p>
    {/if}
    {#if errorMessage}
      <p>{errorMessage}</p>
    {:else}
      <p>Pembayaran ditolak. Periksa kembali data kartu atau gunakan metode lain.</p>
    {/if}
    </div>
    <div class="flex flex-col gap-4 space-x-4">
      <button 
        class="px-6 py-2 w-full bg-[#0443F2] text-white rounded hover:bg-[#0433C2] transition"
        onclick={goToCheckout}
      >
        Kembali ke Checkout
      </button>
      <button 
        class="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
        onclick={contactSupport}
      >
        Hubungi Layanan Pelanggan
      </button>
    </div>
  </div>
</section>
