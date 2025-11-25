<!-- src/views/customers/CustomersView.vue -->
<template>
  <div class="layout">
    <TheHeader />

    <div class="layout__body">
      <main class="layout__main">
        <section class="page-toolbar">
          <CustomersToolbar v-model="searchText" :selectedCount="selectedCount" @reload="handleReload"
            @delete-selected="handleDeleteSelected" @add="goAdd" @import="openImport" />
        </section>

        <section class="page-content">
          <CustomersTable :rows="rows" :total="total" :page="page" :pageSize="pageSize" :loading="loading"
            @update:page="setPage" @update:pageSize="setPageSize" @selection-change="onSelectionChange"
            @sort-change="onSortChange" @row-click="goEdit" />
        </section>
      </main>
    </div>

    <input ref="importInputRef" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onPickImportFile" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import TheHeader from "@/layouts/TheHeader.vue";
import CustomersToolbar from "./CustomersToolbar.vue";
import CustomersTable from "./CustomersTable.vue";
import { useToast } from "@/components/ms-toast/useToast";
import { useConfirm } from "@/components/ms-dialog/useConfirm";
import {
  getCustomers,
  softDeleteCustomer,
  importCustomers,
} from "@/api/customersApi";

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

/* =========================
   State
   ========================= */
const searchText = ref("");
const page = ref(1);
const pageSize = ref(50); // ✅ mặc định 50 / trang
const total = ref(0);
const loading = ref(false);
const rows = ref([]);

const selectedCount = ref(0);
const selectedRows = ref([]);

// ✅ mặc định sort theo mã KH mới nhất
const sortColumn = ref("customerCode");
const sortDirection = ref("desc");

const importInputRef = ref(null);

/* =========================
   Helpers: build filter
   ========================= */
function buildSearchParams(kw) {
  const v = (kw || "").trim();
  if (!v) return {};
  if (v.includes("@")) return { email: v };
  if (/^\d+$/.test(v)) return { phone: v };
  return { name: v };
}

/* =========================
   Fetch list (server sort)
   ========================= */
async function fetchCustomers() {
  loading.value = true;
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      sortColumn: sortColumn.value,
      sortDirection: sortDirection.value,
      includeInactive: false,
      ...buildSearchParams(searchText.value),
    };

    const res = await getCustomers(params);

    rows.value = res.data?.data || [];
    total.value = res.data?.meta?.total || 0;

    // đẩy item vừa add/update lên đầu list
    const lastChangedId = sessionStorage.getItem("customers:lastChangedId");
    if (lastChangedId && rows.value.length) {
      const idx = rows.value.findIndex((x) => x.customerId === lastChangedId);
      if (idx > -1) {
        const [it] = rows.value.splice(idx, 1);
        rows.value.unshift(it);
      }
      sessionStorage.removeItem("customers:lastChangedId");
    }
  } catch (e) {
    toast.error("Không tải được danh sách khách hàng.");
    console.error("GetCustomers error:", e);
  } finally {
    loading.value = false;
  }
}

watch(
  [searchText, page, pageSize, sortColumn, sortDirection],
  fetchCustomers,
  { immediate: true }
);

/* =========================
   Pagination
   ========================= */
function setPage(p) {
  page.value = p;
}
function setPageSize(s) {
  pageSize.value = s;
  page.value = 1;
}

/* =========================
   Selection
   ========================= */
function onSelectionChange({ count, rows: sel }) {
  selectedCount.value = count;
  selectedRows.value = sel;
}

/* =========================
   Sorting from table
   ========================= */
function onSortChange({ field, direction }) {
  sortColumn.value = field || null;
  sortDirection.value = direction || null;
  page.value = 1;
}

/* =========================
   Toolbar actions (Dialog mới)
   ========================= */
async function handleReload() {
  const ok = await confirm.confirm({
    title: "Tải lại dữ liệu",
    message: "Bạn muốn tải lại danh sách khách hàng?",
    confirmText: "Tải lại",
    cancelText: "Hủy",
  });
  if (!ok) return;

  await fetchCustomers();
  toast.success("Đã tải lại danh sách khách hàng.");
}

async function handleDeleteSelected() {
  if (!selectedRows.value.length) return;

  const ok = await confirm.confirm({
    title: "Xóa khách hàng",
    message: `Bạn có chắc muốn xóa ${selectedRows.value.length} khách hàng đã chọn?`,
    confirmText: "Xóa",
    cancelText: "Không",
  });
  if (!ok) return;

  try {
    const ids = selectedRows.value.map((x) => x.customerId);
    await Promise.all(ids.map((id) => softDeleteCustomer(id)));

    selectedCount.value = 0;
    selectedRows.value = [];
    await fetchCustomers();

    toast.success("Đã xóa khách hàng đã chọn.");
  } catch (e) {
    toast.error("Xóa thất bại.");
    console.error("delete selected error:", e);
  }
}

function goAdd() {
  router.push("/customers/new");
}

function goEdit(row) {
  if (!row?.customerId) return;
  router.push(`/customers/${row.customerId}/edit`);
}

/* =========================
   Import (Dialog mới)
   ========================= */
async function openImport() {
  const ok = await confirm.confirm({
    title: "Nhập khách hàng",
    message: "Bạn muốn nhập khách hàng từ tệp Excel/CSV?",
    confirmText: "Nhập",
    cancelText: "Hủy",
  });
  if (!ok) return;

  importInputRef.value?.click();
}

async function onPickImportFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const res = await importCustomers(file);
    const r = res.data?.data;
    const successCount = r?.successCount ?? 0;
    const errorCount = r?.errorCount ?? 0;

    toast.success(
      `Import xong: ${successCount} bản ghi thành công, ${errorCount} bản ghi thất bại.`
    );

    await fetchCustomers();
  } catch (err) {
    const msg =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      "Import thất bại.";
    toast.error(msg);
    console.error("import error:", err);
  } finally {
    e.target.value = "";
  }
}
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
