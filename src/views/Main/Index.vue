<template>
  <div class="main-module">
    <MainModule />
    <PoolsContainer
      :type="'ALL'"
      :isOverview="false"
    />
  </div>
</template>

<script lang="ts">
import MainModule from '@/modules/Main/Index.vue';
import PoolsContainer from '@/modules/Main/components/PoolsTable/Index.vue';

export default {
  name: 'MainView',
  components: {
    MainModule,
    PoolsContainer,
  },
};
</script>

<style>
.main-module {
  width: 100%;
  z-index: 1;
}
</style>
