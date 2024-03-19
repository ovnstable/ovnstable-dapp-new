<template>
  <div class="pools-wrap__filters">
    <div class="pools-wrap__tabs">
      <SwitchTabs
        :tabs="filterTabs"
        :active-tab="poolTypes.ALL"
        type="large"
        @tab-change="changeTab"
      />
    </div>

    <InputComponent
      type="text"
      placeholder="Search token"
      input-type="primary"
      @input="updateInputSearch"
    >
      <template #prefix>
        <BaseIcon
          class="search-icon"
          name="SearchBasic"
        />
      </template>
    </InputComponent>

    <div class="pools-wrap__filters-networks">
      <div
        v-for="networkConfig in sortedChains"
        :key="networkConfig.chain"
        @click="changeNetwork(networkConfig.chain)"
        @keypress="changeNetwork(networkConfig.chain)"
        :class="selectedNetwork.includes(networkConfig.chain) ? 'pools-wrap__filters-item--selected' : ''"
        class="pools-wrap__filters-item"
      >
        <BaseIcon :name="networkConfig.name.toLowerCase()" />
      </div>
      <div
        @click="changeNetwork('all')"
        @keypress="changeNetwork('all')"
        :class="selectedNetwork.includes('ALL') ? 'pools-wrap__filters-item--selected' : ''"
        class="pools-wrap__filters-item"
      >
        SELECT ALL
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import InputComponent from '@/components/Input/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import { appNetworksData } from '@/utils/const.ts';
import { poolTypes } from '@/modules/Main/components/PoolsTable/types/index.ts';
import { sortedChainsByTVL } from '@/store/helpers/index.ts';

interface Chain {
  chainName: string;
  tvl: number;
  name: string,
  chain: number,
}

export default {
  name: 'PoolsFilter',
  components: {
    BaseIcon,
    InputComponent,
    SwitchTabs,
  },
  props: {
    selectedNetwork: {
      type: Array,
      required: false,
      default: () => [],
    },
    isShowDeprecated: {
      type: Boolean,
      required: true,
    },
  },
  async mounted() {
    this.sortedChains = await sortedChainsByTVL(this.networksData, this.isShowDeprecated);
  },
  watch: {
    async isShowDeprecated() {
      this.sortedChains = await sortedChainsByTVL(this.networksData, this.isShowDeprecated);
    },
  },
  data() {
    return {
      sortedChains: [] as Chain[],
      networksData: appNetworksData,
      poolTypes,
      filterTabs: [
        {
          id: poolTypes.ALL,
          name: 'ALL',
        },
        {
          id: poolTypes.TOKENPLUS,
          name: 'TOKEN+',
        },
        {
          id: poolTypes.OVN,
          name: 'OVN',
        },
        {
          id: poolTypes.FEATURED,
          name: 'HOT',
        },
      ],
    };
  },
  methods: {
    changeTab(val: string) {
      this.$emit('change-tab', val);
    },
    updateInputSearch(val: string) {
      this.$emit('search', val);
    },
    changeNetwork(val: number | string) {
      console.log(val);
      this.$emit('change-network', val);
    },
  },
};
</script>

<style lang="scss">

.pools-wrap__filters-item--selected {
  svg {
    path {
      fill: revert-layer;
      stroke: revert-layer;
    }
  }
}

</style>

<style lang="scss" scoped>
.pools-wrap__filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 20px;
  border-radius: 30px;
  background-color: var(--color-4);
  border: 1px solid var(--color-1);
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-color: var(--color-2);
  }

  @media (max-width: 1240px) {
    flex-wrap: wrap;
  }
  @media (max-width: 400px) {
    position: sticky;
    left: 0;
  }
}
.pools-wrap__filters-item {
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
.pools-wrap__filters-item:last-child {
  border: none;
}
.pools-wrap__filters-item--selected {
  color: var(--color-3);
  border-color: var(--color-6);

  svg {
    opacity: 1;
    filter: unset;
  }
}

.search-icon {
  min-width: 18px;
  margin-left: 10px;
  fill: var(--color-2);
  [data-theme="dark"] & {
    fill: var(--color-3);
  }
}
.pools-wrap__filters-networks {
  display: flex;
  margin-left: auto;

  @media (max-width: 1240px) {
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }
}

@media (max-width: 400px) {
  .pools-wrap__tabs {
    width: 100%;
  }
}

</style>
