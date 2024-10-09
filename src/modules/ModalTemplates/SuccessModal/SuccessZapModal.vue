<template>
  <ModalComponent
    v-model="showModal"
    custom-class="success-modal"
    type-modal="custom"
    @close="closeModal"
  >
    <div class="modal-content">
      <BaseIcon
        class="modal-content__icon"
        name="CommonSuccess"
      />
      <h1 v-if="successData">
        YOU SUCCESSFUL {{ getName }}
      </h1>

      <template v-if="successData">
        <ZapinContent
          v-if="[MODAL_TYPE.ZAPIN, MODAL_TYPE.REBALANCE, MODAL_TYPE.INCREASE, MODAL_TYPE.MERGE]
            .includes(successData.modalType)"
          :tokens-staked-list="tokensStakedList"
          :tokens-sent-list="tokensSentList"
          :tokens-returned-list="tokensReturnedList"
          :tokens-claimed-list="tokensClaimedList"
          :open-position-on-pool="openPositionOnPool"
        />
        <WithdrawContent
          v-else-if="successData.modalType === MODAL_TYPE.WITHDRAW"
          :tokens-staked-list="tokensStakedList"
          :tokens-sent-list="tokensSentList"
          :tokens-returned-list="tokensReturnedList"
          :tokens-claimed-list="tokensClaimedList"
          :open-position-on-pool="openPositionOnPool"
        />
        <CompoundContent
          v-else-if="successData.modalType === MODAL_TYPE.COMPOUND"
          :tokens-staked-list="tokensStakedList"
          :tokens-returned-list="tokensReturnedList"
          :tokens-claimed-list="tokensClaimedList"
          :open-position-on-pool="openPositionOnPool"
        />
        <HarvestContent
          v-else-if="successData.modalType === MODAL_TYPE.HARVEST"
          :tokens-claimed-list="tokensClaimedList"
          :open-position-on-pool="openPositionOnPool"
        />
      </template>
      <div class="zap-modal-footer">
        <a
          href="https://discord.gg/zPqdc4Bn"
          target="_blank"
          rel="noopener noreferrer"
          class="leave-feedback-link"
        >
          <ButtonComponent btn-styles="link">
            <BaseIcon name="Pencil" />
            LEAVE FEEDBACK
            <BaseIcon name="Pencil" />
          </ButtonComponent>
        </a>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from '@/components/Modal/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { mapState } from 'vuex';
import {
  computed, defineComponent,
} from 'vue';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { useTokensQuery, useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import type { TPoolInfo } from '@/types/common/pools/index.ts';
import { useDispatchManagePositionEvents } from '@/hooks/analytics/useDispatchManagePositionEvents.ts';
import ZapinContent from './components/zapin.vue';
import WithdrawContent from './components/withdraw.vue';
import HarvestContent from './components/harvest.vue';
import CompoundContent from './components/compound.vue';
import getPlatformLink, {
  mapEventTokenData, mapInputTokenData, type TFormatTokenInfo,
} from './helpers.ts';

export default defineComponent({
  name: 'SuccessZapModal',
  components: {
    ModalComponent,
    ButtonComponent,
    BaseIcon,
    ZapinContent,
    WithdrawContent,
    HarvestContent,
    CompoundContent,
  },
  props: {
    setShowFunc: {
      type: Function,
      required: true,
    },
  },
  emits: ['close'],
  setup() {
    const {
      data: allTokensList,
      isLoading,
      isBalancesLoading,
    } = useTokensQueryNew();

    const {
      data: balancesList,
    } = useTokensQuery();

    return {
      balancesList,
      allTokensList,
      isAllDataLoaded: computed(() => !isLoading.value),
      isAllDataTrigger: computed(() => !isLoading.value),
      isBalancesLoading,
      dispatchManagePositionEvent: useDispatchManagePositionEvents(),
    };
  },
  data() {
    return {
      tokensSentList: [] as TFormatTokenInfo[],
      tokensReturnedList: [] as TFormatTokenInfo[],
      tokensStakedList: [] as TFormatTokenInfo[],
      tokensClaimedList: [] as TFormatTokenInfo[],
      showModal: false,
      isInit: false,
      MODAL_TYPE,
    };
  },
  computed: {
    ...mapState('odosData', [
      'successData',
      'showSuccessZapin',
      'lastParsedReturnedToUserEvent',
      'lastParsedPutIntoPoolEvent',
    ]),
    ...mapState('poolsData', [
      'lastParsedClaimedRewardsEvent',
    ]),

    mergedTokenList() {
      return mergedTokens(this.allTokensList, this.balancesList as any[]);
    },

    getName() {
      if (this.successData.modalType === MODAL_TYPE.HARVEST) return 'HARVEST';
      if (this.successData.modalType === MODAL_TYPE.WITHDRAW) return 'WITHDRAW';
      if (this.successData.modalType === MODAL_TYPE.COMPOUND) return 'COMPOUND';
      if (this.successData.modalType === MODAL_TYPE.REBALANCE) return 'REBALANCE';
      if (this.successData.modalType === MODAL_TYPE.INCREASE) return 'INCREASE';
      if (this.successData.modalType === MODAL_TYPE.MERGE) return 'MERGE';
      return 'ZAPIN';
    },
  },
  watch: {
    showSuccessZapin(currVal: boolean) {
      this.showModal = currVal;

      if (!this.isInit && currVal) this.dispatchManagePositionEvent(this.successData.modalType);
    },
    successData(val) {
      if (val) {
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initReturnedList();
      this.initStakedList();
      this.initSentList();
      this.initClaimedList();
    },
    closeModal() {
      this.setShowFunc({ isShow: false });

      // Cleaning the state on close
      this.$store.commit('poolsData/changeState', {
        field: 'lastParsedBurnedTokenIdEvent',
        val: '',
      });
      this.$store.commit('poolsData/changeState', {
        field: 'lastParsedTokenIdEvent',
        val: '',
      });
      this.$store.commit('poolsData/changeState', {
        field: 'lastParsedClaimedRewardsEvent',
        val: '',
      });

      if (this.successData.modalType !== MODAL_TYPE.ZAPIN) this.$router.replace('/positions');

      this.isInit = false;
    },
    // Comes from values computed locally befor tx
    initSentList() {
      if (this.successData?.inputTokens?.length > 0) {
        this.tokensSentList = mapInputTokenData(
          this.successData.inputTokens,
        );
      }
    },
    // Comes from contract event log
    initReturnedList(): void {
      if (this.lastParsedReturnedToUserEvent?.amounts) {
        this.tokensReturnedList = mapEventTokenData(
          this.lastParsedReturnedToUserEvent,
          this.mergedTokenList,
        );
      }
    },
    // Comes from contract event log
    initStakedList(): void {
      if (this.lastParsedPutIntoPoolEvent?.amounts) {
        this.tokensStakedList = mapEventTokenData(
          this.lastParsedPutIntoPoolEvent,
          this.mergedTokenList,
        );
      }
    },
    // Comes from position info
    initClaimedList(): void {
      if (this.lastParsedClaimedRewardsEvent?.length > 0) {
        this.tokensClaimedList = mapInputTokenData(
          this.lastParsedClaimedRewardsEvent,
        );
      }
    },
    openPositionOnPool(pool: TPoolInfo): string {
      return (pool.address || pool.platform[0]) ? getPlatformLink(pool.platform[0], pool.address) : '';
    },
  },
});
</script>
<style scoped lang="scss" src="./styles.scss" />
