<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div>
    <div
      v-if="zapPool.chain !== networkId"
      class="swap-container"
    >
      <div class="swap-body">
        <ChangeNetwork :zap-pool="zapPool" />
      </div>
    </div>
    <div
      v-else-if="!zapsLoaded"
      class="loader-container"
    >
      <Spinner />
    </div>
    <div
      v-else
      class="swap-block"
    >
      <div class="swap-block__part">
        <h2>
          You have
        </h2>
        <div class="swap-block__item-col--send">
          <h1>
            LIQUIDITY
          </h1>
          <span class="divider" />
          <div
            v-for="token in inputTokens"
            :key="token.id"
            class="swap-block__item"
          >
            <div
              v-if="token.selectedToken"
              class="swap-block__item-row"
            >
              <div class="swap-block__item-row--percentage">
                {{ token.proportion }}%
              </div>
              <div class="swap-block__item-row--token-wrap">
                <img
                  :src="token.selectedToken.logoUrl"
                  alt="select-token"
                >
                <span>
                  {{ token.selectedToken.symbol }}
                </span>
              </div>
            </div>
            <div class="swap-block__item-bal">
              <div v-if="token.displayedValue">
                {{ token.displayedValue }}
              </div>
              <div v-if="token.value">
                ~ ${{ token.usdValue }}
              </div>
            </div>
          </div>
          <!-- <span class="divider" /> -->
        </div>
        <div class="swap-block__part-total">
          <h2>
            Total amount
          </h2>
          <div>
            ${{ totalLiq }}
          </div>
        </div>
      </div>
      <div class="swap-block__part">
        <div class="swap-block__get-col">
          <SwapRouting
              v-if="zapPool"
              :swap-data="[]"
              :merged-list="[]"
              :input-tokens="[]"
              :output-tokens="selectedOutputTokens"
              :initial-position-routing-wrap="[]"
              :routing-type="MODAL_TYPE.WITHDRAW"
              :zap-pool="zapPool"
            />
        </div>
      </div>
    </div>
    <div class="swap-container__footer">
      <ButtonComponent
        v-if="!account"
        class="swap-button-container"
        btn-size="large"
        btn-styles="primary"
        full
        @click="connectWallet"
        @keypress="connectWallet"
      >
        CONNECT WALLET
      </ButtonComponent>
      <div
        v-else
        class="swap-button-container"
      >
        <ButtonComponent
          v-if="withdrawRequired"
          btn-size="large"
          btn-styles="primary"
          full
          :loading="isSwapLoading"
          @click="withdrawTrigger"
          @keypress="withdrawTrigger"
        >
          WITHDRAW
        </ButtonComponent>
        <ButtonComponent
          v-else-if="!isNftApproved"
          btn-size="large"
          btn-styles="primary"
          full
          :loading="isSwapLoading"
          @click="approveNftPosition(false)"
          @keypress="approveNftPosition(false)"
        >
          APPROVE
        </ButtonComponent>
        <RouterLink
          v-else-if="positionFinish"
          to="/positions"
        >
          <ButtonComponent
            btn-size="large"
            btn-styles="primary"
            full
          >
            RETURN TO POSITIONS
          </ButtonComponent>
        </RouterLink>
        <ButtonComponent
          v-else
          btn-size="large"
          btn-styles="primary"
          full
          :loading="isSwapLoading"
          @click="zapOutTrigger"
          @keypress="zapOutTrigger"
        >
          ZAP OUT
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-continue -->
<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import {
  mapActions, mapGetters, mapMutations,
} from 'vuex';
import {
  getNewInputToken,
  getTokenByAddress,
} from '@/store/helpers/index.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/components/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { cloneDeep } from 'lodash';
import BN from 'bignumber.js';
import { MANAGE_FUNC, withdrawStep } from '@/store/modals/waiting-modal.ts';
import { formatInputTokens } from '@/utils/tokens.ts';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { defineComponent, type PropType } from 'vue';
import { fixedByPrice } from '@/utils/numbers.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { initZapinContracts } from '@/services/Web3Service/utils/index.ts';
import SwapRouting from '@/components/SwapRouting/Index.vue';
import { parseErrorLog } from '@/utils/errors.ts';
import ZapinService from '@/services/Web3Service/Zapin-service.ts';
import { awaitDelay } from '@/utils/const.ts';
import type { IPositionsInfo } from '@/types/positions';

export default defineComponent({
  name: 'WithdrawForm',
  components: {
    ButtonComponent,
    ChangeNetwork,
    Spinner,
    SwapRouting,
  },
  props: {
    allTokensList: {
      type: Array,
      required: true,
      default: () => [],
    },
    balanceList: {
      type: Array,
      required: true,
      default: () => [],
    },
    zapPool: {
      type: Object as PropType<IPositionsInfo>,
      required: true,
    },
    gaugeAddress: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      positionFinish: false,
      positionStaked: true,
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      poolTokens: [] as any[],
      gaugeContract: null as any,
      zapContract: null as any,
      poolTokenContract: null as any,
      currentStage: withdrawStep.WITHDRAW,
      isNftApproved: false,
      isSwapLoading: false,
      MODAL_TYPE,
    };
  },
  computed: {
    ...mapGetters('web3', ['evmSigner']),
    ...mapGetters('odosData', [
      'isAvailableOnNetwork',
    ]),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['account']),

    withdrawRequired() {
      if (this.zapPool.platform[0] === "Uniswap") return false
      return this.positionStaked
    },
    zapAllTokens() {
      return mergedTokens(this.allTokensList as any[], this.balanceList as any[]);
    },
    totalLiq() {
      if (this.inputTokens.length === 0) return 0;

      const res: BN = this.inputTokens.reduce((acc, curr) => {
        const val = new BN(curr.value).times(curr.selectedToken.price).toFixed(6);

        return acc.plus(val);
      }, new BN(0));

      if (res.lt(0.01)) return '0.01';

      return res.toFixed(4);
    },
    zapsLoaded() {
      return this.zapPool && this.zapContract;
    },
    outputTokensWithSelectedTokensCount() {
      return this.outputTokens.filter((item: any) => item.selectedToken).length;
    },

    selectedOutputTokens() {
      return this.outputTokens.filter((item: any) => item.selectedToken);
    },

    isDisableButton() {
      return (this.outputTokensWithSelectedTokensCount === 0 || !this.isAvailableOnNetwork
      );
    },
  },
  watch: {
    currentStage(stage: withdrawStep) {
      this.$store.commit('zapinData/changeState', { field: 'currentStage', val: stage });
    },
    isDisableButton(val) {
      if (val) {
        this.clearQuotaInfo();
      }
    },
    async poolNftContract(val) {
      if (!val) return;
      this.checkNftApprove();
    },
  },
  mounted() {
    this.$store.commit('zapinData/changeState', { field: 'currentStage', val: withdrawStep.WITHDRAW });
    this.setStagesMap(MANAGE_FUNC.WITHDRAW);
    this.initContracts();
    this.firstInit();
    this.setIsZapModalShow(true);
    this.positionStaked = this.zapPool.isStaked;

    if (!this.zapPool.isStaked || !this.withdrawRequired) {
      this.currentStage = withdrawStep.APPROVE;
    }
  },
  created() {
    if (this.zapPool.chain !== this.networkId) return;

    this.firstInit();
    this.initContracts();
  },
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('poolsData', ['setIsZapModalShow']),
    ...mapActions('odosData', [
      'triggerSuccessZapin',
    ]),
    ...mapActions('waitingModal', ['closeWaitingModal', 'showWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),
    ...mapMutations('waitingModal', ['setStagesMap']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),

    async initContracts() {
      const contractsData = await initZapinContracts(
        this.zapPool,
        this.zapAllTokens,
        this.evmSigner,
        this.gaugeAddress,
      );

      this.gaugeContract = contractsData.gaugeContract;
      this.zapContract = contractsData.zapContract;
      this.poolTokenContract = contractsData.poolTokenContract;
      this.poolTokens = contractsData.poolTokens;

      if (!this.isAvailableOnNetwork) this.mintAction();
    },

    async approveNftPosition(approveToGauge: boolean) {
      this.isSwapLoading = true;

      try {
        console.log(approveToGauge, '__isApproved');
        this.showWaitingModal('Approve');
        const tx = await this.poolTokenContract
          .approve(this.zapContract?.target, this.zapPool.tokenId);

        await tx.wait();
        await awaitDelay(1000);
        this.isNftApproved = true;
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.currentStage = withdrawStep.ZAPOUT;
        this.zapOutTrigger();
      } catch (e) {
        console.log(e);
        this.closeWaitingModal('Approve');
        this.isSwapLoading = false;
        this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: parseErrorLog(e) });
      }
    },
    mintAction() {
      this.showMintView();
      this.showSwapModal();
    },

    async firstInit() {
      this.initLiqTokens();

      if (!this.isAvailableOnNetwork) this.mintAction();
    },
    initLiqTokens() {
      const tokens = this.zapPool.name.split('/');
      const token0 = getTokenByAddress(this.zapPool?.token0Add, this.zapAllTokens);
      const token1 = getTokenByAddress(this.zapPool?.token1Add, this.zapAllTokens);

      const tokenFull0 = {
        ...getNewInputToken(),
        locked: false,
        selectedToken: token0,
      };
      const tokenFull1 = {
        ...getNewInputToken(),
        locked: false,
        selectedToken: token1,
      };

      let arrTokens = [tokenFull0, tokenFull1];

      arrTokens = arrTokens.map((_: any, key: number) => {
        const price = this.zapPool?.position?.tokens[key][tokens[key]];

        return {
          ..._,
          value: new BN(price).toFixed(fixedByPrice(Number(price))),
          sum: new BN(price).toFixed(fixedByPrice(Number(price))),
        };
      });

      const inputTokenInfo = formatInputTokens(arrTokens);
      this.inputTokens = inputTokenInfo;
      this.outputTokens = cloneDeep(inputTokenInfo);
    },
    async zapOutTrigger() {
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('unstaking');

        const tx = await this.zapContract.zapOut(this.zapPool.tokenId);

        await tx.wait();
        this.isSwapLoading = false;
        this.closeWaitingModal();
        const inputTokens = [...this.inputTokens];
        const outputTokens = [...this.outputTokens];
        this.triggerSuccessZapin(
          {
            isShow: true,
            inputTokens,
            outputTokens,
            hash: tx.hash,
            pool: this.zapPool,
            modalType: MODAL_TYPE.WITHDRAW,
          },
        );
        this.closeWaitingModal();
        this.positionFinish = true;
      } catch (e) {
        console.log(e);
        this.showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
    },
    async withdrawTrigger() {
      console.log('unstakeTrigger');
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('unstaking');

        await ZapinService.withdrawTrigger(
          this.zapPool,
          this.zapPool.tokenId?.toString(),
          this.gaugeContract,
          this.account,
        );

        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.positionStaked = false;
        this.currentStage = withdrawStep.APPROVE;
        this.approveNftPosition(false);
      } catch (e) {
        console.log(e);
        this.showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
    },
    async checkNftApprove() {
      if (!this.poolTokenContract) return;
      this.isSwapLoading = true;

      const isApproved = await this.poolTokenContract
        .getApproved(this.zapPool?.tokenId);
      console.log(isApproved, '__this.__isApproved');

      if (isApproved?.toLowerCase() === this.zapContract?.target?.toLowerCase()) {
        this.isNftApproved = true;
      }

      this.isSwapLoading = false;
    },
    clearQuotaInfo() {
      this.$store.commit('odosData/changeState', {
        field: 'quotaResponseInfo',
        val: null,
      });
      this.$store.commit('odosData/changeState', {
        field: 'swapResponseInfo',
        val: null,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@import "./styles.scss"
</style>
