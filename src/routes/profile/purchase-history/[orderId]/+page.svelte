<script lang="ts">
  import type { PageData } from '../[orderId]/$types';
  import { formatCurrency, formatDate } from '$lib/utils/format';
  import Icon from '@iconify/svelte';

  let { data }: { data: PageData } = $props();
  const { order, items } = data;
</script>

<svelte:head>
  <title>Order #{order.order_id}</title>
</svelte:head>

<section class="mx-auto min-h-screen w-full px-4 py-6 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-4xl">
  <!-- Header -->
  <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
    <h1 class="text-xl sm:text-2xl font-semibold">Detail Pesanan</h1>
    <span
      class="rounded-full px-3 py-1 text-sm font-medium
        {order.status === 'settlement' || order.status === 'paid'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-amber-100 text-amber-700'}"
    >
      {order.status}
    </span>
  </div>

  <!-- Ringkasan Pesanan -->
  <section class="mb-6 rounded-sm border bg-white p-4 shadow-sm">
    <p class="mb-1 text-sm text-zinc-500">Order #{order.order_id}</p>
    <p class="text-sm text-zinc-500">{formatDate(order.created_at)}</p>
    <p class="mt-2 text-lg font-semibold">
      Total: {formatCurrency(order.total_amount, order.currency)}
    </p>
  </section>

  <!-- Daftar Barang -->
  <section class="mb-6 rounded-sm border bg-white p-4 shadow-sm">
    <h2 class="mb-3 text-lg font-semibold">Barang</h2>
    <div class="space-y-4">
      {#each items as it}
        <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start border-b pb-3 last:border-b-0">
          <img
            src={it.products.image_url || '/placeholder.png'}
            alt=""
            class="h-24 w-24 sm:h-28 sm:w-28 rounded-md object-cover flex-shrink-0"
          />
          <div class="flex-1">
            <p class="font-medium">{it.products.name}</p>
            <p class="text-sm text-zinc-600">
              {it.quantity} × {formatCurrency(it.price_at_purchase, order.currency)}
            </p>
          </div>
          <p class="mt-2 sm:mt-0 font-semibold">
            {formatCurrency(it.quantity * it.price_at_purchase, order.currency)}
          </p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Alamat Pengiriman -->
  <section class="rounded-sm border bg-white p-4 shadow-sm">
    <h2 class="mb-3 text-lg font-semibold">Alamat Pengiriman</h2>
    {#if order.addresses}
      <div class="space-y-1">
        <p class="font-medium">Penerima: {order.addresses.recipient}</p>
        <p class="text-sm text-zinc-600">Telepon: {order.addresses.phone}</p>
        <p class="text-sm text-zinc-600">
          Alamat: {order.addresses.full_address}<br />
          {order.addresses.postal_code}
        </p>
      </div>
      {#if order.status === 'settlement' || order.status === 'paid'}
        <p class="mt-3 text-sm text-green-700">
          Barang Anda sedang dikirimkan. Mohon tunggu hingga sampai. Terima kasih 😊
        </p>
      {:else}
        <div class="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p class="font-semibold">Menunggu Pembayaran</p>
          <p class="mt-1 text-sm">
            Silakan selesaikan pembayaran dalam waktu <span class="font-medium">2 jam</span>. <br />
            Jika sudah membayar, status akan otomatis berubah dalam ±5 menit.
          </p>
          <div class="mt-3">
            <a
              href={order.redirect_url}
              class="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-gray-200 hover:bg-amber-700"
            >
              Lanjutkan Pembayaran
            </a>
          </div>
        </div>
      {/if}
    {:else}
      <p class="text-sm text-zinc-500">Alamat tidak tersedia.</p>
    {/if}
  </section>

  <!-- Tombol Kembali -->
  <div class="mt-6">
    <a
      href="/profile/purchase-history"
      class="inline-flex items-center gap-2 rounded-md bg-[#0443F2] px-4 py-2 text-gray-200 hover:bg-[#0433C2]"
    >
      <Icon
        icon="pajamas:go-back"
        width="20"
        height="20"
        inline={true}
        class="text-gray-200"
      />
      <span class="text-sm font-medium">Kembali</span>
    </a>
  </div>
</section>