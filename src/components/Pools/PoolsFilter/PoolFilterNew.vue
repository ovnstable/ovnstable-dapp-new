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
            v-for="networkConfig in sortedChains"
            :key="networkConfig.chainId"
            :class="networkConfig.enabled ? 'pools-wrap__filters-item--selected' : ''"
            class="pools-wrap__filters-item"
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
    :tokens="allTokensList"
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
import { mapActions, mapGetters, useStore } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import SelectTokensModal from '@/components/TokensModal/Index.vue';
import { computed, inject } from 'vue';
import { useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import type { TTokenInfo } from '@/types/common/tokens';
import type { TFilterPoolsParams } from '@/types/common/pools';
import type { ITokenService } from '@/services/TokenService/TokenService';

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
    enabled: true,
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
    const { state } = useStore() as any;

    const tokenService = inject('tokenService') as ITokenService;

    const {
      data: allTokensList,
      isLoading,
      isBalancesLoading,
    } = useTokensQueryNew(tokenService, state);

    return {
      allTokensList: computed(
        () => allTokensList.value.filter((token: TTokenInfo) => token.isPoolToken),
      ),
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
  },
  methods: {
    ...mapActions('poolsData', ['setFilterParams']),
    toggleShowTokensModal(tokenToSelect: number) {
      this.isShowTokensModal = !this.isShowTokensModal;
      this.selectingTokenIndex = tokenToSelect;
    },
    toggleSelectToken(newToken: TSelectTokenWithSearch) {
      const selectedToken = newToken.tokenData;
      this.selectedTokens[Number(this.selectingTokenIndex) - 1] = selectedToken;
      console.log(this.selectedTokens);
      this.isShowTokensModal = false;
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
