<template>
  <RouterView />
  <MsToastContainer />
  <MsConfirmDialog />
</template>

<script setup>
import { RouterView } from "vue-router";
import MsToastContainer from "@/components/ms-toast/MsToastContainer.vue";
import MsConfirmDialog from "@/components/ms-dialog/MsConfirmDialog.vue";
</script>

<style>
#app {
  height: 100%;
}
</style>
