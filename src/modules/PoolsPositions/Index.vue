<template>
  <div>
    <div>
      <h1>MY POSITIONS</h1>
    </div>
    <Positions />

    <ZapModal
      :zap-pool="currentZapPool"
      :is-show="isZapModalShow"
      @toggle-modal="setIsZapModalShow"
    />
  </div>
</template>

<script lang="ts">
import Positions from '@/modules/PoolsPositions/Positions/Index.vue';
import ZapModal from '@/modules/PoolsPositions/ZapModal/Index.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'PoolsPositions',
  components: {
    Positions,
    ZapModal,
  },
  computed: {
    ...mapState('poolsData', [
      'currentZapPool',
      'isZapModalShow',
    ]),
  },
  methods: {
    ...mapActions('poolsData', ['setIsZapModalShow']),
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
