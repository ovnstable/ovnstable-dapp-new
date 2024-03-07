<template>
  <div class="account-modal-chains__chain-data-container">
    <div
      v-for="chain in availableChains"
      :key="chain"
      @click="setWalletNetwork(chain.toLowerCase())"
      @keydown.enter="setWalletNetwork(chain.toLowerCase())"
      class="account-modal__chain-data"
      :class="{ selected: (chain as any).toLowerCase() === networkName }"
    >
      <BaseIcon
        :name="chain.toLowerCase()"
        class="account-modal-chains__icon"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { appNetworksData } from '@/utils/const.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { mapActions, mapGetters } from 'vuex';
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
    ...mapGetters('network', ['networkName']),
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
    ...mapActions('network', ['setWalletNetwork']),

  },
};
</script>

<style lang="scss" scoped>

.account-modal-chains__chain-data-container {
  max-height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

.account-modal__chain-data {
  svg {
    width: 24px;
    height: 24px;
    filter: grayscale(10);
    opacity: .6;
  }
}
.selected {
  color: var(--color-3);
  border-color: var(--color-1);

  svg {
    opacity: 1;
    filter: unset;
  }
}
.account-modal-chains__icon:hover {
  opacity: 0.8;
  cursor: pointer;
}
</style>
