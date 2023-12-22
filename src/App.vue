<template>
  <div class="app-wrapper">
    <Header />

    <div class="container">
      <Sidebar />
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from '@/components/Layout/Header/Index.vue';
import Sidebar from '@/components/Layout/Sidebar/Index.vue';
</script>

<style scoped>
.app-wrapper {
  width: 100vw;
}
.container {
  width: 100%;
  max-width: 1360px;
  padding: 0 20px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
</style>
