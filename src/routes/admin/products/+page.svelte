<script lang="ts">
	import Icon from '@iconify/svelte';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import '$lib/style/utils.css';

	let showModal = $state(false);
	let errorMsg = $state('');

	let newName = $state('');
	let newDescription = $state('');
	let newPrice = $state('');
	let newStock = $state('');
	let newCategoryId = $state('');
	let newImageFile: File | null = $state(null);
	let newIsActive = $state(true);

	let categories = $state<{ id: string; name: string }[]>([]);
	let products = $state<any[]>([]);

	// Ambil kategori dari Supabase
	onMount(async () => {
		const { data, error } = await supabase.from('categories').select('id, name');
		if (!error && data) categories = data;

		const { data: prodData } = await supabase.from('products').select(`
			id, name, price, stock, is_active,
			categories(name)
		`);
		if (prodData) products = prodData;
	});

	function handleAddProduct() {
		showModal = true;
		errorMsg = '';
		newName = '';
		newDescription = '';
		newPrice = '';
		newStock = '';
		newCategoryId = '';
		newImageFile = null;
		newIsActive = true;
	}

	async function saveProduct() {
		errorMsg = '';
		if (!newName || !newPrice || !newCategoryId) {
			errorMsg = 'Name, price, dan category wajib diisi';
			return;
		}
		if (!newImageFile) {
			errorMsg = 'Gambar produk harus diupload';
			return;
		}

		// Upload ke Supabase Storage
		const fileExt = newImageFile.name.split('.').pop();
		const fileName = `${crypto.randomUUID()}.${fileExt}`;
		const filePath = `product-images/${fileName}`;

		const { error: uploadError } = await supabase.storage
			.from('product-images')
			.upload(filePath, newImageFile, { upsert: true });

		if (uploadError) {
			errorMsg = 'Gagal upload gambar: ' + uploadError.message;
			return;
		}

		// Ambil URL publik gambar
		const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);

		const imageUrl = urlData.publicUrl;

		const { error } = await supabase.from('products').insert([
			{
				name: newName,
				description: newDescription,
				price: Number(newPrice),
				stock: Number(newStock) || 0,
				category_id: newCategoryId,
				image_url: newImageFile || null,
				is_active: newIsActive
			}
		]);

		if (error) {
			errorMsg = error.message;
			return;
		}

		showModal = false;

		// refresh list
		const { data: prodData } = await supabase.from('products').select(`
			id, name, price, stock, is_active,
			categories(name)
		`);
		if (prodData) products = prodData;
	}
</script>

<section class="space-y-6">
	<h2 class="text-2xl font-bold text-slate-900">Products</h2>

	<!-- Add Product -->
	<div class="mb-4 flex items-center justify-between">
		<button
			onclick={handleAddProduct}
			class="col-bg-primary flex items-center gap-2 rounded-lg px-4 py-2 text-lg shadow transition"
		>
			<Icon icon="mdi:plus" width="20" height="20" /> New Product
		</button>

		<button class="rounded-lg bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200">
			Sort Product alphabetically
		</button>
	</div>

	<!-- Modal -->
	{#if showModal}
		<div class="col-bg-admin-opa fixed inset-0 z-50 flex items-center justify-center">
			<div class="relative mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
				<button
					onclick={() => (showModal = false)}
					class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				>
					&times;
				</button>
				<h2 class="mb-4 text-xl font-semibold text-slate-800">New Product</h2>

				<div class="space-y-4">
					<div>
						<label for="product_name" class="mb-1 block text-slate-700">Product Name</label>
						<input
							type="text"
							bind:value={newName}
							class="w-full rounded border px-3 py-2"
							placeholder="Enter product name"
							id="product_name"
						/>
					</div>

					<div>
						<label for="description" class="mb-1 block text-slate-700">Description</label>
						<textarea
							bind:value={newDescription}
							class="w-full rounded border px-3 py-2"
							placeholder="Enter description"
							id="description"
						>
						</textarea>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="price" class="mb-1 block text-slate-700">Price</label>
							<input
								type="number"
								bind:value={newPrice}
								class="w-full rounded border px-3 py-2"
								placeholder="0"
								id="price"
							/>
						</div>
						<div>
							<label for="stock" class="mb-1 block text-slate-700">Stock</label>
							<input
								type="number"
								bind:value={newStock}
								class="w-full rounded border px-3 py-2"
								placeholder="0"
								id="stock"
							/>
						</div>
					</div>

					<div>
						<label for="category" class="mb-1 block text-slate-700">Category</label>
						<select
							bind:value={newCategoryId}
							class="w-full rounded border px-3 py-2"
							id="category"
						>
							<option value="">-- Choose Category --</option>
							{#each categories as c}
								<option value={c.id}>{c.name}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="image_url" class="mb-1 block text-slate-700">Image URL</label>
						<input
							type="file"
							accept="image/*"
							class="w-full rounded border px-3 py-2"
							placeholder="Upload inage"
							id="image_url"
						/>
					</div>

					<div class="flex items-center gap-2">
						<input id="active" type="checkbox" bind:checked={newIsActive} class="h-4 w-4" />
						<label for="active" class="text-slate-700">Active</label>
					</div>

					{#if errorMsg}
						<div class="text-sm text-red-600">{errorMsg}</div>
					{/if}

					<div class="mt-4 flex justify-end gap-2">
						<button
							onclick={() => (showModal = false)}
							class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Cancel</button
						>
						<button
							onclick={saveProduct}
							class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="overflow-x-auto rounded-lg bg-white shadow">
		<table class="min-w-full text-left text-sm">
			<thead class=" bg-gray-100 text-gray-700">
				<tr>
					<th class="px-4 py-2">IMAGE</th>
					<th class="px-4 py-2">NAME</th>
					<th class="px-4 py-2">CATEGORY</th>
					<th class="px-4 py-2">PRICE</th>
					<th class="px-4 py-2">STOCK</th>
					<th class="px-4 py-2">STATUS</th>
				</tr>
			</thead>
			<tbody>
				{#each products as p}
					<tr class="border-b hover:bg-gray-50">
                        <td>
                            {#if p.image_url}
                                <img src={p.image_url} alt={p.name} class="h-12 w-12 rounded object-cover" />
                            {:else}
                                <span class="text-gray-400">No Image</span>
                            {/if}
                        </td>
						<td class="px-4 py-2">{p.name}</td>
						<td class="px-4 py-2">{p.categories?.name ?? '-'}</td>
						<td class="px-4 py-2">Rp {p.price}</td>
						<td class="px-4 py-2">{p.stock}</td>
						<td class="px-4 py-2">
							{#if p.is_active}
								<span class="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Active</span>
							{:else}
								<span class="rounded bg-red-100 px-2 py-1 text-xs text-red-700">Inactive</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
