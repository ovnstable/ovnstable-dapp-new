<template>
  <div class="dashboard__chains-interval">
    <div>
      <DashboardGraphicInterval
        :selectedInterval="currentInterval"
        :intervals="['ALL TIME', 'MONTH', 'WEEK', 'DAY']"
        @update:interval="updateInterval"
      />
    </div>

    <div class="dashboard__chain-data-container">
      <div
        v-for="chain in availableChains"
        :key="chain"
        @click="saveNetworkToLocalStore(chain)"
        @keydown.enter="saveNetworkToLocalStore(chain)"
        class="insurance__chain-data"
        :class="{ selected: (chain as any).toLowerCase() === networkName }"
      >
        <BaseIcon
          :name="getIconName(chain)"
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
    getIconName(chain:string) {
      const selectedChain = this.$store.state.network.dashboardNetwork;
      const formattedChain = chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase();

      if (chain.toLowerCase() !== selectedChain.toLowerCase()) {
        return `Icon${formattedChain}Off`;
      }

      return `Icon${formattedChain}On`;
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
}

.dashboard__chain-data-container {
  max-width: 178px;
  max-height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

.dashboard__icon-chain-bottom:hover {
  cursor: pointer;
}
</style>
