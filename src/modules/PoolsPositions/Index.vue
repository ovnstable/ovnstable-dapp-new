<template>
  <div class="pos-wrap">
    <div
      v-if="type === 'POSITIONS'"
      class="heading-row"
    >
      <h1>MY {{ networkName?.toUpperCase() }} POSITIONS</h1>
      <p>View and manage your open V3 positions.</p>
    </div>
    <div
      v-if="type === 'POOLS'"
      class="heading-row"
    >
      <h1>POOLS</h1>
      <p>Use your Tokens+ and OVN in DeFi to maximize your yield.</p>
    </div>
    <div v-if="type === 'POOLS' && activeTab === 0">
      <div class="pools-data-container">
        <PoolFilterNew />
        <PoolsNew
          :is-overview="false"
        />
      </div>
    </div>
    <div v-if="type === 'POOLS' && activeTab === 1">
      <div class="pools-data-container">
        <PoolsOld
          :is-overview="false"
        />
      </div>
    </div>
    <div v-if="type === 'POSITIONS'">
      <Positions />
    </div>
  </div>
</template>

<script lang="ts">
import Positions from '@/modules/PoolsPositions/Positions/Index.vue';
import PoolsNew from '@/modules/PoolsPositions/Pools/PoolsNew.vue';
import PoolFilterNew from '@/components/Pools/PoolsFilter/PoolFilterNew.vue';
import PoolsOld from '@/modules/PoolsPositions/Pools/Index.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'PoolsPositions',
  components: {
    Positions,
    PoolsNew,
    PoolsOld,
    PoolFilterNew,
  },
  data() {
    return {
      activeTab: 0,
      type: window.location.pathname.split('/').pop()?.toUpperCase(),
    };
  },
  computed: {
    ...mapGetters('network', ['networkName']),
  },
};
</script>

<style lang="scss" scoped>
.heading-row {
  margin-bottom: 35px;
  color: var(--color-1);
  font-size: 16px;
  font-weight: 600;
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

.pos-wrap__tabs {
  margin-bottom: 30px;
}

.pools-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}
</style>
