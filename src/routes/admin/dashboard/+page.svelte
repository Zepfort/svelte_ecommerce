<svelte:options runes={true} />

<script lang="ts">
  import { onMount } from 'svelte';

    // dummy
  let stats = {
    revenue: 125430000,
    orders: 342,
    customers: 1820,
    products: 71
  };

  // dummy
  let recentOrders = [
    { id: 'ORD-0012', customer: 'Budi', total: 150000, status: 'Shipped', date: '2025-09-28' },
    { id: 'ORD-0011', customer: 'Sari', total: 250000, status: 'Processing', date: '2025-09-27' },
    { id: 'ORD-0010', customer: 'Tono', total: 99000, status: 'Delivered', date: '2025-09-25' },
  ];

  // you can fetch real metrics in onMount or use load() server-side
  onMount(() => {
    // fetch from API / supabase if needed
  });

  function formatRp(v:number) {
    return new Intl.NumberFormat('id-ID').format(v);
  }
</script>

<!-- Stats -->
<section class="space-y-6">
  <h2 class="text-2xl font-bold text-slate-900">Dashboard</h2>

  <!-- cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="p-4 bg-white rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs font-medium text-gray-500">Revenue</div>
          <div class="text-2xl font-semibold mt-1">Rp{formatRp(stats.revenue)}</div>
        </div>
        <div class="text-green-600 text-sm font-medium">+12% YoY</div>
      </div>
      <div class="mt-3 text-sm text-gray-500">Total sales this month</div>
    </div>

    <div class="p-4 bg-white rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs font-medium text-gray-500">Orders</div>
          <div class="text-2xl font-semibold mt-1">{stats.orders}</div>
        </div>
        <div class="text-indigo-600 text-sm font-medium">See orders</div>
      </div>
      <div class="mt-3 text-sm text-gray-500">New & returning orders</div>
    </div>

    <div class="p-4 bg-white rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs font-medium text-gray-500">Customers</div>
          <div class="text-2xl font-semibold mt-1">{stats.customers}</div>
        </div>
        <div class="text-purple-600 text-sm font-medium">+3% m/m</div>
      </div>
      <div class="mt-3 text-sm text-gray-500">Active customers</div>
    </div>

    <div class="p-4 bg-white rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs font-medium text-gray-500">Products</div>
          <div class="text-2xl font-semibold mt-1">{stats.products}</div>
        </div>
        <div class="text-yellow-600 text-sm font-medium">Manage</div>
      </div>
      <div class="mt-3 text-sm text-gray-500">Total catalog items</div>
    </div>
  </div>

  <!-- chart + recent orders -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Chart placeholder -->
    <div class="bg-white rounded-xl shadow-sm border p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-medium">Sales (this month)</h3>
        <div class="text-sm text-gray-500">Updated xx ago</div>
      </div>
      <!-- Placeholder for chart -->
      <div class="h-52 rounded-lg bg-gradient-to-r from-indigo-50 to-white flex items-center justify-center text-indigo-300">
        <!-- replace with chart lib like Chart.js, ApexCharts later -->
        <span class="text-sm">[Grafik Penjualan]</span>
      </div>
    </div>

    <!-- Recent orders -->
    <div class="bg-white rounded-xl shadow-sm border p-4 overflow-auto">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-medium">Recent orders</h3>
        <a href="/admin/orders" class="text-sm text-indigo-600">See all</a>
      </div>

      <table class="min-w-full text-sm">
        <thead class="text-left text-gray-500">
          <tr>
            <th class="py-2 px-3">Order</th>
            <th class="py-2 px-3">Customer</th>
            <th class="py-2 px-3">Total</th>
            <th class="py-2 px-3">Status</th>
            <th class="py-2 px-3">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y">

          {#each recentOrders as o}
            <tr>
              <td class="py-3 px-3 font-medium text-slate-800">{o.id}</td>
              <td class="py-3 px-3">{o.customer}</td>
              <td class="py-3 px-3">Rp{formatRp(o.total)}</td>
              <td class="py-3 px-3">
                <span class="px-3 py-1 rounded-full text-xs font-medium
                  {o.status === 'Shipped' ? 'bg-green-50 text-green-700' : ''}
                  {o.status === 'Processing' ? 'bg-yellow-50 text-yellow-700' : ''}
                  {o.status === 'Delivered' ? 'bg-blue-50 text-blue-700' : ''}">
                  {o.status}
                </span>
              </td>
              <td class="py-3 px-3 text-gray-500">{o.date}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>
