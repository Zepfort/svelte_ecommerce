<script lang="ts">
	import Icon from '@iconify/svelte';
	import '/src/lib/style/utils.css';
	interface Props {
		data: {
			userProfile: {
				id: string;
				name?: string;
				email?: string;
				created_at: string;
			};
			addresses: Array<{
				id: string;
				label: string;
				recipient: string;
				phone: string;
				full_address: string;
				province: string;
				city: string;
				district: string;
				village: string;
				postal_code: string;
				is_default: boolean;
			}>;
		};
	}

	let { data }: Props = $props();
	let showModalDelete = $state(false);
	let deleteId = $state('');

	function formatDate(date: any) {
		return date.slice(0, 10);
	}
</script>

<svelte:head>
  <title>Profile Akun</title>
</svelte:head>

<section class="h-screen w-full bg-white shadow-md sm:p-6 md:p-8 lg:ml-64">
	<h1 class="mb-4 text-center text-xl font-bold sm:text-2xl lg:text-left">Profil Saya</h1>

	<div class="space-y-4">
		<!-- Profil -->
		<div
			class="flex flex-col items-center text-center sm:flex-row sm:items-start sm:space-x-4 sm:text-left"
		>
			<div
				class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 sm:mx-0"
			>
				<Icon icon="material-symbols:account-circle" width="80" height="80" class="text-gray-500" />
			</div>
			<div class="mt-3 ml-3 sm:mt-0">
				<h2 class="text-lg font-semibold">{data.userProfile.name}</h2>
				<p class="text-gray-600">{data.userProfile.email}</p>
			</div>
		</div>

		<!-- Info dasar -->
		<div class="grid grid-cols-1 gap-4 border-t pt-4">
			<h1 class="text-2xl font-semibold text-gray-950">Informasi Umum</h1>
			<div class="flex items-center justify-center space-x-2 leading-none md:justify-start">
				<Icon icon="mdi:calendar" width="20" height="20" class="text-gray-500" />
				<span>Bergabung: {formatDate(data.userProfile.created_at)}</span>
			</div>
		</div>

		<!-- Alamat -->
		<div
			class="max-w-[20rem] rounded-lg border-2 border-blue-400 bg-blue-50 p-6 text-center md:text-left"
		>
			<h3 class="mb-2 text-lg font-semibold">Alamat</h3>

			{#if data.addresses.length > 0}
				{#each data.addresses as addr}
					<div class="border-b py-3 last:border-b-0">
						<p class="font-medium">{addr.recipient} – {addr.label}</p>
						<p class="text-sm text-gray-700">{addr.full_address}, {addr.village}</p>
						<p class="text-sm text-gray-700">{addr.district}, {addr.city}</p>
						<p class="text-sm text-gray-700">{addr.province} {addr.postal_code}</p>
						<p class="mt-1 text-sm text-gray-600">Telp: {addr.phone}</p>
						{#if addr.is_default}
							<span class="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Utama</span>
						{/if}
					</div>
				{/each}

				<div class="mt-4 flex w-full flex-col gap-3">
					<a
						href="/profile/addresses"
						class="flex justify-center rounded-sm border bg-[#0443F2] hover:bg-[#0433C2] px-8 py-1.5 text-center font-semibol text-gray-200"
					>
						Ubah Alamat
					</a>
					<!-- bisa tambah tombol hapus per alamat di sini -->
				</div>
			{:else}
				<p class="mb-3 text-gray-500 italic">Belum mengisi alamat.</p>
				<a
					href="/profile/addresses"
					class="flex justify-center rounded-sm border border-blue-200 bg-[#0443F2] hover:bg-[#0433C2] px-8 py-1.5 font-semibold text-gray-200 "
				>
					Tambah Alamat
				</a>
			{/if}

			<!-- Modal Konfirmasi -->
			{#if showModalDelete}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div class="w-full max-w-sm rounded-sm bg-white p-6 shadow-lg">
						<h3 class="mb-4 text-lg font-semibold">Hapus Alamat</h3>
						<p class="mb-6 text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>

						<div class="flex justify-end gap-2">
							<button
								type="button"
								onclick={() => (showModalDelete = false)}
								class="rounded-sm bg-gray-200 px-4 py-1.5 hover:bg-gray-300"
							>
								Batal
							</button>

							<form method="POST" action="?/delete">
								<input type="text" class="hidden" />
								<button
									type="submit"
									class="rounded-sm bg-red-500 px-4 py-1.5 text-white hover:bg-rose-600"
								>
									Hapus
								</button>
							</form>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
</style>
