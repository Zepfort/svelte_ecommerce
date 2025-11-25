<script lang="ts">
  import Icon from '@iconify/svelte';
  import { invalidate } from '$app/navigation';
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();

  // State
  let status = $state(data.order.status);
  let isProcessing = $state(false);
  let feedbackMessage = $state('');
  let feedbackIsError = $state(false);
  let showFeedback = $state(false);

  function goBack() {
    history.back();
    // fallback kalau history kosong:
    // goto('/admin/orders');
  }

  async function submitStatusChange(e: SubmitEvent) {
    e.preventDefault();
    isProcessing = true;
    feedbackMessage = '';
    showFeedback = false;

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const res = await fetch('?/updateStatus', {
        method: 'POST',
        body: formData
      });
      const text = await res.text().catch(() => '');
      if (!res.ok) {
        feedbackMessage = text || 'Gagal memperbarui status';
        feedbackIsError = true;
      } else {
        feedbackMessage = 'Status berhasil diperbarui';
        feedbackIsError = false;
        await invalidate(window.location.pathname);
      }
    } catch (err: any) {
      feedbackMessage = err?.message || 'Terjadi kesalahan';
      feedbackIsError = true;
    } finally {
      showFeedback = true;
      isProcessing = false;
    }
  }

  async function handleVoid(e: MouseEvent) {
    e.preventDefault();
    if (!confirm('Apakah Anda yakin ingin membatalkan (void) pesanan ini?')) return;

    isProcessing = true;
    feedbackMessage = '';
    showFeedback = false;

    const form = new FormData();
    form.set('order_id', data.order.id);

    try {
      const res = await fetch('?/void', {
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
        await invalidate(window.location.pathname);
      }
    } catch (err: any) {
      feedbackMessage = err?.message || 'Terjadi kesalahan';
      feedbackIsError = true;
    } finally {
      showFeedback = true;
      isProcessing = false;
    }
  }

  const statusBadge = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border border-rose-200';
      case 'void':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };
</script>

<section class="space-y-6 py-12">
	<h1 class="text-2xl font-bold">Detail Order #{data.order.order_id}</h1>

	<div class="space-y-4 rounded bg-white p-4 shadow">
		<!-- Data Order -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<p><strong>User ID:</strong> <span class="text-gray-600">{data.order.user_id}</span></p>
				<p>
					<strong>Waktu dibuat:</strong>
					<span class="text-gray-600">{new Date(data.order.created_at).toLocaleString()}</span>
				</p>
				<p>
					<strong>Status:</strong>
					<span
						class={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusBadge(data.order.status)}`}
					>
						<Icon icon="mdi:checkbox-blank-circle" width="10" height="10" />
						<span class="capitalize">{data.order.status}</span>
					</span>
				</p>
				{#if data.order.fraud_status}
					<p>
						<strong>Fraud Status:</strong>
						<span class="text-gray-600">{data.order.fraud_status}</span>
					</p>
				{/if}
				<p>
					<strong>Payment:</strong>
					<span class="text-gray-600">{data.order.payment_type} — {data.order.transaction_id}</span>
				</p>
			</div>

			<div>
				<p><strong>Total:</strong> Rp{Number(data.order.total_amount).toLocaleString('id-ID')}</p>
				<p><strong>Jumlah Item:</strong> {data.order.item_count}</p>
			</div>
		</div>

		<!-- Daftar Item -->
		<div>
			<h2 class="mb-2 text-lg font-semibold">Item Pesanan</h2>
			<ul class="divide-y divide-gray-300">
				{#each data.order.items as item}
					<li class="flex items-center gap-4 py-2">
						<div class="h-16 w-16 overflow-hidden rounded border">
							{#if item.image_url}
								<img src={item.image_url} alt={item.name} class="h-full w-full object-cover" />
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

		<!-- Form untuk Update Status -->
		<form
			method="POST"
			action="?/updateStatus"
			onsubmit={submitStatusChange}
			class="mt-4 max-w-xs space-y-2"
		>
			<input type="hidden" name="order_id" value={data.order.id} />
			<label class="block">
				<span class="font-medium">Ubah Status</span>
				<select
					name="status"
					bind:value={status}
					class="mt-1 block w-full rounded border px-3 py-2"
				>
					<option value="pending">pending</option>
					<option value="paid">paid</option>
					<option value="shipped">shipped</option>
					<option value="completed">completed</option>
					<option value="cancelled">cancelled</option>
					<option value="void">void</option>
				</select>
			</label>

			<div class="mt-12 flex gap-3">
				<button
					type="submit"
					class="rounded-sm bg-[#0443F2] px-4 py-2 text-gray-200 hover:bg-[#0433C2]"
					disabled={isProcessing}
				>
					{#if isProcessing}
						<span
							class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></span>
					{/if}
					Simpan Status
				</button>
				<button
					type="button"
					onclick={handleVoid}
					class="rounded bg-rose-500 px-4 py-2 text-white hover:bg-red-700"
					disabled={isProcessing}
				>
					Batalkan (Void)
				</button>
			</div>
		</form>

		
		{#if showFeedback}
			<div
				class={`mt-2 rounded p-2 ${feedbackIsError ? 'bg-rose-100 text-rose-800' : 'bg-green-100 text-green-800'}`}
			>
				{feedbackMessage}
			</div>
		{/if}

    <button
			onclick={goBack}
			class="mb-4 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
		>
			<Icon icon="mdi:arrow-left" width="24" height="24" />
			<span class="text-lg font-medium">Kembali</span>
		</button>

	</div>
</section>
