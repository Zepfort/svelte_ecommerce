<svelte:options runes={true} />

<script lang="ts">
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';

  // data dari load SSR (+page.server.ts)
   let { data } = $props<{
    userProfile: { id: string; name: string; email: string; created_at?: string };
    addresses: any[];
  }>();

  // state reaktif
  let initials = $state((name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  let memberSince = $state((dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    } catch {
      return dateStr;
    }
  });
</script>

<div class="md:hidden bg-gray-900 text-gray-200 min-h-screen pb-20" style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 5rem);">
  <header class="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
    <h1 class="text-base font-semibold">Profil Saya</h1>
    <div class="w-10"></div>
  </header>

  <main class="px-4 pt-4 space-y-4">
    <section class="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
      <div class="h-14 w-14 rounded-full bg-indigo-600 grid place-items-center text-lg font-semibold">
        {initials(data.userProfile.name)}
      </div>
      <div class="flex-1">
        <div class="flex items-center justify-between gap-2">
          <div>
            <div class="text-sm font-semibold">{data.userProfile.name}</div>
            <div class="text-xs text-gray-300">{data.userProfile.email}</div>
          </div>
          <!-- <button class="text-xs px-3 py-1 rounded bg-[#0443F2] hover:bg-[#0433C2]" onclick={() => goto('/profile/account')}>
            Edit
          </button> -->
        </div>
        <div class="mt-2 text-xs text-gray-400">Member since {memberSince(data.userProfile.created_at)}</div>
      </div>
    </section>

    <section class="bg-gray-800 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold">Alamat</div>
        <button class="text-xs text-gray-300" onclick={() => goto('/profile/addresses')}>Ubah alamat</button>
      </div>

      {#if data.addresses.length === 0}
        <div class="mt-3 text-sm text-gray-400">Belum ada alamat tersimpan.</div>
      {:else}
        <div class="mt-3 space-y-2">
          {#each data.addresses.slice(0, 2) as addr}
            <div class="rounded border border-gray-700/50 p-3 bg-gray-900">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium">{addr.label ?? 'Alamat'}</div>
                {#if addr.is_default}
                  <div class="text-xs px-2 py-0.5 rounded bg-green-600 text-white">Default</div>
                {/if}
              </div>
              <div class="mt-1 text-xs text-gray-300">{addr.recipient} • {addr.phone}</div>
              <div class="mt-2 text-xs text-gray-300">{addr.full_address}</div>
            </div>
          {/each}
        </div>
        {#if data.addresses.length > 2}
          <div class="mt-2 text-xs text-gray-400">…dan {data.addresses.length - 2} alamat lainnya</div>
        {/if}
      {/if}
    </section>

    <section class="bg-gray-800 rounded-lg p-4">
      <div class="text-sm font-semibold mb-3">Menu</div>
      <div class="grid grid-cols-2 gap-3">
        <button class="flex flex-col items-center gap-1 p-3 rounded bg-gray-900 hover:bg-gray-800" onclick={() => goto('/profile/purchase-history')}>
          <Icon icon="mdi:clipboard-text" width="20" height="20" />
          <span class="text-xs">Riwayat Pembelian</span>
        </button>
        <button class="flex flex-col items-center gap-1 p-3 rounded bg-gray-900 hover:bg-gray-800" onclick={() => goto('/login')}>
          <Icon icon="mdi:logout" width="20" height="20" />
          <span class="text-xs">Keluar</span>
        </button>
      </div>
    </section>
  </main>

  <nav
    class="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 text-gray-200 flex justify-around items-center"
    style="height: calc(56px + env(safe-area-inset-bottom, 0px)); padding-bottom: env(safe-area-inset-bottom, 0px);"
  >
    <button class="flex flex-col items-center justify-center" aria-label="Home" onclick={() => goto('/')}>
      <Icon icon="mdi:home" width="24" height="24" color="white" />
      <span class="text-xs">Home</span>
    </button>

    <button class="flex flex-col items-center justify-center" aria-label="Profile" onclick={() => goto('/profile')}>
      <Icon icon="mdi:account-circle" width="24" height="24" color="white" />
      <span class="text-xs">Profile</span>
    </button>
  </nav>
</div>
