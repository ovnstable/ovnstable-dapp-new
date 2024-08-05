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
      <div class="swap-block__full">
        <h2>
          You have
        </h2>
        <div class="swap-block__item-col--send">
          <h1>
            REWARDS
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
                {{ token.usdValue }}
              </div>
              <div>
                ~ ${{ token.displayedValue }}
              </div>
          </div>
        </div>
        <div class="swap-block__part-total">
          <h2>
            Total amount
          </h2>
          <div>
            ${{ totalLiq }}
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
              v-if="!positionFinish"
              btn-size="large"
              btn-styles="primary"
              full
              :loading="isSwapLoading"
              @click="claimTrigger"
              @keypress="claimTrigger"
            >
              CLAIM REWARDS
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
          </div>
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
} from '@/store/helpers/index.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/modules/Main/components/ZapModal/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { poolTokensForZapMap } from '@/store/views/main/zapin/mocks.ts';
import { cloneDeep } from 'lodash';
import BN from 'bignumber.js';
import { formatInputTokens } from '@/utils/tokens.ts';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';

export default {
  name: 'WithdrawForm',
  components: {
    ChangeNetwork,
    ButtonComponent,
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
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)

      isNftApproved: false,
      isSwapLoading: false,
    };
  },
  computed: {
    ...mapState('odosData', [
      'isTokensLoadedAndFiltered',
    ]),
    ...mapGetters('odosData', ['allTokensMap']),
    ...mapState('zapinData', [
      'zapContract',
      'poolNftContract',
      'gaugeContractV3',
    ]),
    ...mapGetters('odosData', [
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
    this.firstInit();
    this.setIsZapModalShow(false);
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
    // async approveNftPosition(approveToGauge: boolean) {
    //   this.isSwapLoading = true;

    //   try {
    //     console.log(approveToGauge, '__isApproved');
    //     this.showWaitingModal('Approve');
    //     const tx = await this.poolNftContract
    //       .approve(this.zapContract?.target, this.zapPool.tokenId);

    //     await tx.wait();
    //     this.isNftApproved = true;
    //     this.isSwapLoading = false;
    //     this.closeWaitingModal();
    //     this.currentStage = withdrawStep.ZAPOUT;
    //   } catch (e) {
    //     console.log(e);
    //     this.closeWaitingModal('Approve');
    //     this.isSwapLoading = false;
    //   }
    // },
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

      console.log(this.inputTokens, '__TOKENS');
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
      // const info0 = getTokenInfo(token0, tokenMap)
      const rewardToken = this.zapPool.rewards.tokens.map((_: any, key: number) => {
        const rewardData = Object.entries(_)[0];
        const tokenInfo = this.allTokensMap.values().find((_: any) => {
          const allTokSymbol = _?.symbol;
          return allTokSymbol === rewardData[0];
        });

        return {
          displayedValue: rewardData[1],
          id: Date.now().toString() + key,
          locked: true,
          proportion: 0,
          selectedToken: tokenInfo,
          sum: rewardData[1],
          usdValue: rewardData[1],
          value: rewardData[1],
        };
      });

      this.inputTokens = rewardToken;
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
    async claimTrigger() {
      console.log(this.zapPool, 'claimTrigger');
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('unstaking');

        const inputTokens = [...this.inputTokens];
        const outputTokens = [...this.selectedOutputTokens];

        let tx;

        if (this.zapPool.isStaked) {
          tx = await this.gaugeContractV3.getReward(this.zapPool.tokenId);
        } else {
          // const params = {

          // }
          tx = await this.poolNftContract.collect(this.zapPool.tokenId);
        }

        await tx.wait();

        this.triggerSuccessZapin(
          {
            isShow: true,
            inputTokens,
            outputTokens,
            hash: tx.hash,
            pool: this.zapPool,
            modalType: MODAL_TYPE.HARVEST,
          },
        );
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.closeWaitingModal();
        this.positionFinish = true;
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
@import "./styles.scss";
</style>
