<template>
  <div class="pos-wrap">
    <div
      v-if="type === 'POSITIONS'"
      class="heading-row"
    >
      <h1>MY POSITIONS</h1>
      <p>View and manage your open V2 and V3 positions.</p>
    </div>
    <div
      v-if="type === 'POOLS'"
      class="heading-row"
    >
      <h1>ALL POOLS</h1>
      <p>Use your Tokens+ and OVN in DeFi to maximize your yield.</p>
    </div>
    <div v-if="type === 'POOLS'">
      <Pools
        :is-overview="false"
      />
    </div>
    <div v-if="type === 'POSITIONS'">
      <Positions />
      <ZapModal
        :zap-pool="currentZapPool"
        :is-show="isZapModalShow"
        @toggle-modal="setIsZapModalShow"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Positions from '@/modules/PoolsPositions/Positions/Index.vue';
import Pools from '@/modules/PoolsPositions/Pools/Index.vue';
import { mapActions, mapState } from 'vuex';
import ZapModal from '@/modules/PoolsPositions/ZapModal/Index.vue';

export default {
  name: 'PoolsPositions',
  components: {
    Positions,
    ZapModal,
    Pools,
  },
  data() {
    return {
      type: window.location.pathname.split('/').pop()?.toUpperCase(),
    };
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
.heading-row {
  margin-bottom: 35px;
  color: var(--color-1);
  font-size: 16px;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  p {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  h1 {
    font-size: 26px;
    font-weight: 800;
  }
}

.pos-wrap {
  width: 100%;
}
</style>
