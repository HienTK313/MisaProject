<template>
  <div class="ms-table">
    <div class="ms-table__viewport">
      <table class="ms-table__table">
        <thead class="ms-table__thead">
          <tr>
            <th class="ms-table__checkbox-col">
              <input ref="headCheckboxRef" type="checkbox" :checked="allPageSelected" @change="toggleSelectAllPage" />
            </th>

            <th v-for="col in columns" :key="col.field" class="ms-table__th"
              :class="{ 'is-sortable': col.sortable !== false }"
              :style="{ cursor: col.sortable !== false ? 'pointer' : 'default' }"
              @click="col.sortable !== false && toggleSort(col)">
              <div class="ms-table__th-inner">
                <span class="ms-table__th-label">{{ col.label }}</span>

                <span v-if="col.sortable !== false" class="ms-table__sort">
                  <span class="icon icon-12"></span>
                  <span class="icon icon-12"></span>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="ms-table__tbody">
          <tr v-for="(rowWrap, rIndex) in pagedRows" :key="rowWrap.__key" class="ms-table__row"
            :class="{ 'is-selected': isSelected(rowWrap.__key) }" @click="onRowClick(rowWrap)">
            <td class="ms-table__checkbox-col" @click.stop>
              <input type="checkbox" :checked="isSelected(rowWrap.__key)" @change="toggleRow(rowWrap)" />
            </td>

            <td v-for="col in columns" :key="col.field" class="ms-table__td">
              <slot name="cell" :row="rowWrap" :column="col" :value="rowWrap[col.field]" :rowIndex="rIndex">
                {{ rowWrap[col.field] ?? "-" }}
              </slot>
            </td>
          </tr>

          <tr v-if="!pagedRows.length">
            <td :colspan="columns.length + 1" class="ms-table__empty">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="ms-table__footer">
      <!-- BÊN TRÁI FOOTER -->
      <div class="ms-table__footer-left">
        <button class="ms-table__footer-filter-btn" type="button">
          <!-- icon anh tự gắn class -->
          <span class="icon icon-filter icon-16"></span>
        </button>

        <div class="ms-table__footer-block">
          <span class="ms-table__footer-label">Tổng số:</span>
          <span class="ms-table__footer-value ms-table__footer-total">
            {{ totalComputed.toLocaleString("vi-VN") }}
          </span>
        </div>

        <div class="ms-table__footer-block">
          <span class="ms-table__footer-label">Công nợ:</span>
          <span class="ms-table__footer-value ms-table__footer-debt">
            0
          </span>
        </div>
      </div>

      <!-- BÊN PHẢI FOOTER -->
      <div class="ms-table__footer-right">
        <!-- Chọn kích thước trang -->
        <div class="ms-table__page-size">
          <select v-model.number="internalPageSize" @change="onChangePageSize">
            <option v-for="s in pageSizesComputed" :key="s" :value="s">
              {{ s }} Bản ghi trên trang
            </option>
          </select>
        </div>

        <!-- Điều hướng trang -->
        <div class="ms-table__pager">
          <!-- Đầu -->
          <button class="ms-table__pager-btn ms-table__pager-btn--first" type="button" :disabled="pageComputed <= 1"
            @click="setPage(1)">
            <span class="icon icon-first-page icon-16"></span>
          </button>

          <!-- Trước -->
          <button class="ms-table__pager-btn ms-table__pager-btn--prev" type="button" :disabled="pageComputed <= 1"
            @click="setPage(pageComputed - 1)">
            <span class="icon icon-prev-page icon-16"></span>
          </button>

          <!-- Range -->
          <span class="ms-table__pager-range">
            <span class="ms-table__pager-range-number">{{ rangeFrom }}</span>
            &nbsp;đến&nbsp;
            <span class="ms-table__pager-range-number">{{ rangeTo }}</span>
          </span>

          <!-- Sau -->
          <button class="ms-table__pager-btn ms-table__pager-btn--next" type="button"
            :disabled="pageComputed >= totalPages" @click="setPage(pageComputed + 1)">
            <span class="icon icon-next-page icon-16"></span>
          </button>

          <!-- Cuối -->
          <button class="ms-table__pager-btn ms-table__pager-btn--last" type="button"
            :disabled="pageComputed >= totalPages" @click="setPage(totalPages)">
            <span class="icon icon-last-page icon-16"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  selectable: { type: Boolean, default: true },
  rowKey: { type: [String, Function], default: "" },

  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 50 }, // ✅ mặc định 50
  total: { type: Number, default: 0 },
  pageSizes: { type: Array, default: () => [50, 100, 200] },

  serverSide: { type: Boolean, default: false },
});

const emit = defineEmits([
  "selected-rows-change",
  "row-click",
  "update:page",
  "update:pageSize",
  "sort-change",
]);

// ----- key & sort -----
const headCheckboxRef = ref(null);
const selectedKeys = ref(new Set());
const sortField = ref("");
const sortDir = ref("");

// pageSize dùng cho <select>, luôn sync với props.pageSize
const internalPageSize = ref(props.pageSize || 50);

// cập nhật khi parent đổi pageSize (ví dụ load lại trang)
watch(
  () => props.pageSize,
  (val) => {
    if (val && val !== internalPageSize.value) {
      internalPageSize.value = val;
    }
  },
  { immediate: true }
);

// ----- helpers & computed -----
function getKey(row, idx) {
  if (typeof props.rowKey === "function") return props.rowKey(row);
  if (typeof props.rowKey === "string" && props.rowKey) return row[props.rowKey];
  return idx;
}

const rowsWithKey = computed(() =>
  (props.rows || []).map((r, i) => ({ ...r, __key: getKey(r, i) }))
);

const pageSizesComputed = computed(() => {
  const arr = (props.pageSizes || []).filter(Boolean);
  return arr.length ? arr : [50, 100, 200];
});

const totalComputed = computed(
  () => props.total || rowsWithKey.value.length
);

const pageComputed = computed(() => props.page || 1);

const pageSizeComputed = computed(() => internalPageSize.value);

const sortedRows = computed(() => {
  if (props.serverSide || !sortField.value || !sortDir.value) {
    return rowsWithKey.value;
  }

  const field = sortField.value;
  const dir = sortDir.value;

  return [...rowsWithKey.value].sort((a, b) => {
    const va = a[field];
    const vb = b[field];

    if (va == null && vb == null) return 0;
    if (va == null) return dir === "asc" ? -1 : 1;
    if (vb == null) return dir === "asc" ? 1 : -1;
    if (va === vb) return 0;

    return va > vb ? (dir === "asc" ? 1 : -1) : dir === "asc" ? -1 : 1;
  });
});

const pagedRows = computed(() => {
  if (props.serverSide) return sortedRows.value;
  const start = (pageComputed.value - 1) * pageSizeComputed.value;
  return sortedRows.value.slice(start, start + pageSizeComputed.value);
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalComputed.value / pageSizeComputed.value))
);

const rangeFrom = computed(() =>
  totalComputed.value === 0
    ? 0
    : (pageComputed.value - 1) * pageSizeComputed.value + 1
);

const rangeTo = computed(() =>
  Math.min(pageComputed.value * pageSizeComputed.value, totalComputed.value)
);

// ----- selection -----
function isSelected(key) {
  return selectedKeys.value.has(key);
}

function emitSelectedRows() {
  const selected = rowsWithKey.value.filter((r) =>
    selectedKeys.value.has(r.__key)
  );
  emit("selected-rows-change", selected);
}

function toggleRow(rowWrap) {
  if (!props.selectable) return;
  const k = rowWrap.__key;
  if (selectedKeys.value.has(k)) selectedKeys.value.delete(k);
  else selectedKeys.value.add(k);
  emitSelectedRows();
}

function onRowClick(rowWrap) {
  toggleRow(rowWrap);
  emit("row-click", rowWrap);
}

const allPageSelected = computed(() => {
  if (!pagedRows.value.length) return false;
  return pagedRows.value.every((r) => selectedKeys.value.has(r.__key));
});

const somePageSelected = computed(() => {
  if (!pagedRows.value.length) return false;
  return (
    pagedRows.value.some((r) => selectedKeys.value.has(r.__key)) &&
    !allPageSelected.value
  );
});

function toggleSelectAllPage(e) {
  const checked = e.target.checked;
  if (checked) {
    pagedRows.value.forEach((r) => selectedKeys.value.add(r.__key));
  } else {
    pagedRows.value.forEach((r) => selectedKeys.value.delete(r.__key));
  }
  emitSelectedRows();
}

watch(somePageSelected, (v) => {
  if (headCheckboxRef.value) headCheckboxRef.value.indeterminate = v;
});

// ----- sorting -----
function toggleSort(col) {
  if (sortField.value !== col.field) {
    sortField.value = col.field;
    sortDir.value = "asc";
  } else if (sortDir.value === "asc") {
    sortDir.value = "desc";
  } else if (sortDir.value === "desc") {
    sortDir.value = "";
  } else {
    sortDir.value = "asc";
  }

  emit("sort-change", {
    field: sortField.value,
    direction: sortDir.value || null,
  });
}

// ----- pagination -----
function setPage(p) {
  const safe = Math.min(Math.max(1, p), totalPages.value);
  emit("update:page", safe);
}

function onChangePageSize() {
  const s = Number(internalPageSize.value || 50);
  emit("update:pageSize", s);
  emit("update:page", 1);
}
</script>
