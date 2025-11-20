<script lang="ts">
  interface Props {
    data: {
      address: {
        id?: string;
        provinsi?: string;
        kabupaten_kota?: string;
        kecamatan?: string;
        desa_kelurahan?: string;
        alamat_jalan?: string;
        penerima?: string;
        label?: string;
        nomor?: string;
        kode_pos?: string;
      } | null;
    };
  }
  let { data }: Props = $props();

  const form = $state({
    provinsi: data.address?.provinsi ?? '',
    kabupaten_kota: data.address?.kabupaten_kota ?? '',
    kecamatan: data.address?.kecamatan ?? '',
    desa_kelurahan: data.address?.desa_kelurahan ?? '',
    alamat_jalan: data.address?.alamat_jalan ?? '',
    penerima: data.address?.penerima ?? '',
    label: data.address?.label ?? '',
    nomor: data.address?.nomor ?? '',
    kode_pos: data.address?.kode_pos ?? ''
  });

  let loading = $state(false);
  let errorMsg = $state('');

  async function handleSubmit(e: SubmitEvent) {
  e.preventDefault();
  const digits = form.nomor.replace(/\D/g, '');
  if (digits.length < 12) {
    return;
  }
  loading = true;

  const body = new FormData(e.target as HTMLFormElement);
  const res = await fetch('', { method: 'POST', body });
  loading = false;

  if (res.ok) location.href = '/profile/account';
  else errorMsg = 'Gagal menyimpan alamat';
}
</script>

<svelte:head>
  <title>Ubah Alamat</title>
</svelte:head>

<section class="bg-white p-4 sm:p-6 ml-72">
  <h1 class="mb-6 text-2xl font-semibold text-gray-800 border-b pb-4">
    Alamat Saya
  </h1>

  {#if errorMsg}
    <p class="mb-4 text-sm text-red-600">{errorMsg}</p>
  {/if}

  <form method="POST" onsubmit={handleSubmit} class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
    {#if data.address?.id}
    <input type="hidden" name="id" value={data.address.id} />
    {/if}
    <!--Provinsi & Kab/Kota -->
    <div class="flex flex-col">
      <label for="provinsi" class="text-sm font-medium text-gray-700 mb-1">Provinsi<span class="text-red-700">*</span></label>
      <input id="provinsi" name="provinsi" type="text" required bind:value={form.provinsi}
        placeholder="Contoh: Daerah Istimewa Yogyakarta"
        class="w-full rounded-sm border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <div class="flex flex-col">
      <label for="kabupaten_kota" class="text-sm font-medium text-gray-700 mb-1">Kabupaten / Kota<span class="text-red-700">*</span></label>
      <input id="kabupaten_kota" name="kabupaten_kota" type="text" required bind:value={form.kabupaten_kota}
        placeholder="Contoh: Sleman"
        class="w-full rounded-sm border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <!-- Kec & Desa -->
    <div class="flex flex-col">
      <label for="kecamatan" class="text-sm font-medium text-gray-700 mb-1">Kecamatan<span class="text-red-700">*</span></label>
      <input id="kecamatan" name="kecamatan" type="text" required bind:value={form.kecamatan}
        placeholder="Contoh: Depok"
        class="w-full rounded-sm border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <div class="flex flex-col">
      <label for="desa_kelurahan" class="text-sm font-medium text-gray-700 mb-1">Desa / Kelurahan<span class="text-red-700">*</span></label>
      <input id="desa_kelurahan" name="desa_kelurahan" type="text" required bind:value={form.desa_kelurahan}
        placeholder="Contoh: Condongcatur"
        class="w-full rounded-sm border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <!-- Nama penerima & Telepon -->
    <div class="flex flex-col">
      <label for="penerima" class="text-sm font-medium text-gray-700 mb-1">Nama Penerima<span class="text-red-700">*</span></label>
      <input id="penerima" name="penerima" type="text" required bind:value={form.penerima}
        placeholder="Nama penerima paket"
        class="w-full rounded-sm border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <div class="flex flex-col">
      <label for="nomor" class="text-sm font-medium text-gray-700 mb-1">Nomor Telepon<span class="text-red-700">*</span></label>
      <input id="nomor" name="nomor" type="tel" required bind:value={form.nomor}
        placeholder="08..."
        class="w-full rounded-sm border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <!--Alamat & Label (full-width) -->
    <div class="md:col-span-2 flex flex-col">
      <label for="alamat_jalan" class="text-sm font-medium text-gray-700 mb-1">Alamat Jalan<span class="text-red-700">*</span></label>
      <textarea id="alamat_jalan" name="alamat_jalan" rows="3" required bind:value={form.alamat_jalan}
        placeholder="Contoh: Jl. Affandi No. 23"
        class="w-full resize-none rounded-sm border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"></textarea>
    </div>

    <div class="md:col-span-2 flex flex-col">
      <label for="label" class="text-sm font-medium text-gray-700 mb-1">Label / Patokan<span class="text-red-700">*</span></label>
      <input id="label" name="label" type="text" required bind:value={form.label}
        placeholder="Contoh: Rumah kuning dengan pagar biru"
        class="w-full rounded-sm border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <!--  Kode Pos (full-width) -->
    <div class="md:col-span-2 flex flex-col">
      <label for="kode_pos" class="text-sm font-medium text-gray-700 mb-1">Kode Pos<span class="text-red-700">*</span></label>
      <input id="kode_pos" name="kode_pos" type="text" required bind:value={form.kode_pos}
        placeholder="Contoh: 55281"
        class="w-full rounded-sm border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
    </div>

    <!-- Tombol -->
    <div class="md:col-span-2 flex justify-end">
      <button
        type="submit"
        disabled={loading}
        class="px-6 py-2 text-white font-medium rounded-sm bg-[#0443F2] hover:bg-[#0433C2] focus:ring-4 focus:ring-blue-300 transition disabled:opacity-60"
      >
        {loading ? 'Menyimpan...' : (data.address ? 'Perbarui Alamat' : 'Tambah Alamat')}
      </button>
    </div>
  </form>
</section>

<style>
  /* optional dark mode ring */
  .focus\:ring-blue-300:focus {
    --tw-ring-color: rgba(59, 130, 246, 0.45);
  }
</style>