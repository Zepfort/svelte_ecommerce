<script lang="ts">
	import Icon from '@iconify/svelte';
  // import * as echarts from 'echarts'; // fallback
	import type { PageData } from './$types';
	import MetricCard from './components/MetricCards.svelte';

	let { data } = $props<{ data: PageData }>();

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: data.chart.map((v: any) => v.day)
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `Rp ${value.toLocaleString('id-ID')}`
      }
    },
    series: [
      {
        name: 'Total',
        type: 'line',
        data: data.chart.map((v: any) => v.total),
        areaStyle: {}  
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  };

  // Registrasi modul echarts yang diperlukan (tree-shaking)
  // echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);
</script>

<!-- Stats -->
<section class="space-y-6">
	<h2 class="text-2xl font-bold text-slate-900">Dashboard</h2>

	<!-- cards -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<MetricCard
			label="Total Pendapatan"
			value={data.revenue}
			format="currency"
			icon="mdi:cash-multiple"
		/>
		<MetricCard
			label="Total Order"
			value={data.orders}
			format="number"
			href="/admin/orders"
			icon="mdi:cart-outline"
		/>
		<MetricCard
			label="Pembeli"
			value={data.customers}
			format="number"
			href="/admin/users"
			icon="mdi:account-group"
		/>
		<MetricCard
			label="Total Produk"
			value={data.products}
			format="number"
			href="/admin/products"
			icon="mdi:package-variant"
		/>
	</div>

	<!-- chart  -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="flex flex-col rounded-sm border-gray-700">
			<h3 class="mb-4 text-lg font-semibold">Sales Trend (7 hari)</h3>

			<!-- {#if data.chart.length && data.chart.some((v: any) => v.total > 0)}
				<div class="rounded border bg-white p-4">
					<Chart {init} {option} style="width: 100%; height: 400px" />
				</div>
			{:else}
				<div class="rounded border bg-white p-6 text-center text-gray-500">
					<p>Belum ada penjualan 7 hari terakhir</p>
				</div>
			{/if} -->
		</div>
	</div>

	<!-- Order terakhir -->
	<div class="overflow-hidden rounded-sm border bg-white px-4 pb-8 shadow-sm">
		<h3 class="my-4 text-lg font-semibold">Order Terakhir</h3>
		<table class="w-full px-4 text-sm">
			<thead class="rounded-sm bg-gray-100 py-2 text-blue-800">
				<tr>
					<th class="px-4 py-2 text-left">Order</th>
					<th class="px-4 py-2 text-left">Pembeli</th>
					<th class="px-4 py-2 text-right">Total</th>
					<th class="px-4 py-2 text-left">Status</th>
					<th class="px-4 py-2 text-left">Tanggal</th>
				</tr>
			</thead>
			<tbody>
				{#each data.recent as row}
					<tr class="border-b border-gray-400 hover:bg-gray-50">
						<td class="px-4 py-2">{row.order_code}</td>
						<td class="px-4 py-2">{row.customer_name}</td>
						<td class="px-4 py-2 text-right">
							Rp {Number(row.total).toLocaleString('id-ID')}
						</td>
						<td class="px-4 py-2">
							<span class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
								{row.status}
							</span>
						</td>
						<td class="px-4 py-2">{new Date(row.created).toLocaleDateString('id-ID')}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="px-4 py-8 text-center text-gray-400">No orders yet</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
