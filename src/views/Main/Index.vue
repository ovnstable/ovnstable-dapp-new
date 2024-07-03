<template>
  <div class="main-module">
    <MainModule />
    <PoolsContainer
      :isOverview="false"
    />
  </div>
</template>

<script lang="ts">
import MainModule from '@/modules/Main/Index.vue';
import PoolsContainer from '@/modules/Main/components/Pools/Index.vue';

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
  @media (max-width: 1320px) and (min-width: 1024px) {
    width: 80%;
  }
}
</style>
