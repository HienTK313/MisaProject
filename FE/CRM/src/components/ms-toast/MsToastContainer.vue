<!-- src/components/ms-toast/MsToastContainer.vue -->
<template>
  <div class="ms-toast-container">
    <TransitionGroup name="ms-toast-anim" tag="div" class="ms-toast-stack">
      <div v-for="t in toastState.items" :key="t.id" class="ms-toast" :class="`ms-toast--${t.type}`" role="status"
        aria-live="polite">
        <div class="ms-toast__icon" aria-hidden="true"></div>

        <div class="ms-toast__content">
          <div class="ms-toast__message">{{ t.message }}</div>
        </div>

        <button v-if="t.closable" class="ms-toast__close" type="button" aria-label="close" @click="removeToast(t.id)">
          ×
        </button>

        <!-- progress bar -->
        <div v-if="t.duration > 0" class="ms-toast__bar" :style="{ animationDuration: t.duration + 'ms' }"></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { toastState, removeToast } from "./toastStore";
</script>
