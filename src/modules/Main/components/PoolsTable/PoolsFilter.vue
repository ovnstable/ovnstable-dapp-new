<template>
  <div class="pools-wrap__filters">
    <div class="pools-wrap__tabs">
      <SwitchTabs
        :tabs="filterTabs"
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
        v-for="networkConfig in allNetworkConfigs"
        :key="networkConfig.networkId"
        @click="changeNetwork(networkConfig.networkId)"
        @keypress="changeNetwork(networkConfig.networkId)"
        :class="selectedNetwork.includes(networkConfig.networkId) ? 'pools-wrap__filters-item--selected' : ''"
        class="pools-wrap__filters-item"
      >
        <BaseIcon :name="networkConfig.networkName" />
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
import { poolTypes } from '@/modules/Main/components/PoolsTable/types/index.ts';
import { mapGetters } from 'vuex';

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
  },
  data() {
    return {
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
          name: 'FEATURED',
        },
      ],
    };
  },
  computed: {
    ...mapGetters('network', ['allNetworkConfigs']),
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
}

.pools-wrap__filters-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin: 0 4px;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: .2s ease color;

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

  svg {
    opacity: 1;
    filter: unset;
  }
}

.search-icon {
  min-width: 18px;
  margin-left: 6px;
  fill: var(--color-2);
  [data-theme="dark"] & {
    fill: var(--color-3);
  }
}
.pools-wrap__filters-networks {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
</style>
