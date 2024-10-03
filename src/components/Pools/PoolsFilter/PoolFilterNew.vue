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
          <ButtonComponent
            id="search-btn"
            class="search-button"
            btn-styles="faded"
            @click="handleClickSearch"
            @keypress="handleClickSearch"
          >
            SEARCH POOLS
          </ButtonComponent>
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
            class="filter-container__plat-item"
            :class="{ active: activePlat === item }"
            :key="item"
            @click="filterByPlat(item)"
          >
            <BaseIcon v-if="item !== 'ALL'" :name="item" />
            <span v-if="item === 'ALL'">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <SelectTokensModal
    :is-show="isShowTokensModal"
    :select-token-input="true"
    :tokens="mergedTokenList"
    :is-all-data-loaded="isAllDataLoaded"
    :selected-tokens="selectedTokens"
    :balances-loading="isLoading"
    :user-account="account"
    :is-overnight-first="false"
    remove-native
    :token0-name="`Token ${selectingTokenIndex}`"
    :max-token-count="1"
    @set-show="toggleShowTokensModal"
    @add-token-to-list="toggleSelectToken"
    @remove-token-from-list="toggleSelectToken"
  /> -->
</template>

<script lang="ts">
import ButtonComponent from '@/components/Button/Index.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import InputComponent from '@/components/Input/Index.vue';

// import SelectTokensModal from '@/components/TokensModal/Index.vue';
import { computed } from 'vue';
import { useTokensQuery, useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import type { TTokenInfo } from '@/types/common/tokens';
import type { TFilterPoolsParams } from '@/types/common/pools';

type TSelectTokenWithSearch = {
    isInput: boolean,
    tokenData: Partial<TTokenInfo>
}

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
      tokenSearch: "USD+",
      sortedChains: networkList,
      isShowTokensModal: false as boolean,
      activePlat: "ALL",
      platformsList: ["ALL", "Aerodrome", "Pancake"],
      selectingTokenIndex: 1 as Number,
    };
  },
  computed: {
    ...mapGetters('accountData', ['account']),
    ...mapState('poolsData', ['activeChain']),
    mergedTokenList() {
      return mergedTokens(this.balancesList as any[], this.allTokensList);
    },
  },
  mounted() {
    if (!window) return;
    window.addEventListener("keydown",  (e) => { if (13 == e.keyCode) { this.handleClickSearch() } });
  },
  methods: {
    ...mapActions('poolsData', ['setFilterParams', 'setFilterChain', 'setFilterPlat']),
    filterByPlat(val: string) {
      this.activePlat = val
      this.setFilterPlat(val);
    },
    toggleShowTokensModal(tokenToSelect: number) {
      this.isShowTokensModal = !this.isShowTokensModal;
      this.selectingTokenIndex = tokenToSelect;
    },
    searchTokens(val: string) {
      this.tokenSearch = val;
    },
    toggleSelectToken(newToken: TSelectTokenWithSearch) {
      const selectedToken = newToken.tokenData;
      this.selectedTokens[Number(this.selectingTokenIndex) - 1] = selectedToken;
      this.isShowTokensModal = false;
      const filterParams: Partial<TFilterPoolsParams> = {
        token0: this.tokenSearch,
        // token1: this.selectedTokens[1]?.symbol ?? '',
      };
      this.setFilterParams(filterParams);
    },
    handleClickChain(chain: number | string) {
      this.setFilterChain(chain);
    },
    handleClickSearch() {
      const filterParams: Partial<TFilterPoolsParams> = {
        token0: this.tokenSearch ?? '',
        // token1: this.selectedTokens[1]?.symbol ?? '',
      };
      this.setFilterParams(filterParams);
    },
    handleClickResetFilter() {
      const filterParams: Partial<TFilterPoolsParams> = {
        token0: '',
        token1: '',
      };
      this.setFilterParams(filterParams);
      this.selectedTokens = [];
    },
  },
};
</script>
<style lang="scss" src="./stylesFilterNew.scss" scoped />
