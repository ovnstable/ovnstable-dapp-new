<template>
  <div class="pos">
    <PoolsPositions />
  </div>
</template>

<script lang="ts">
import PoolsPositions from '@/modules/PoolsPositions/Index.vue';

export default {
  name: 'PoolsView',
  components: {
    PoolsPositions,
  },
};
</script>

<style>
.pos {
  width: 100%;
}
</style>
