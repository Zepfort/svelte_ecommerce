<script lang="ts">
  export let category: { name: string; description: string };
  export let products: Array<{ name: string; price: number }>;
</script>

<h1>{category.name}</h1>
<p>{category.description}</p>

<ul>
  {#each products as product}
    <li>{product.name} - Rp{product.price}</li>
  {/each}
</ul>
