<script lang="ts">
  import type { PageData } from './$types';
  import { formatCurrency, formatDate } from '$lib/utils/format';
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';

  let { data }: { data: PageData } = $props();

    function goBack() {
    history.back();
    goto('/profile');
  }
</script>

<svelte:head>
  <title>Riwayat Pembelian</title>
</svelte:head>

<section class="min-h-screen w-full px-4 md:px-8 lg:px-12 pt-[1660px] md:pt-0 bg-gray-950 sm:bg-gray-100" style="scroll-margin-top: 5rem">
  <div class="mb-4">
  <button
    onclick={goBack}
    class="flex items-center gap-2 text-gray-700 hover:text-gray-900"
  >
    <Icon icon="mdi:arrow-left" width="20" height="20" class="text-gray-200"/>
    <span class="text-sm font-medium text-gray-200 sm:hidden">Kembali</span>
  </button>
</div>
  {#if !data.orders?.length}
    <p class="text-sm text-zinc-500">Belum ada pesanan.</p>
  {:else}
  <h1 class="md:pl-72 mb-6 text-xl sm:text-2xl font-semibold text-blue-50 sm:text-blue-900">Riwayat Pembelian</h1>
    <div class="md:pl-72 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
      {#each data.orders as order (order.id)}
        <a
          href={`/profile/purchase-history/${order.order_id}`}
          class="block rounded-xl border bg-gray-50 p-4 shadow-sm transition hover:shadow-md flex flex-col"
        >
          <div class="mb-2 flex items-center justify-between">
            <span class="text-xs font-medium text-zinc-500">
              {formatDate(order.created_at)}
            </span>
            <span
              class="rounded-full px-2 py-0.5 text-xs font-medium
                {order.status === 'settlement' || order.status === 'paid'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'}"
            >
              {order.status}
            </span>
          </div>

          <p class="mb-1 text-sm text-zinc-600">Order #{order.order_id}</p>

          <div class="flex justify-center my-2 flex-shrink-0">
            {#if order.order_items?.[0]?.products}
              <img
                src={order.order_items[0].products.image_url || '/placeholder.png'}
                alt=""
                class="h-24 w-24 sm:h-32 sm:w-32 rounded-sm object-cover"
              />
            {/if}
          </div>

          <div class="mt-auto flex items-end justify-between">
            <p class="text-sm text-zinc-600">
              {order.order_items.length} jenis barang
            </p>
            <p class="font-semibold">
              {formatCurrency(order.total_amount, order.currency)}
            </p>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</section>