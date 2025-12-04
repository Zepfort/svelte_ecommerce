<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	interface Props {
		data: {
			subcategory?: {
				name?: string;
				description: string;
			};
			products?: Array<{
				id: string;
				name: string;
				price: number;
				slug: string;
				image_url: string;
				rating?: number;
				sold?: number;
			}>;
		};
	}

	let { data }: Props = $props();
</script>

<section class="flex w-full flex-col items-center">
	<div class="flex w-full flex-col items-center sm:px-4 md:container md:px-16 lg:px-20 xl:px-24">
		<h1 class="mb-2 text-2xl font-bold">{data.subcategory?.name}</h1>
		<p class="mb-6 text-gray-600">{data.subcategory?.description}</p>

		{#if data.products?.length}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
				{#each data.products as product}
					<ProductCard {product} />
				{/each}
			</div>
		{:else}
			<p class="text-gray-500 italic">Belum ada produk di subkategori ini.</p>
		{/if}
	</div>
</section>
