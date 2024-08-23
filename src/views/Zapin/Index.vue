<template>
  <div class="main-module">
    <ZapinModule />
  </div>
</template>

<script lang="ts">
import ZapinModule from '@/modules/ZapinPage/Index.vue';

export default {
  name: 'ZapinView',
  components: {
    ZapinModule,
  },
};
</script>

<style>
.main-module {
  width: 100%;
  z-index: 1;
}
</style>
