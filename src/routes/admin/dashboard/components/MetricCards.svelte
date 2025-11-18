<script lang="ts">
    import Icon from '@iconify/svelte';

   type Props = {
    label: string;
    value: number | bigint | null | undefined;
    format?: 'number' | 'currency';
    href?: string;
    icon?: string;
  };

  let { label, value = 0, format = 'number', href, icon = 'mdi:arrow-right' }: Props = $props();

  /* pastikan angka sebelum dipanggil toLocaleString */
  const fmt = (v: number | bigint | null | undefined) => {
    const n = Number(v ?? 0);
    return format === 'currency'
      ? `Rp ${n.toLocaleString('id-ID')}`
      : n.toLocaleString('id-ID');
  };
</script>

{#if href}
  <a
    {href}
    class="group flex items-center justify-between p-4 bg-gray-50 rounded-sm shadow-sm border hover:bg-white transition"
  >
    <div class="flex flex-col">
      <span class="text-sm text-gray-500">{label}</span>
      <span class="text-2xl font-semibold mt-1">{fmt(value)}</span>
    </div>
    <Icon {icon} class="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
  </a>
{:else}
  <article class="p-4 bg-gray-50 rounded-sm shadow-sm border">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <h3 class="text-sm text-gray-500">{label}</h3>
        <p class="text-2xl font-semibold">{fmt(value)}</p>
      </div>
      {#if icon}
        <Icon {icon} class="w-6 h-6 text-gray-400" />
      {/if}
    </div>
  </article>
{/if}