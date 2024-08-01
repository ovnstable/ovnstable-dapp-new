<template>
  <div class="main-module">
    <MainModule />
  </div>
</template>

<script lang="ts">
import MainModule from '@/modules/Main/Index.vue';

export default {
  name: 'MainView',
  components: {
    MainModule,
  },
};
</script>

<style>
.main-module {
  width: 100%;
  z-index: 1;
}
</style>
