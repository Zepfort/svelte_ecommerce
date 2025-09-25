<script lang="ts">
    import type { Product } from "$lib/data/products";

    let { product } : { product: Product} = $props()
</script>

<div class="flex flex-row items-center container px-32 mx-auto">
    <div class="w1/3">
        <img src='' alt='' class="w-full h-max-[120px] h-min-[120px} object-cover rounded-lg mb-4" />
    </div>
    <div class="w1/3">
        <h1 class="text-2xl font-bold mb-2">
            {product.name}
        </h1>
        <p class="text-lg font-normal mb-2">
            {product.description}
        </p>
    </div>
    <div class="w1/3">
        <h1>ya begitulah</h1>
    </div>
</div>