<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<section class="mx-0 flex w-full flex-col items-center px-4 md:px-16 lg:px-20 xl:px-24">
	<h1 class="my-4 text-xl font-semibold text-blue-900 sm:text-2xl">Hasil untuk "{data.q}"</h1>

	{#if data.products?.length > 0}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
			{#each data.products as product}
				<ProductCard {product} />
			{/each}
		</div>
	{:else}
		<p class="text-gray-500 italic">Produk tidak ditemukan</p>
	{/if}
</section>
