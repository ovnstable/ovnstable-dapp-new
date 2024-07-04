<template>
  <div>
    <div>
      <h1>MY POSITIONS</h1>
    </div>
    <Positions />
  </div>
</template>

<script lang="ts">
import Positions from '@/modules/PoolsPositions/Positions/Index.vue';

export default {
  name: 'PoolsPositions',
  components: {
    Positions,
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-1);
  margin-bottom: 35px;
}
</style>
