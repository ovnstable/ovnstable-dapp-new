<template v-if="sortedChains.length > 0">
  <div class="pool-filter-wrapper">
    <div class="pool-filter-description">
      Select options to search perfect pool for you!
    </div>
    <div class="filter-container">
      <div class="token-input-wrap">
        <ButtonComponent
          class="token-select-input"
          btn-styles="faded"
          @click="() => toggleShowTokensModal(1)"
          @keypress="() => toggleShowTokensModal(1)"
        >
          {{ selectedTokens[0]?.symbol ?? "Token 1" }}
          <BaseIcon name="ArrowRight" />
        </ButtonComponent>
        <ButtonComponent
          class="token-select-input"
          btn-styles="faded"
          @click="() => toggleShowTokensModal(2)"
          @keypress="() => toggleShowTokensModal(2)"
        >
          {{ selectedTokens[1]?.symbol ?? "Token 2" }}
          <BaseIcon name="ArrowRight" />
        </ButtonComponent>
      </div>
      <div class="network-filter-wrap">
        <div class="pools-wrap__filters-networks">
          <div
            :class="activeChain === 'all' ? 'pools-wrap__filters-item--selected' : ''"
            @click="handleClickChain('all')"
            @keypress="handleClickChain('all')"
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
  </div>
  <SelectTokensModal
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
  />
</template>

<script lang="ts">
import ButtonComponent from '@/components/Button/Index.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import SelectTokensModal from '@/components/TokensModal/Index.vue';
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
    SelectTokensModal,
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
      sortedChains: networkList,
      isShowTokensModal: false as boolean,
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
  methods: {
    ...mapActions('poolsData', ['setFilterParams', 'setFilterChain']),
    toggleShowTokensModal(tokenToSelect: number) {
      this.isShowTokensModal = !this.isShowTokensModal;
      this.selectingTokenIndex = tokenToSelect;
    },
    toggleSelectToken(newToken: TSelectTokenWithSearch) {
      const selectedToken = newToken.tokenData;
      this.selectedTokens[Number(this.selectingTokenIndex) - 1] = selectedToken;
      this.isShowTokensModal = false;
      const filterParams: Partial<TFilterPoolsParams> = {
        token0: this.selectedTokens[0]?.symbol ?? '',
        token1: this.selectedTokens[1]?.symbol ?? '',
      };
      this.setFilterParams(filterParams);
    },
    handleClickChain(chain: number | string) {
      this.setFilterChain(chain);
    },
    handleClickSearch() {
      const filterParams: Partial<TFilterPoolsParams> = {
        token0: this.selectedTokens[0]?.symbol ?? '',
        token1: this.selectedTokens[1]?.symbol ?? '',
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
