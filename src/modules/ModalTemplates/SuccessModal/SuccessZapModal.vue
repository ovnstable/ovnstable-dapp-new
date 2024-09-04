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
        YOU SUCCESSFULLY {{ getName }}
      </h1>

      <template v-if="successData">
        <ZapinContent
          v-if="[modalType.ZAPIN, modalType.REBALANCE].includes(successData.modalType)"
          :tokens-staked-list="tokensStakedList"
          :tokens-sent-list="tokensSentList"
          :tokens-returned-list="tokensReturnedList"
        />
        <WithdrawContent
          v-else-if="successData.modalType === modalType.WITHDRAW"
          :tokens-staked-list="tokensStakedList"
          :tokens-sent-list="tokensSentList"
          :tokens-returned-list="tokensReturnedList"
        />
        <CompoundContent
          v-else-if="successData.modalType === modalType.COMPOUND"
        />
        <HarvestContent
          v-else-if="successData.modalType === modalType.HARVEST"
        />
      </template>
      <div class="zap-modal-footer">
        <a
          href="https://forms.gle/BCwwX4yhGW7EadTCA"
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
import { mapGetters, mapState } from 'vuex';
import {
  computed, defineComponent,
} from 'vue';
import { getAllTokensString, getTransactionTotal } from '@/utils/tokens.ts';
import { checkIsEveryStable } from '@/store/views/main/pools/helpers.ts';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { useTokensQuery, useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import ZapinContent from './components/zapin.vue';
import WithdrawContent from './components/withdraw.vue';
import HarvestContent from './components/harvest.vue';
import CompoundContent from './components/compound.vue';
import {
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
    };
  },
  data() {
    return {
      tokensSentList: [] as TFormatTokenInfo[],
      tokensReturnedList: [] as TFormatTokenInfo[],
      tokensStakedList: [] as TFormatTokenInfo[],
      showModal: false,
      isInit: false,
      modalType: MODAL_TYPE,
    };
  },
  computed: {
    ...mapState('odosData', [
      'successData',
      'showSuccessZapin',
      'lastParsedReturnedToUserEvent',
      'lastParsedPutIntoPoolEvent',
      'lastParsedZapResponseData',
    ]),
    ...mapState('poolsData', [
      'lastParsedBurnedTokenIdEvent',
      'lastParsedClaimedRewardsEvent',
    ]),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('posthog', ['posthogService']),
    ...mapGetters('network', ['explorerUrl']),

    mergedTokenList() {
      return mergedTokens(this.allTokensList, this.balancesList as any[]);
    },

    getName() {
      if (this.successData.modalType === MODAL_TYPE.HARVEST) return 'HARVEST';
      if (this.successData.modalType === MODAL_TYPE.WITHDRAW) return 'WITHDRAW';
      if (this.successData.modalType === MODAL_TYPE.COMPOUND) return 'COMPOUND';
      if (this.successData.modalType === MODAL_TYPE.REBALANCE) return 'REBALANCE';
      return 'ZAPIN';
    },
  },
  watch: {
    showSuccessZapin(currVal: boolean) {
      this.showModal = currVal;

      if (!this.isInit && currVal) {
        // TODO: move Posthog logic up to store
        const posthogEventData = {
          txUrl: `${this.explorerUrl}tx/${this.lastParsedZapResponseData?.hash || ''}`,
          token0: getAllTokensString(this.successData.inputTokens
            .map((token: any) => token.selectedToken)),
          token1: getAllTokensString(this.successData.outputTokens
            .map((token: any) => token.selectedToken)),
          poolName: this.successData.pool.name,
          poolVersion: this.successData.pool.poolVersion,
          usdTotal: getTransactionTotal(this.successData.inputTokens),
          poolType: checkIsEveryStable(this.successData.pool) ? 'Stable' : 'Volatile',
          walletAddress: this.account,
          chainName: this.successData.pool.chainName,
          poolPlatform: this.successData.pool.platform.toString(),
        };

        if (this.lastParsedClaimedRewardsEvent) {
          this.posthogService
            .rebalanceSuccessTrigger(posthogEventData);
        }
        this.posthogService.zapinSuccessTrigger(posthogEventData);
      }
    },
    successData(val) {
      if (val) {
        this.initStakedList();
        this.initReturnedList();
        this.initSentList();
      }
    },
  },
  mounted() {
    this.initReturnedList();
    this.initStakedList();
    this.initSentList();
  },
  methods: {
    closeModal() {
      this.setShowFunc({ isShow: false });

      // If rebalance modal
      if (this.lastParsedClaimedRewardsEvent && this.lastParsedBurnedTokenIdEvent) {
        this.$router.replace('/positions');
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
      }
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
  },
});
</script>
<style scoped lang="scss" src="./styles.scss" />
