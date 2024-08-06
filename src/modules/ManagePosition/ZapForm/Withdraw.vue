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
            <div
              v-if="token.value"
              class="swap-block__item-bal"
            >
              <div v-if="token.value">
                {{ token.displayedValue }}
              </div>
              <div>
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
        <h2>
          You receive
        </h2>
        <div class="swap-block__get-col">
          <div
            v-for="token in (outputTokens as any)"
            :key="token.id"
            class="input-component-container"
          >
            <TokenForm
              :token-info="token"
              :is-token-removable="false"
              :is-input-token="false"
              :disabled="true"
              :balances-loading="isBalancesLoading"
            />
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
    </div>
  </div>
</template>
<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-continue -->
<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { useEventBus } from '@vueuse/core';
import {
  mapActions, mapGetters, mapState, mapMutations,
} from 'vuex';
import {
  getNewOutputToken,
  getTokenByAddress,
} from '@/store/helpers/index.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/modules/Main/components/ZapModal/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { poolTokensForZapMap } from '@/store/views/main/zapin/mocks.ts';
import TokenForm from '@/modules/ManagePosition/TokenForm.vue';
import { cloneDeep } from 'lodash';
import BN from 'bignumber.js';
import { MANAGE_FUNC, withdrawStep } from '@/store/modals/waiting-modal.ts';
import { formatInputTokens } from '@/utils/tokens.ts';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';

export default {
  name: 'WithdrawForm',
  components: {
    ButtonComponent,
    TokenForm,
    ChangeNetwork,
    Spinner,
  },
  props: {
    zapPool: {
      type: Object,
      required: false,
      default: null,
    },
    typeOfPool: {
      // OVN or ALL
      type: String,
      required: false,
      default: 'ALL',
    },
  },
  emits: ['close-form'],
  data() {
    return {
      positionFinish: false,
      positionStaked: true,
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)

      currentStage: withdrawStep.WITHDRAW,
      isNftApproved: false,
      isSwapLoading: false,
    };
  },
  computed: {
    ...mapState('odosData', [
      'isTokensLoadedAndFiltered',
      'isBalancesLoading',
    ]),
    ...mapState('zapinData', [
      'zapContract',
      'poolNftContract',
      'gaugeContractV3',
    ]),
    ...mapGetters('odosData', [
      'allTokensList',
      'isAvailableOnNetwork',
    ]),
    ...mapGetters('zapinData', [
      'isZapLoaded',
    ]),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['account']),

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
      return this.isTokensLoadedAndFiltered && this.zapPool && this.zapContract && this.isZapLoaded;
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
    // on wallet connect
    async account(val) {
      if (val) this.clearAndInitForm();
      if (!val) this.outputTokens = [getNewOutputToken()];
    },

    isTokensLoadedAndFiltered(val) {
      if (val) {
        this.clearAndInitForm();
      }
    },
    networkId(newVal) {
      if (newVal) {
        this.$store.commit('odosData/changeState', { field: 'isTokensLoadedAndFiltered', val: false });

        if (!this.isAvailableOnNetwork) {
          this.mintAction();
        }

        if (this.zapPool.chain === this.networkId) {
          this.firstInit();

          setTimeout(() => {
            this.loadZapContract();
          }, 300);
        }
      }
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

    setTimeout(() => {
      this.loadZapContract();
    }, 300);
  },
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('poolsData', ['setIsZapModalShow']),
    ...mapActions('odosData', [
      'loadTokens',
      'initContractData',
      'triggerSuccessZapin',
    ]),
    ...mapActions('accountData', ['refreshBalance']),
    ...mapActions('zapinData', ['loadZapContract']),
    ...mapActions('waitingModal', ['closeWaitingModal', 'showWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),

    ...mapMutations('zapinData', ['changeState']),
    ...mapMutations('waitingModal', ['setStagesMap']),
    async approveNftPosition(approveToGauge: boolean) {
      this.isSwapLoading = true;

      try {
        console.log(approveToGauge, '__isApproved');
        this.showWaitingModal('Approve');
        const tx = await this.poolNftContract
          .approve(this.zapContract?.target, this.zapPool.tokenId);

        await tx.wait();
        this.isNftApproved = true;
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.currentStage = withdrawStep.ZAPOUT;
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
      this.changeState({
        field: 'zapPoolRoot',
        val: this.zapPool,
      });
      this.changeState({
        field: 'tokenSeparationScheme',
        val: 'POOL_SWAP',
      });
      this.changeState({
        field: 'typeOfPoolScheme',
        val: this.typeOfPool,
      });

      // todo: move to backend
      const poolTokens = poolTokensForZapMap[this.zapPool.address];
      if (!poolTokens) return;

      this.$store.commit('odosData/changeState', {
        field: 'listOfBuyTokensAddresses',
        val: [poolTokens[0].address, poolTokens[1].address],
      });

      await this.init();
      this.clearAndInitForm();

      if (!this.isAvailableOnNetwork) this.mintAction();

      if (this.outputTokens?.length > 0) {
        const symbName = this.zapPool?.name?.split('/');
        this.outputTokens.forEach((_, key) => {
          this.outputTokens[key].value = this.zapPool?.position?.tokens[key][symbName[key]];
          this.outputTokens[key].sum = this.zapPool?.position?.tokens[key][symbName[key]];
        });

        const inputTokens = cloneDeep(this.outputTokens);

        const inputTokenInfo = formatInputTokens(inputTokens);
        this.inputTokens = inputTokenInfo;
      }
    },

    async init() {
      // await this.loadChains();
      await this.loadTokens();
      await this.initContractData();

      const bus = useEventBus('odos-transaction-finished');
      bus.on(() => {
        this.finishTransaction();
      });
    },
    addDefaultPoolToken() {
      const poolTokens = poolTokensForZapMap[this.zapPool.address];
      const poolSelectedToken = getTokenByAddress(poolTokens[0].address, this.allTokensList);
      const ovnSelectSelectedToken = getTokenByAddress(poolTokens[1].address, this.allTokensList);

      if (!poolSelectedToken || !ovnSelectSelectedToken) {
        this.addNewOutputToken();
        return;
      }

      poolSelectedToken.selected = true;
      ovnSelectSelectedToken.selected = true;

      if (this.swapMethod === 'BUY') {
        this.addSelectedTokenToOutputList(poolSelectedToken, true, 50);
        this.addSelectedTokenToOutputList(ovnSelectSelectedToken, true, 50);
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.addNewOutputToken();
        return;
      }

      console.error(
        'Error when add default ovn token. Method not found: ',
        this.swapMethod,
      );
    },
    addNewOutputToken() {
      this.outputTokens.push(getNewOutputToken());
    },
    removeToken(tokens: any[], id: string) {
      // removing by token.id or token.selectedToken.id
      const index = tokens.findIndex(
        (item: any) => item.id === id
          || (item.selectedToken ? item.selectedToken.id === id : false),
      );
      if (index !== -1) {
        if (tokens[index].selectedToken) {
          tokens[index].selectedToken.selected = false;
        }

        tokens.splice(index, 1);
      }
    },
    finishTransaction() {
      this.clearAndInitForm();
      this.closeWaitingModal();
      this.refreshBalance();
    },

    clearAndInitForm() {
      this.clearAllSelectedTokens();

      if (this.swapMethod === 'BUY') {
        this.addDefaultPoolToken();
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.addDefaultPoolToken();
        return;
      }

      console.error('Clear form, swap method not found.', this.swapMethod);
    },
    resetOutputs() {
      if (!this.selectedOutputTokens.length) {
        return;
      }

      if (this.selectedOutputTokens.length === 2) {
        for (let i = 0; i < this.selectedOutputTokens.length; i++) {
          const token: any = this.selectedOutputTokens[i];
          token.value = 50;
        }
        return;
      }

      for (let i = 0; i < this.selectedOutputTokens.length; i++) {
        const token: any = this.selectedOutputTokens[i];
        token.value = 0;
      }

      // init first token value
      this.selectedOutputTokens[0].value = 100;
    },
    async zapOutTrigger() {
      console.log(this.gaugeContractV3, 'zapOutTrigger');
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

        if (this.zapPool.chainName === 'base') tx = await this.gaugeContractV3.withdraw(this.zapPool.tokenId);
        else if (this.zapPool.chainName === 'arbitrum') tx = await this.gaugeContractV3.withdraw(this.zapPool.tokenId, this.account);

        await tx.wait();
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.positionStaked = false;
        this.currentStage = withdrawStep.APPROVE;
      } catch (e) {
        console.log(e);
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
    },
    async checkNftApprove() {
      if (!this.poolNftContract) return;
      this.isSwapLoading = true;

      const isApproved = await this.poolNftContract
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
    addSelectedTokenToOutputList(selectedToken: any, isLocked: any, startPercent: any) {
      const newOutputToken = getNewOutputToken();
      newOutputToken.locked = isLocked;
      newOutputToken.value = startPercent;
      newOutputToken.selectedToken = selectedToken;
      this.outputTokens.push(newOutputToken);
      this.removeAllWithoutSelectedTokens(this.outputTokens);
      this.resetOutputs();
    },
    removeAllWithoutSelectedTokens(tokens: any) {
      const tokensToRemove = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].selectedToken) continue;
        tokensToRemove.push(tokens[i]);
      }

      for (let i = 0; i < tokensToRemove.length; i++) {
        this.removeToken(tokens, tokensToRemove[i].id);
      }
    },
    clearAllOutputSelectedTokens() {
      for (let i = 0; i < this.outputTokens.length; i++) {
        if (this.outputTokens[i].selectedToken) {
          this.outputTokens[i].selectedToken.selected = false;
        }
      }

      this.outputTokens = [];
    },
    clearAllSelectedTokens() {
      this.clearAllOutputSelectedTokens();
      this.clearAllTokens();
    },
    clearAllTokens() {
      this.inputTokens = [];
      this.outputTokens = [];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss"
</style>
