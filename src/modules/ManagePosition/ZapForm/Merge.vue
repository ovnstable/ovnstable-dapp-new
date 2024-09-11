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
      <h2>
        Position you merge to chosen
      </h2>
      <div class="swap-block__select">
        <div class="swap-block__select-trigger">
          Select position
        </div>
      </div>

      <SwapSlippageSettings
        @change-slippage="handleCurrentSlippageChanged"
      />
      <!-- <div class="swap-block__item-col--send">
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
      </div> -->
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
          v-if="positionStaked"
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
import { useEventBus } from '@vueuse/core';
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
import { defineComponent } from 'vue';
import { fixedByPrice } from '@/utils/numbers.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { initZapinContracts } from '@/services/Web3Service/utils/index.ts';
import SwapSlippageSettings from '@/components/SwapSlippage/Index.vue';

export default defineComponent({
  name: 'MergeForm',
  components: {
    ButtonComponent,
    ChangeNetwork,
    Spinner,
    SwapSlippageSettings,
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
      type: Object,
      required: false,
      default: null,
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
      slippagePercent: 1,
    };
  },
  computed: {
    ...mapGetters('web3', ['evmSigner']),
    ...mapGetters('odosData', [
      'isAvailableOnNetwork',
    ]),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['account']),

    zapAllTokens() {
      return mergedTokens(this.allTokensList as any[], this.balanceList as any[]);
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

    if (!this.zapPool.isStaked) {
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
        this.isNftApproved = true;
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.currentStage = withdrawStep.ZAPOUT;
        this.zapOutTrigger();
      } catch (e) {
        console.log(e);
        this.closeWaitingModal('Approve');
        this.isSwapLoading = false;
      }
    },
    mintAction() {
      this.showMintView();
      this.showSwapModal();
    },

    async firstInit() {
      await this.init();
      this.initLiqTokens();

      if (!this.isAvailableOnNetwork) this.mintAction();
    },

    async init() {
      const bus = useEventBus('odos-transaction-finished');
      bus.on(() => {
        this.finishTransaction();
      });
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
          value: new BN(price).toFixed(fixedByPrice(price)),
          sum: new BN(price).toFixed(fixedByPrice(price)),
        };
      });

      const inputTokenInfo = formatInputTokens(arrTokens);
      this.inputTokens = inputTokenInfo;
      this.outputTokens = cloneDeep(inputTokenInfo);
    },
    finishTransaction() {
      this.closeWaitingModal();
    },
    handleCurrentSlippageChanged(newSlippage: number) {
      this.slippagePercent = newSlippage;
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
        const outputTokens = [...this.selectedOutputTokens];
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
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
    },
    async withdrawTrigger() {
      console.log('unstakeTrigger');
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('unstaking');

        let tx;

        if (this.zapPool.chainName === 'base') tx = await this.gaugeContract.withdraw(this.zapPool.tokenId);
        else if (this.zapPool.chainName === 'arbitrum') tx = await this.gaugeContract.withdraw(this.zapPool.tokenId, this.account);

        await tx.wait();
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.positionStaked = false;
        this.currentStage = withdrawStep.APPROVE;
        this.approveNftPosition(false);
      } catch (e) {
        console.log(e);
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
.swap-block__select {
  background-color: var(--color-5);
  padding: 26px 16px;
  border-radius: 12px;
  margin: 20px 0;
}

.swap-block__select-trigger {
  width: fit-content;
  padding: 8px 12px;
  border-radius: 30px;
  color: var(--color-2);
  background-color: var(--color-4);
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all .2s ease;

  &:hover {
    color: var(--color-4);
    background-color: var(--color-3);
  }
}

.swap-container__footer {
  margin-top: 20px;
}
</style>
