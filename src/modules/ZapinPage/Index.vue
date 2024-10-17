<template>
  <div>
    <div class="zapin-wrap__title">
      <router-link to="/pools">
        <ButtonComponent btn-styles="grey">
          <BaseIcon name="ArrowLeft" />
          <span>
            BACK
          </span>
        </ButtonComponent>
      </router-link>
      <h1>ZAPIN</h1>
    </div>

    <div
      v-if="isLoadingData"
      class="pools-wrap__loader"
    >
      <TableSkeleton />
    </div>

    <div v-else-if="zapPool">
      <AutoZapinV3
        :zap-pool="zapPool"
        :all-tokens-list="allTokensList"
        :balance-list="balanceTokensList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  mapActions,
} from 'vuex';
import AutoZapinV3 from '@/components/ZapForm/AutoZapinV3.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { usePoolsQueryNew } from '@/hooks/fetch/usePoolsQuery.ts';
import { useTokensQuery, useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import { isEmpty } from 'lodash';
import { getTokenByAddress } from '@/store/helpers/index.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import type { TFilterPoolsParams, TPool } from '@/types/common/pools';

export default {
  name: 'ZapFormPage',
  components: {
    AutoZapinV3,
    ButtonComponent,
    BaseIcon,
    TableSkeleton,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['toggle-modal'],
  setup: () => {
    const { data: poolList, isLoading: isPoolsLoading } = usePoolsQueryNew();

    const {
      data: allTokensList,
    } = useTokensQueryNew();

    const {
      data: balanceTokensList,
    } = useTokensQuery();

    return {
      poolList,
      allTokensList,
      balanceTokensList,
      isPoolsLoading,
    };
  },
  data() {
    return {
      showModal: false,
      zapInit: false,
      zapPool: {} as TPool,
    };
  },
  computed: {
    isLoadingData() {
      console.log(this.zapPool, '___this.zapPool');
      console.log(this.allTokensList, '___this.allTokensList');
      console.log(this.balanceTokensList, '___this.balanceTokensList');
      return isEmpty(this.zapPool)
        || isEmpty(this.allTokensList)
        || isEmpty(this.balanceTokensList);
    },
    mergedTokenList() {
      return mergedTokens(this.allTokensList as any[], this.balanceTokensList as any[]);
    },
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
    mergedTokenList(val) {
      if (val?.length === 0) return;

      this.handleClickSearch();
    },
    poolList(val) {
      console.log(val, '______this.poolList1')
      if (val?.length === 0) return;
      this.init();
    },
  },
  mounted() {
    this.handleClickSearch();
    this.init();
  },
  methods: {
    ...mapActions('poolsData', ['setFilterParams']),
    handleClickSearch() {
      const tokens = (this.$route.query?.tokens as string)?.split('-');
      const token0 = getTokenByAddress(tokens[0], this.mergedTokenList);

      if (!token0 || this.zapInit) return;

      let tokenSymbol = token0?.symbol;

      // workaround for bsc chain, need to fix api
      if (tokenSymbol && tokenSymbol.includes("BSC")) {
        const newTok = getTokenByAddress(tokens[1], this.mergedTokenList);
        tokenSymbol = newTok?.symbol
      }

      const filterParams: Partial<TFilterPoolsParams> = {
        search: tokenSymbol,
      };
      this.setFilterParams(filterParams);
      this.zapInit = true;
    },
    init() {
      if (!this.poolList || this.poolList?.length === 0 || !isEmpty(this.zapPool)) return;
      const foundPool = this.poolList
        .find((_: any) => _.address?.toLowerCase() === this.$route.query.pair);
      if (foundPool) this.zapPool = foundPool;
    },
  },
};
</script>

<style lang="scss" scoped>
.zapin-wrap__title {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  color: var(--color-1);
  margin-top: 20px;

  h1 {
    font-size: 26px;
    font-weight: 800;
  }

  span {
    margin-left: 8px;
  }
}
</style>
