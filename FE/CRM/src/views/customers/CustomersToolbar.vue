<!-- src/views/customers/CustomersToolbar.vue -->
<!-- src/views/customers/CustomersToolbar.vue -->
<template>
  <div class="customers-toolbar">
    <div class="toolbar-left">
      <button class="customer-filter" type="button">
        <span class="icon icon-folder icon-16"></span>
        <span class="customer-filter__text">Tất cả khách hàng</span>
        <span class="icon icon-chevron-down icon-16"></span>
      </button>

      <a href="#" class="ms-link" @click.prevent="emit('edit-list')">Sửa</a>

      <button class="toolbar-reload-btn" type="button" aria-label="Reload" @click="emit('reload')">
        <span class="icon icon-reload icon-16"></span>
      </button>

      <button v-show="selectedCount > 0" class="toolbar-delete-btn" type="button" aria-label="Delete selected"
        @click="emit('delete-selected')">
        <span class="icon icon-delete icon-16"></span>
      </button>
    </div>

    <div class="toolbar-right">
      <div class="crm-ai-search-container">
        <span class="icon-search crm-ai-search-icon"></span>
        <input v-model="kw" class="crm-ai-search-input" placeholder="Tìm kiếm thông minh" />
        <span class="crm-ai-badge icon-16"></span>
      </div>

      <button class="crm-ai-tool-btn" type="button" aria-label="Tool">
        <span class="icon-ai-customer icon-16"></span>
      </button>

      <MsButton class="btn-add" variant="primary" @click="emit('add')">
        <template #icon-left>
          <span class="icon icon-plus icon-16"></span>
        </template>
        Thêm
      </MsButton>

      <MsButton class="btn-import" variant="ghost" @click="emit('import')">
        <template #icon-left>
          <span class="icon icon-import icon-16"></span>
        </template>
        Nhập từ Excel
      </MsButton>

      <button class="toolbar-btn-36" type="button" aria-label="More">
        <span class="icon icon-menu icon-16"></span>
      </button>

      <button class="toolbar-btn-55" type="button" aria-label="List">
        <span class="icon icon-dropdown icon-16"></span>
        <span class="icon icon-chevron-down icon-16"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import MsButton from "@/components/ms-button/MsButton.vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  selectedCount: { type: Number, default: 0 },
});

const emit = defineEmits([
  "update:modelValue",
  "add",
  "import",
  "edit-list",
  "reload",
  "delete-selected",
]);

const kw = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>
