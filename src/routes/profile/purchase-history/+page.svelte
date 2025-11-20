<script lang="ts">
  import type { PageData } from './$types';
  import { formatCurrency, formatDate } from '$lib/utils/format'; // helper buatan kamu

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Riwayat Pembelian</title>
</svelte:head>

<section class="h-screen w-full px-4 py-8 pl-72">
  <h1 class="mb-6 text-2xl font-semibold text-blue-900">Riwayat Pembelian</h1>

  {#if !data.orders?.length}
    <p class="text-sm text-zinc-500">Belum ada pesanan.</p>
  {:else}
    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {#each data.orders as order (order.id)}
        <a
          href={`/profile/purchase-history/${order.order_id}`}
          class="block rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div class="mb-2 flex items-center justify-between">
            <span class="text-xs font-medium text-zinc-500">
              {formatDate(order.created_at)}
            </span>
            <span
              class="rounded-full px-2 py-0.5 text-xs font-medium
              {order.status === 'settlement' || order.status === 'paid'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
                }"
            >
              {order.status}
            </span>
          </div>

          <p class="mb-1 text-sm text-zinc-600">Order #{order.order_id}</p>
          <div class="my-2 flex items-center justify-center">
              <!-- thumbnail produk pertama saja -->
              {#if order.order_items?.[0]?.products}
                <img
                  src={order.order_items[0].products.image_url || '/placeholder.png'}
                  alt=""
                  class=" mb-3 h-32 w-32 rounded-sm object-cover"
                />
              {/if}
          </div>

          <div class="flex items-end justify-between">
            <p class="text-sm text-zinc-600">
              {order.order_items.length} barang
            </p>
            <p class="font-semibold">
              {formatCurrency(order.total_amount, order.currency)}
            </p>
          </div>
        </a>
      {/each}
    </section>
  {/if}
</section>