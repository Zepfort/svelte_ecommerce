<script lang="ts">
import ProductCard from '$lib/components/ProductCard.svelte';
  import type { PageData } from './$types'
  export let data: PageData
</script>

<section class="w-full mx-0 flex flex-col items-center sm:px-4 md:px-16 lg:px-20 xl:px-24">
  <h1 class="text-2xl font-semibold mb-4">Hasil untuk "{data.q}"</h1>

  {#if data.products?.length > 0}
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {#each data.products as product}
        <ProductCard {product} />
      {/each}
    </div>
  {:else}
    <p class="text-gray-500 italic">Produk tidak ditemukan</p>
  {/if}
</section>
