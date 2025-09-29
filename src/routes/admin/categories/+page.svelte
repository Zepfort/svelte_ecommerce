<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import '$lib/style/utils.css';

	type Category = {
		id: number;
		name: string;
		parent?: string;
		active: boolean;
		discount?: string;
	};

	let categories = $state<Category[]>([]);
	let showModal = $state(false);

	let newName = $state('');
	let newParentId = $state<string | null>(null);
	let errorMsg = $state('');

	async function loadCategories() {
		const { data, error } = await fetch('/api/categories').then((r) => r.json());
		if (!error) {
			categories = data;
		}
	}

	async function saveCategory() {
		errorMsg = '';
		if (!newName.trim()) {
			errorMsg = 'Need New Name categoriy ';
			return;
		}
	}

	//     const res = await fetch('/admin/categories', {
	//       method: 'POST',
	//       headers: { 'Content-Type': 'application/json' },
	//       body: JSON.stringify({ name: newName.trim(), parent_id: newParentId })
	//     })
	//       .then(r => r.json());

	//     if (res.error) {
	//       errorMsg = res.error;
	//     } else {
	//       // sukses
	//       showModal = false;
	//       newName = '';
	//       newParentId = null;
	//       await loadCategories();
	//     }
	// }

	onMount(() => {
		// Dummy
		categories = [
			{ id: 1, name: 'Wallpapers', active: true },
			{ id: 2, name: 'Floral', parent: 'Wallpapers', active: true },
			{ id: 3, name: 'Geometric', parent: 'Wallpapers', active: true },
			{ id: 4, name: 'Textured', parent: 'Wallpapers', active: true },
			{ id: 5, name: 'Paint colors', active: true, discount: '0.0%' },
			{ id: 6, name: 'Seasonal', parent: 'Paint colors', active: true }
		];
	});

	function handleAddCategory() {
		showModal = true;
		errorMsg = '';
		newName = '';
		newParentId = null;
	}

	function handleEdit(id: number) {
		alert('Edit kategori id: ' + id);
	}

	function handleDelete(id: number) {
		if (confirm('Yakin ingin menghapus kategori ini?')) {
			categories = categories.filter((c) => c.id !== id);
		}
	}
</script>

<section class="space-y-6">
	<h2 class="text-2xl font-bold text-slate-900">Product Categories</h2>

	<div class="mb-4 flex items-center justify-between">
		<button
			onclick={handleAddCategory}
			class="col-bg-primary flex items-center gap-2 rounded-lg px-4 py-2 text-lg shadow transition"
		>
			<Icon icon="mdi:plus" width="20" height="20" /> New Category
		</button>

		<button class="rounded-lg bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200">
			Sort categories alphabetically
		</button>
	</div>

	<!-- Modal  -->

	{#if showModal}
		<div class=" fixed inset-0 z-50 flex items-center justify-center col-bg-admin-opa">
			<div class="relative mx-4 w-full max-w-md rounded-lg bg-white p-6">
				<button
					onclick={() => (showModal = false)}
					class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				>
					&times;
				</button>
				<h2 class="mb-4 text-xl col-text-black font-semibold">New Category</h2>

				<div class="space-y-4">
					<div>
						<label for="category-name" class="mb-1 block col-text-black ">Category name</label>
						<input
							id="category-name"
							type="text"
							bind:value={newName}
							class="w-full rounded border px-3 py-2"
							placeholder="Enter category name"
						/>
					</div>
					<div>
						<label for="parent-category-name" class="mb-1 block col-text-black">Parent Category (optional)</label>
						<select id="parent-category-name" bind:value={newParentId} class="w-full rounded border px-3 py-2">
							<option value="">-- Choose Parent --</option>
							{#each categories as pc}
								<option value={pc.id}>{pc.name}</option>
							{/each}
						</select>
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
							onclick={saveCategory}
							class="rounded col-bg-primary px-4 py-2 text-white">Save</button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="overflow-x-auto rounded-lg bg-white shadow">
		<table class="w-full border-collapse">
			<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
				<tr>
					<th class="px-4 py-3 text-left">Category Name</th>
					<th class="px-4 py-3 text-left">Parent Category</th>
					<th class="px-4 py-3 text-center">Move</th>
					<th class="px-4 py-3 text-center">Active</th>
					<th class="px-4 py-3 text-center">Discount</th>
					<th class="px-4 py-3 text-center">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each categories as c}
					<tr class="transition hover:bg-gray-50">
						<td
							class="col-text-black cursor-pointer px-4 py-3 text-base font-medium hover:underline"
							>{c.name}</td
						>
						<td class="col-text-primary px-4 py-3 text-base font-medium">{c.parent ?? '-'}</td>
						<td class="px-4 py-3 text-center">
							<div class="flex justify-center gap-2">
								<button class="rounded bg-blue-500 p-1.5 text-white transition hover:bg-blue-600">
									<Icon icon="mdi:arrow-up" width="18" height="18" />
								</button>
								<button class="rounded bg-blue-500 p-1.5 text-white transition hover:bg-blue-600">
									<Icon icon="mdi:arrow-down" width="18" height="18" />
								</button>
							</div>
						</td>
						<td class="px-4 py-3 text-center">
							{#if c.active}
								<Icon icon="mdi:check" class="text-green-600" width="20" height="20" />
							{:else}
								<Icon icon="mdi:close" class="text-red-500" width="20" height="20" />
							{/if}
						</td>
						<td class="px-4 py-3 text-center">{c.discount ?? '-'}</td>
						<td class="px-4 py-3 text-center">
							<div class="flex justify-center gap-2">
								<button
									onclick={() => handleEdit(c.id)}
									class="rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
								>
									<Icon icon="mdi:pencil" width="18" height="18" />
								</button>
								<button
									onclick={() => handleDelete(c.id)}
									class="rounded bg-rose-500 p-2 text-white transition hover:bg-rose-600"
								>
									<Icon icon="mdi:trash-can" width="18" height="18" />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="mt-6 flex items-center justify-between">
		<button
			class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-800 transition hover:bg-gray-200"
		>
			<Icon icon="mdi:cog-outline" width="20" height="20" /> Manage Categories
		</button>
	</div>
</section>
