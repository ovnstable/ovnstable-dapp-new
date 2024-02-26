<template>
  <div class="account-modal-chains__chain-data-container">
    <div
      v-for="chain in availableChains"
      :key="chain"
      @click="saveNetworkToLocalStore(chain)"
      @keydown.enter="saveNetworkToLocalStore(chain)"
      :class="{ selected: (chain as any).toLowerCase() === networkName }"
    >
      <BaseIcon
        :name="getIconName(chain)"
        class="account-modal-chains__icon"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { appNetworksData } from '@/utils/const.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';

export default {
  name: 'ChainsSelection',
  components: {
    BaseIcon,
  },
  data() {
    return {
      networksData: appNetworksData,
    };
  },
  computed: {
    networkName() {
      return this.$store.state.network.accountModalNetwork;
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
      this.$store.dispatch('network/changeAccountModalNetwork', chain.toLowerCase());
    },
    getIconName(chain:string) {
      const selectedChain = this.$store.state.network.accountModalNetwork;
      const formattedChain = chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase();

      if (chain.toLowerCase() !== selectedChain.toLowerCase()) {
        return `Icon${formattedChain}Off`;
      }

      return `Icon${formattedChain}On`;
    },

  },
};
</script>

<style lang="scss" scoped>

.account-modal-chains__chain-data-container {
  max-width: 178px;
  max-height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

.account-modal-chains__icon:hover {
  opacity: 0.5;
  cursor: pointer;
}
</style>
