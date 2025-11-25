<template>
  <teleport to="body">
    <div v-if="dialogState.open" class="ms-dialog-backdrop">
      <section class="ms-dialog" role="dialog" aria-modal="true">
        <header class="ms-dialog__header">
          <h3 class="ms-dialog__title">{{ dialogState.title }}</h3>
        </header>

        <div class="ms-dialog__body">
          <p class="ms-dialog__message">
            {{ dialogState.message }}
          </p>
        </div>

        <footer class="ms-dialog__footer">
          <button type="button" class="ms-btn ms-btn--ghost" @click="onCancel">
            {{ dialogState.cancelText }}
          </button>

          <button type="button" class="ms-btn ms-btn--primary" @click="onConfirm">
            {{ dialogState.confirmText }}
          </button>
        </footer>
      </section>
    </div>
  </teleport>
</template>

<script setup>
import { dialogState, closeConfirm } from "./dialogStore";

function onCancel() {
  closeConfirm(false);
}

function onConfirm() {
  closeConfirm(true);
}
</script>

<style scoped>
.ms-dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.ms-dialog {
  width: 420px;
  max-width: calc(100% - 32px);
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ms-dialog__header {
  padding: 16px 20px 8px;
}

.ms-dialog__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.ms-dialog__body {
  padding: 0 20px 16px;
}

.ms-dialog__message {
  margin: 0;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

.ms-dialog__footer {
  padding: 12px 16px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* dùng lại style ms-btn hiện có, chỉ đảm bảo 32px */
.ms-btn {
  min-width: 80px;
  height: 32px;
  padding: 0 12px;
}
</style>
