<template>
  <header class="customers-form-toolbar">
    <div class="customers-form-toolbar__left">
      <h2 class="customers-form-toolbar__title">
        {{ isEdit ? "Sửa khách hàng" : "Thêm khách hàng" }}
      </h2>

      <button class="customers-form-toolbar__layout-btn layout-btn--standard" type="button">
        Mẫu tiêu chuẩn
        <span class="icon icon-chevron-down icon-16"></span>
      </button>

      <button class="customers-form-toolbar__layout-btn layout-btn--edit" type="button">
        Sửa bố cục
      </button>
    </div>

    <div class="customers-form-toolbar__right">
      <button class="ms-btn ms-btn--ghost" type="button" @click="$emit('cancel')">
        Hủy bỏ
      </button>

      <button v-if="!isEdit" class="ms-btn ms-btn--secondary" type="button" @click="$emit('save-add')">
        Lưu và thêm
      </button>

      <button class="ms-btn ms-btn--primary" type="button" @click="$emit('save')">
        Lưu
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  isEdit: { type: Boolean, default: false },
});
defineEmits(["cancel", "save", "save-add"]);
</script>
