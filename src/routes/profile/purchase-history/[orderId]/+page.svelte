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

<section class="mx-auto max-w-4xl pt-16 pb-8 h-screen w-full pl-72">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Detail Pesanan</h1>
    <span
      class="rounded-full px-3 py-1 text-sm font-medium
      {order.status === 'settlement' || order.status === 'paid'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-amber-100 text-amber-700'}"
    >
      {order.status}
    </span>
  </div>

  <!-- Ringkasannya -->
  <section class="mb-6 rounded-sm border bg-white p-4 shadow-sm">
    <p class="mb-1 text-sm text-zinc-500">Order #{order.order_id}</p>
    <p class="text-sm text-zinc-500">{formatDate(order.created_at)}</p>
    <p class="mt-2 text-lg font-semibold">
      Total: {formatCurrency(order.total_amount, order.currency)}
    </p>
  </section>

  <!-- Daftar barang -->
  <section class="mb-6 rounded-sm border bg-white p-4 shadow-sm">
    <h2 class="mb-3 text-lg font-semibold">Barang</h2>
    {#each items as it}
      <div class="flex gap-4 border-b py-3 last:border-0">
        <img
          src={it.products.image_url || '/placeholder.png'}
          alt=""
          class="h-28 w-28 rounded-md object-cover"
        />
        <div class="flex-1">
          <p class="font-medium">{it.products.name}</p>
          <p class="text-sm text-zinc-600">
            {it.quantity} × {formatCurrency(it.price_at_purchase)}
          </p>
        </div>
        <p class="font-semibold">
          {formatCurrency(it.quantity * it.price_at_purchase)}
        </p>
      </div>
    {/each}
  </section>

  <!-- Alamat pengiriman -->
  <section class="rounded-sm border bg-white p-4 shadow-sm">
    <h2 class="mb-3 text-lg font-semibold">Alamat Pengiriman</h2>
    {#if order.addresses}
      <p class="font-medium">Penerima: {order.addresses.recipient}</p>
      <p class="text-sm text-zinc-600">Nomor Telepon: {order.addresses.phone}</p>
      <p class="text-sm text-zinc-600">
        Alamat: 
        {order.addresses.full_address}<br />
        {order.addresses.postal_code}
      </p>
      {#if order.status === 'settlement' || order.status === 'paid'}
      <p class="text-md text-green-700 my-2">
        Barang Anda sedang dikirimkan, Mohon tunggu barang Anda hingga sampai. Terimakasih😁
      </p>
      {:else}
      <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 mt-2">
    <p class="font-semibold">Menunggu Pembayaran</p>
    <p class="mt-1 text-sm">
      Silakan selesaikan pembayaran dalam waktu <span class="font-medium">2 jam</span>.
      Jika sudah membayar, status akan otomatis berubah dalam ±5 menit.
    </p>
    <div class="mt-3">
      <a
        href={order.redirect_url}
        class="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 cursor-pointer"
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

  <!-- Tombol kembali -->
  <div class="mt-6">
    <a
      href="/profile/purchase-history"
      class="inline-flex items-center gap-2 rounded-md bg-[#0443F2] px-4 py-2 text-gray-200 hover:bg-[#0443C2]"
    >
    <Icon
					icon="pajamas:go-back"
					width="20"
					height="20"
					inline={true}
					class="mr-0 align-middle inline-flex text-gray-200"
				/>
        Kembali
    </a>
  </div>
</section>