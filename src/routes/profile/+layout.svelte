<script lang="ts">
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { userProfile: { id: string; name: string; email: string; created_at: string } }; children?: Snippet } = $props();

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Logout gagal:', error);
		} else {
			goto('/login');
		}
	}
</script>

<div class="flex min-h-screen w-full bg-gray-50 overflow-x-hidden">
	<!-- Sidebar -->
	<aside class="fixed inset-y-0 left-0 z-20 flex h-full w-72 flex-col bg-gray-950 text-gray-200 transform transition-transform duration-300 ease-in-out
		       -translate-x-full md:translate-x-0 md:w-72">
			   <h1 class="text-2xl font-bold text-gray-200 pt-12 pb-4 pl-6">Profile</h1>
			   <nav class="flex-1 space-y-2 p-4">
			<a
				href="/profile/account"
				class="flex items-center gap-3 rounded-sm px-4 py-2 leading-none transition col-bg-primary"
			>
				<Icon icon="famicons:home" 
					width="20" 
					height="20" 
					inline={true} 
					class="mr-0 align-middle inline-flex" />
				<span class="text-center">Profil</span>
			</a>
			<a
				href="/profile/purchase-history"
				class="flex items-center gap-3 rounded-sm px-4 py-2 leading-none transition col-bg-primary"
			>
				<Icon icon="pajamas:history" 
					width="20" 
					height="24" 
					inline={true} 
					class="mr-0 align-middle inline-flex" />
				<span class="text-center">Riwayat Pembelian</span>
			</a>

			<a href="/" class="flex items-center gap-3 rounded-sm px-4 py-2 transition col-bg-admin">
				<Icon
					icon="pajamas:go-back"
					width="20"
					height="20"
					inline={true}
					class="mr-0 align-middle inline-flex"
				/>
				<span>Kembali</span>
			</a>

			<button
				type="button"
				onclick={handleLogout}
				class="flex w-full items-center gap-3 rounded-sm px-4 py-2 text-left transition col-bg-primary"
			>
				<Icon icon="mdi:logout" width="20" height="20" />
				<span>Log Out</span>
			</button>
		</nav>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 px-0 md:px-6 ">
		{@render children?.()}
	</main>
</div>

<style>
	.col-bg-primary{
		background-color: transparent;
	}

	.col-bg-primary:hover{
		background-color: #0443F2;
	}
</style>
