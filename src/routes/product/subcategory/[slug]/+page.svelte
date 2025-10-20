<script lang="ts">
  export let subcategory: { name: string; description: string };
  export let products: Array<{ name: string; price: number }>;
</script>

<h1>{subcategory.name}</h1>
<p>{subcategory.description}</p>

<ul>
  {#each products as product}
    <li>{product.name} - Rp{product.price}</li>
  {/each}
</ul>
