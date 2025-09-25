<script>
	import { products } from '$lib/data/products';
	import ProductCard from '../ProductCard.svelte';
	import HeroSection from '../HeroSection.svelte';
</script>

<div class="flex flex-col items-center container px-32 mx-auto">
    <div class="">
        <HeroSection />
    </div>
    <div class="flex w-full py-2 pl-2">
		<h1 class="text-2xl font-bold text-gray-950">For You</h1>
	</div>
	<div class="product-list grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
		{#each products as product}
			<ProductCard {product} />
		{/each}
	</div>
</div>

<style>
	.product-list {
		padding: 0.5rem;
	}

    .line {

    }
</style>
