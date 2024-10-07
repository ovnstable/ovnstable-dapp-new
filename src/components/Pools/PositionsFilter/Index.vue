<template>
  <div class="pools-wrap__filters">
    <div class="pools-wrap__tabs">
      <SwitchTabs
        :tabs="filterTabs"
        :active-tab="poolTypes.ALL"
        tab-style="transparent"
        type="large"
        @tab-change="changeTab"
      />
    </div>

    <div class="pools-wrap__search">
      <InputComponent
        type="text"
        placeholder="Search position"
        input-type="primary"
        :value="searchQuery"
        @input="updateInputSearch"
      >
        <template #prefix>
          <BaseIcon
            class="search-icon"
            name="SearchBasic"
          />
        </template>
      </InputComponent>
      <div class="pools-wrap__search-sw">
        Switch chain to see another chain positions
        <BaseIcon :name="networkName"/>
      </div>
    </div>

    <!-- <div class="pools-wrap__filters-networks">
      <div
        :class="selectedNetwork.length === 0 ? 'pools-wrap__filters-item--selected' : ''"
        class="pools-wrap__filters-item"
        @click="changeNetwork('ALL')"
        @keypress="changeNetwork('ALL')"
      >
        ALL
      </div>
      <div
        v-for="networkConfig in sortedChains"
        :key="networkConfig.chain"
        class="pools-wrap__filters-item"
        @click="changeNetwork(networkConfig.chain)"
        @keypress="changeNetwork(networkConfig.chain)"
      >
        <BaseIcon :name="networkConfig.name.toLowerCase()" />
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import InputComponent from '@/components/Input/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import { appNetworksData } from '@/utils/const.ts';
import { sortedChainsByTVL } from '@/store/helpers/index.ts';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import { mapGetters } from 'vuex';

interface Chain {
  chainName: string;
  tvl: number;
  name: string,
  chain: number,
}

export default {
  name: 'PositionsFilter',
  components: {
    BaseIcon,
    InputComponent,
    SwitchTabs,
  },
  props: {
    isShowDeprecated: {
      type: Boolean,
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sortedChains: [] as Chain[],
      networksData: appNetworksData,
      poolTypes: POOL_TYPES,
      filterTabs: [],
    };
  },
  async mounted() {
    this.sortedChains = await sortedChainsByTVL(
      this.networksData,
      this.isShowDeprecated,
    );
  },
  computed: {
    ...mapGetters('network', ['networkName']),
  },
  methods: {
    changeTab(val: string) {
      this.$emit('change-tab', val);
    },
    updateInputSearch(val: string) {
      this.$emit('search', val);
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

  @media (max-width: 1400px) {
    flex-wrap: wrap;
  }

  @media (max-width: 1320px) {
    position: sticky;
    left: 0;
  }
  @media (max-width: 1024px) {
    position: sticky;
    flex-wrap: wrap;
    left: 0;
  }
  @media (max-width: 640px) {
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
  margin: 0 2px;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: .2s ease color;
  border: 1px solid var(--color-5);
  border-radius: 50%;
  color: var(--color-2);
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
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  width: 30%;

  @media (max-width: 1340px) {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .pools-wrap__tabs {
    width: 100%;
  }
}

.pools-wrap__search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 150px;
  width: 100%;
  margin-bottom: 20px;

  .input-component {
    background-color: transparent;
  }
}

.pools-wrap__search-sw {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;

  svg {
    width: 24px;
    height: 24px;
  }
}
</style>
