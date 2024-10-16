<template v-if="sortedChains.length > 0">
  <div class="pool-filter-wrapper">
    <div class="pool-filter-description">
      Select options to search perfect pool for you!
    </div>
    <div class="filter-container">
      <div class="filter-container__top">
        <div class="token-input-wrap">
          <InputComponent
            :value="tokenSearch"
            is-text
            input-type="primary"
            placeholder="Search pools by token"
            full-width
            @input="searchTokens"
          >
            <template #prefix>
              <BaseIcon
                class="search-icon"
                name="SearchBasic"
              />
            </template>
          </InputComponent>
        </div>
        <div class="network-filter-wrap">
          <div class="pools-wrap__filters-networks">
            <div
              :class="activeChain === 'ALL' ? 'pools-wrap__filters-item--selected' : ''"
              @click="handleClickChain('ALL')"
              @keypress="handleClickChain('ALL')"
            >
              All
            </div>
            <div
              v-for="networkConfig in sortedChains"
              :key="networkConfig.chainId"
              :class="activeChain === networkConfig.chainId ? 'pools-wrap__filters-item--selected' : ''"
              class="pools-wrap__filters-item"
              @click="handleClickChain(networkConfig.chainId)"
              @keypress="handleClickChain(networkConfig.chainId)"
            >
              <BaseIcon :name="networkConfig.name.toLowerCase()" />
            </div>
          </div>
        </div>
        <div class="button-container">
          <!-- <ButtonComponent
            id="search-btn"
            class="search-button"
            btn-styles="faded"
            @click="handleClickSearch"
            @keypress="handleClickSearch"
          >
            SEARCH POOLS
          </ButtonComponent> -->
          <ButtonComponent
            class="search-button"
            btn-styles="faded"
            @click="handleClickResetFilter"
            @keypress="handleClickResetFilter"
          >
            CLEAR FILTER
          </ButtonComponent>
        </div>
      </div>
      <div class="filter-container__bottom">
        <h2>Platforms</h2>
        <div class="filter-container__plat">
          <div
            v-for="item in platformsList"
            :key="item"
            class="filter-container__plat-item"
            :class="{ active: activePlat === item }"
            @click="filterByPlat(item)"
            @keypress="filterByPlat(item)"
          >
            <BaseIcon
              v-if="item !== 'ALL'"
              :name="item"
            />
            <span v-if="item === 'ALL'">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ButtonComponent from '@/components/Button/Index.vue';
import { mapActions, mapState } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import InputComponent from '@/components/Input/Index.vue';

// import SelectTokensModal from '@/components/TokensModal/Index.vue';
import { computed } from 'vue';
import { useTokensQuery, useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import { debounce } from 'lodash';
import type { TTokenInfo } from '@/types/common/tokens';
import type { TFilterPoolsParams } from '@/types/common/pools';

const initSelectedToken = {
  symbol: 'USD+',
};

export const networkList = [
  {
    chainId: 8453,
    name: 'Base',
    enabled: false,
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    enabled: false,
  },
];

export default {
  name: 'PoolFilter',
  components: {
    ButtonComponent,
    BaseIcon,
    InputComponent,
  },
  setup: () => {
    const {
      data: allTokensList,
      isLoading,
      isBalancesLoading,
    } = useTokensQueryNew();

    const { data: balancesList } = useTokensQuery();

    return {
      allTokensList: computed(
        () => allTokensList.value.filter((token: TTokenInfo) => token.isPoolToken),
      ),
      balancesList,
      isLoading,
      isAllDataLoaded: computed(() => !isLoading.value),
      isBalancesLoading,
    };
  },
  data() {
    return {
      selectedTokens: [initSelectedToken] as Partial<TTokenInfo>[],
      tokenSearch: 'USD+',
      sortedChains: networkList,
      activePlat: 'ALL',
      platformsList: ['ALL', 'Aerodrome', 'Pancake', 'Uniswap'],
    };
  },
  computed: {
    ...mapState('poolsData', ['activeChain']),
  },
  methods: {
    ...mapActions('poolsData', ['setFilterParams', 'setFilterChain', 'setFilterPlat']),
    filterByPlat(val: string) {
      this.activePlat = val;
      this.setFilterPlat(val);
    },
    searchTokens(val: string) {
      this.tokenSearch = val;
      this.handleDebounceSearch();
    },
    handleDebounceSearch: debounce(
      function debounceSearch(this: any) { this.handleClickSearch(); },
      1000,
    ),
    handleClickChain(chain: number | string) {
      this.setFilterChain(chain);
    },
    handleClickSearch() {
      const filterParams: Partial<TFilterPoolsParams> = {
        search: this.tokenSearch ?? '',
        // token1: this.selectedTokens[1]?.symbol ?? '',
      };
      this.setFilterParams(filterParams);
    },
    handleClickResetFilter() {
      const filterParams: Partial<TFilterPoolsParams> = {
        search: '',
      };
      this.setFilterParams(filterParams);
      this.selectedTokens = [];
      this.tokenSearch = '';
    },
  },
};
</script>
<style lang="scss" src="./stylesFilterNew.scss" scoped />
