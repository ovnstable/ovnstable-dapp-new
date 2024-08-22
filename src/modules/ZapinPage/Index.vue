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
      v-if="!zapPool || allTokensList.length === 0"
      class="pools-wrap__loader"
    >
      <TableSkeleton />
    </div>

    <div v-else-if="zapPool">
      <AutoZapinV3
        :zap-pool="zapPool"
        :all-tokens-list="allTokensList"
      />
    </div>

    <SuccessZapModal
      :set-show-func="triggerSuccessZapin"
    />
  </div>
</template>

<script lang="ts">
import {
  mapActions,
  useStore,
} from 'vuex';
import AutoZapinV3 from '@/components/ZapForm/AutoZapinV3.vue';
import SuccessZapModal from '@/modules/ModalTemplates/SuccessModal/SuccessZapModal.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { inject } from 'vue';
import type { IPoolService } from '@/services/PoolService/PoolService.ts';
import { usePoolsQueryNew } from '@/hooks/fetch/usePoolsQuery.ts';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import type { TFilterPoolsParams } from '@/types/common/pools';

export default {
  name: 'ZapFormPage',
  components: {
    AutoZapinV3,
    SuccessZapModal,
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
    const { state } = useStore();

    const poolService = inject('poolService') as IPoolService;
    const tokenService = inject('tokenService') as ITokenService;

    const { data: poolList, isLoading: isPoolsLoading } = usePoolsQueryNew(poolService, state);

    const {
      data: allTokensList,
    } = useTokensQuery(tokenService, state);

    return {
      poolList,
      allTokensList,
      isPoolsLoading,
    };
  },
  data() {
    return {
      showModal: false,
      zapPool: null,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
    poolList() {
      this.init();
    },
  },
  mounted() {
    this.handleClickSearch();
    this.init();
  },
  methods: {
    ...mapActions('odosData', [
      'triggerSuccessZapin',
    ]),
    ...mapActions('poolsData', ['setFilterParams']),
    handleClickSearch() {
      const tokens = (this.$route.query?.tokens as string)?.split('-');
      const filterParams: Partial<TFilterPoolsParams> = {
        token0: tokens[0],
        token1: tokens[1],
      };
      this.setFilterParams(filterParams);
    },
    init() {
      if (!this.poolList || this.poolList?.length === 0) return;
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

  h1 {
    font-size: 26px;
    font-weight: 800;
  }

  span {
    margin-left: 8px;
  }
}
</style>
