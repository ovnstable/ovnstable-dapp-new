<template>
  <div class="main-module">
    <MainModule />
    <PoolsContainer
      :type="poolTypes.ALL"
      :isOverview="false"
    />
  </div>
</template>

<script lang="ts">
import MainModule from '@/modules/Main/Index.vue';
import PoolsContainer from '@/modules/Main/components/PoolsTable/Index.vue';
import { poolTypes } from '@/modules/Main/components/PoolsTable/types/index.ts';

export default {
  name: 'MainView',
  components: {
    MainModule,
    PoolsContainer,
  },
  data() {
    return {
      poolTypes,
    };
  },
};
</script>

<style>
.main-module {
  width: 100%;
  z-index: 1;
}
</style>
