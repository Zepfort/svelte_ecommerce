<script lang="ts">
  import Icon from '@iconify/svelte';
  import { invalidate } from '$app/navigation';

  export let data: import('./$types').PageData;

  // gunakan state untuk form
  let status = data.order.status;
  let fraudStatus = data.order.fraud_status ?? '';

  let isProcessing = false;
  let feedbackMessage = '';
  let feedbackIsError = false;
  let showFeedback = false;

  async function submitStatusChange() {
    isProcessing = true;
    const form = new FormData();
    form.set('order_id', data.order.id);
    form.set('status', status);
    form.set('fraud_status', fraudStatus);

    const res = await fetch('?updateStatus', {
      method: 'POST',
      body: form
    });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      feedbackMessage = text || 'Gagal memperbarui status';
      feedbackIsError = true;
    } else {
      feedbackMessage = 'Status berhasil diperbarui';
      feedbackIsError = false;
      // reload data
      await invalidate(`/admin/orders/${data.order.id}`);
    }
    showFeedback = true;
    isProcessing = false;
  }

  async function handleVoid() {
    const confirmed = confirm('Apakah Anda yakin ingin membatalkan (void) pesanan ini?');
    if (!confirmed) return;

    isProcessing = true;
    const form = new FormData();
    form.set('order_id', data.order.id);

    const res = await fetch('?void', {
      method: 'POST',
      body: form
    });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      feedbackMessage = text || 'Gagal void order';
      feedbackIsError = true;
    } else {
      feedbackMessage = 'Order berhasil dibatalkan (void).';
      feedbackIsError = false;
      await invalidate(`/admin/orders/${data.order.id}`);
    }
    showFeedback = true;
    isProcessing = false;
  }

  const statusBadge = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border border-rose-200';
      case 'void': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };
</script>

<section class="py-12 space-y-6">
  <h1 class="text-2xl font-bold">Detail Order #{data.order.order_id}</h1>

  <div class="bg-white shadow rounded p-4 space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p><strong>User ID:</strong> <span class="text-gray-600">{data.order.user_id}</span></p>
        <p><strong>Waktu dibuat:</strong> <span class="text-gray-600">{new Date(data.order.created_at).toLocaleString()}</span></p>
        <p>
          <strong>Status:</strong>
          <span class={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusBadge(data.order.status)}`}>
            <Icon icon="mdi:checkbox-blank-circle" width="10" height="10" />
            <span class="capitalize">{data.order.status}</span>
          </span>
        </p>
        {#if data.order.fraud_status}
          <p><strong>Fraud Status:</strong> <span class="text-gray-600">{data.order.fraud_status}</span></p>
        {/if}
        <p><strong>Payment:</strong> <span class="text-gray-600">{data.order.payment_type} — {data.order.transaction_id}</span></p>
      </div>

      <div>
        <p><strong>Total:</strong> Rp{Number(data.order.total_amount).toLocaleString('id-ID')}</p>
        <p><strong>Jumlah Item:</strong> {data.order.item_count}</p>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-semibold mb-2">Item Pesanan</h2>
      <ul class="divide-y divide-gray-300">
        {#each data.order.items as item}
          <li class="py-2 flex gap-4 items-center">
            <div class="w-16 h-16 overflow-hidden rounded border">
              {#if item.image_url}
                <img src={item.image_url} alt={item.name} class="w-full h-full object-cover" />
              {/if}
            </div>
            <div>
              <p class="font-medium">{item.name}</p>
              <p>Kuantitas: {item.quantity}</p>
              <p>Harga satuan: Rp{item.price.toLocaleString('id-ID')}</p>
              <p>Subtotal: Rp{(item.price * item.quantity).toLocaleString('id-ID')}</p>
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <div class="mt-4 space-y-2 max-w-xs">
      <label class="block">
        <span class="font-medium">Ubah Status</span>
        <select bind:value={status} class="mt-1 block w-full border rounded px-3 py-2">
          <option value="pending">pending</option>
          <option value="paid">paid</option>
          <option value="shipped">shipped</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
          <option value="void">void</option>
        </select>
      </label>

      <label class="block">
        <span class="font-medium">Fraud Status (opsional)</span>
        <input type="text" bind:value={fraudStatus} class="mt-1 block w-full border rounded px-3 py-2" placeholder="fraud status" />
      </label>

      <div class="flex gap-3 mt-12">
        <button on:click={submitStatusChange} class="bg-[#0443F2] text-gray-200 px-4 py-2 rounded-sm hover:bg-[#0443C2]" disabled={isProcessing}>
          {#if isProcessing}
            <span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          {/if}
          Simpan Status
        </button>

        <button on:click={handleVoid} class="bg-rose-500 text-white px-4 py-2 rounded hover:bg-red-700" disabled={isProcessing}>
          Batalkan (Void)
        </button>
      </div>

      {#if showFeedback}
        <div class={`mt-2 p-2 rounded ${feedbackIsError ? 'bg-rose-100 text-rose-800' : 'bg-green-100 text-green-800'}`}>
          {feedbackMessage}
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  /* Styling tambahan jika perlu */
</style>
