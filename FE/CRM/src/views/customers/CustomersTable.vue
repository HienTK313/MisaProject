<!-- src/views/customers/CustomersTable.vue -->
<template>
  <div class="customers-table">
    <MsTable :columns="columns" :rows="rows" :total="total" :page="page" :pageSize="pageSize"
      :pageSizes="[50, 100, 200]" rowKey="customerId" selectable serverSide @update:page="emit('update:page', $event)"
      @update:pageSize="emit('update:pageSize', $event)" @selected-rows-change="onSelectedRowsChange"
      @sort-change="emit('sort-change', $event)">
      <template #cell="{ row, column, value }">
        <span v-if="column.field === 'customerType'" class="cell-text">
          {{ value || "-" }}
        </span>

        <a v-else-if="column.field === 'customerCode' || column.field === 'customerName'" href="#"
          class="link-blue cell-text" @click.prevent="emit('row-click', row)">
          {{ value || "-" }}
        </a>

        <span v-else-if="column.field === 'phone'" class="cell-phone cell-text">
          <span class="icon-phone"></span>
          {{ value || "-" }}
        </span>

        <span v-else-if="column.field === 'lastPurchaseDate'" class="cell-text">
          {{ formatDate(value) }}
        </span>

        <span v-else class="cell-text">
          {{ value || "-" }}
        </span>
      </template>

      <template #footer-left>
        Tổng số: {{ total.toLocaleString("vi-VN") }}
      </template>
    </MsTable>
  </div>
</template>

<script setup>
import MsTable from "@/components/ms-table/MsTable.vue";

defineProps({
  rows: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 20 },
});

const emit = defineEmits([
  "update:page",
  "update:pageSize",
  "selection-change",
  "row-click",
  "sort-change",
]);

const columns = [
  { label: "Loại khách hàng", field: "customerType" },
  { label: "Mã khách hàng", field: "customerCode" },
  { label: "Tên khách hàng", field: "customerName" },
  { label: "Mã số thuế", field: "taxCode" },
  { label: "Địa chỉ (Giao hàng)", field: "shippingAddress" },
  { label: "Điện thoại", field: "phone" },
  { label: "Ngày mua hàng gần nhất", field: "lastPurchaseDate" },
  { label: "Hàng hóa đã mua", field: "purchasedGoods" },
  { label: "Tên hàng hóa đã mua", field: "goodsName" },
];

function onSelectedRowsChange(selected) {
  emit("selection-change", {
    count: selected.length,
    rows: selected,
  });
}

function formatDate(v) {
  if (!v) return "-";
  const d = new Date(v);
  return isNaN(d) ? v : d.toLocaleDateString("vi-VN");
}
</script>
