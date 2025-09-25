<script lang="ts">
	import { onMount } from 'svelte';
    import Icon from "@iconify/svelte";

	type Items = {
		id: string;
		name: string;
		price: number;
		qty: number;
	};

	let items = $state<Items[]>([]);
	let open = $state(false);
	let total = $derived(items.reduce((sum, i) => sum + i.price * i.qty, 0));

	onMount(() => {});

	$effect(() => {});

	function inc(id: string) {
		const i = items.find((x) => x.id === id);
		if (i) {
			i.qty += 1;
			items = [...items];
		}
	}

	function dec(id: string) {
		const i = items.find((x) => x.id === id);
		if (!i) return;
		if (i.qty > 1) {
			i.qty -= 1;
			items = [...items];
		} else {
			items = items.filter((x) => x.id !== id);
		}
	}

	function del(id: string) {
		items = items.filter((x) => x.id !== id);
	}
</script>

<div class="relative">
	<!-- tombol keranjang -->
	<button
		onclick={() => (open = !open)}
		class="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
	>
		<Icon icon="icon-park-outline:shopping" width="24" height="24" color="white"/>
		<span class="text-sm font-semibold">{items.length}</span>
	</button>

	<!-- pop-up mini cart -->
	{#if open}
		<div class="absolute -left-35 z-50 mt-2 w-80 rounded-lg border bg-white p-4 shadow-xl">
			{#if items.length === 0}
            <div class="flex justify-center items-center min-h-[200px] w-min-[300px]">
				<p class="text-center text-sm text-gray-500 ">Keranjang kosong</p>
            </div>
			{:else}
				<ul class="max-h-96 space-y-3 overflow-auto">
					{#each items as it}
						<li class="flex items-center justify-between">
							<div class="flex-1">
								<p class="font-medium">{it.name}</p>
								<p class="text-xs text-gray-500">Rp {it.price.toLocaleString()}</p>
							</div>

							<div class="flex items-center gap-2">
								<button
									onclick={() => dec(it.id)}
									class="h-7 w-7 rounded bg-gray-200 hover:bg-gray-300"
								>
									-
								</button>
								<span class="w-6 text-center text-sm">{it.qty}</span>
								<button
									onclick={() => inc(it.id)}
									class="h-7 w-7 rounded bg-gray-200 hover:bg-gray-300"
								>
									+
								</button>

								<button
									onclick={() => del(it.id)}
									class="ml-2 text-xs text-red-600 hover:underline"
								>
									Hapus
								</button>
							</div>
						</li>
					{/each}
				</ul>

				<div class="mt-4 border-t pt-3 text-right">
					<p class="text-lg font-bold">Rp {total.toLocaleString()}</p>
					<a
						href="/checkout"
						class="inline-block rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
					>
						Checkout
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>
