<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Product {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        rating: number;
        sold: number;
    }

    let { product }: {product: Product} = $props()
</script>

<a href={`/product/${product.id}`} class="product-card my-2">
    <div class="card-image-container">
        <img src={product.imageUrl} alt={product.name} class="card-image"/>
    </div>
    <div class="p-2">
        <h3 class="font-light text-lg m=0">{product.name}</h3>
        <p class="card-price">Rp{product.price}</p>
        <div class="flex py-0.5 pl-0 items-center"> 
            <Icon icon="meteocons:star-fill" width="28" height="28" />
            <p class="text-base">{product.rating}</p>
            <Icon icon="mdi:dot" width="16" height="16" />
            <p class="text-base">{product.sold} terjual</p>
        </div>
    </div>
</a>

<style>
    .product-card {
        border: 1px solid #ccc;
        width: 200px;
        height: 300px;
        border-radius: 8px;
        overflow: hidden;
        transition: box-shadow 0.2 ease;
        text-decoration: none;
        color: inherit;
    }

    .product-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card-price {
        font-size: 1.125rem;
        color: #555;
        font-weight: 700;
    }

    .card-image-container {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        position: relative;
        overflow: hidden;
    }

    .card-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
</style>