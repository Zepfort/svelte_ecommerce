<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let {
		error = 'Terjadi kesalahan saat proses pembayaran. Silakan coba lagi atau hubungi layanan pelanggan.'
	} = $props();

	let slug = $page.url.searchParams.get('slug');
	let qty = $page.url.searchParams.get('qty');

	function goToCheckout() {
		if (slug && qty) {
			goto(`/checkout?slug=${encodeURIComponent(slug)}&qty=${encodeURIComponent(qty)}`);
		} else {
			goto('/checkout');
		}
	}

	function contactSupport() {
		window.location.href = 'mailto:support@yourdomain.com';
	}
</script>

<section class="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100">
	<div class="bg-[#FAFAFA]rounded-lg w-full max-w-md p-8 text-center shadow-lg">
		<h1 class="mb-4 text-2xl font-semibold text-red-600">Maaf, terjadi Gangguan Teknis.</h1>
		<p class="mb-6 text-gray-700">{error}</p>
		<div class="flex flex-col gap-4 space-x-4">
			<button
				class="w-full rounded bg-[#0443F2] px-6 py-2 text-white transition hover:bg-[#0433C2]"
				onclick={goToCheckout}
			>
				Kembali ke Checkout
			</button>
			<button
				class="rounded border border-[#0443F2] px-6 py-2 text-[#0433C2] transition hover:bg-blue-50"
				onclick={contactSupport}
			>
				Hubungi Layanan Pelanggan
			</button>
		</div>
	</div>
</section>

<style>
</style>
