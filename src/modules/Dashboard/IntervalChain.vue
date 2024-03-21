<template>
  <div class="dashboard__chains-interval">
    <div>
      <DashboardGraphicInterval
        :selectedInterval="currentInterval"
        :intervals="['ALL TIME', 'MONTH', 'WEEK', 'DAY']"
        @update-interval="updateInterval"
      />
    </div>

    <div class="dashboard__chain-data-container">
      <div
        v-for="chain in availableChains"
        :key="chain"
        @click="saveNetworkToLocalStore(chain)"
        @keydown.enter="saveNetworkToLocalStore(chain)"
        class="dashboard__chain-data"
        :class="{ selected: (chain as any).toLowerCase() === networkName }"
      >
        <BaseIcon
          :name="chain.toLocaleLowerCase()"
          class="dashboard__icon-chain-bottom"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DashboardGraphicInterval from '@/modules/Dashboard/DashboardGraphicInterval.vue';
import { appNetworksData } from '@/utils/const.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';

export default {
  name: 'IntervalChain',
  components: {
    DashboardGraphicInterval,
    BaseIcon,
  },
  data() {
    return {
      currentInterval: 'DAY',
      myChart: null,
      networksData: appNetworksData,
    };
  },
  computed: {
    networkName() {
      return this.$store.state.network.dashboardNetwork;
    },
    availableChains() {
      const availableNetworks = Object.entries(chainContractsMap)
        .reduce((acc: string[], [network, contracts]: [string, any]) => {
          if (contracts.usdPlus) {
            acc.push(network.charAt(0).toUpperCase() + network.slice(1));
          }
          return acc;
        }, []);

      return availableNetworks;
    },
  },

  methods: {
    saveNetworkToLocalStore(chain:string) {
      this.$store.dispatch('network/changeDashboardNetwork', chain.toLowerCase());
    },
    updateInterval(newInterval: string) {
      this.currentInterval = newInterval;
      this.$store.dispatch('intervalDashboard/setInterval', this.currentInterval);
    },

  },
};
</script>

<style lang="scss" scoped>
.dashboard__chains-interval {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
   flex-wrap: wrap;
}

.dashboard__chain-data-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.dashboard__chain-data {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  margin: 0 4px;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: .2s ease color;
  border: 1px solid var(--color-5);
  border-radius: 50%;

  svg {
    width: 24px;
    height: 24px;
    filter: grayscale(10);
    opacity: .5;
  }

  &:hover {
    color: var(--color-3);
  }
  [data-theme="dark"] & {
    color: var(--color-1);
  }
}

.selected {
  color: var(--color-3);
  border-color: var(--color-6);

  svg {
    opacity: 1;
    filter: unset;
  }
}

.dashboard__chain-data:hover {
  cursor: pointer;
  border-color: var(--color-1);
  background: var(--color-6);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
    background: var(--color-7);
  }
}
@media (max-width: 1024px) {
  .dashboard__chains-interval {
    flex-direction: column;
  }
  .dashboard__chain-data-container {
    justify-content: space-between;
    margin-top: 10px;
  }
}

@media (max-width: 640px) {
  .dashboard__chains-interval {
    flex-direction: column;
  }
  .dashboard__chain-data-container {
    margin-top: 10px;
  }
  .dashboard__chain-data {
    margin: 0;
  }
  .dashboard__chain-data-container {
    margin-top: 22px;
    justify-content: space-between;
  }
}
</style>
