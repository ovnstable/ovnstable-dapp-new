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
          class="swap-block__item"
        >
          <div
            class="swap-block__item-row"
          >
            <div class="swap-block__item-row--token-wrap">
              <img
                :src="getImgToken"
                alt="select-token"
              >
              <span>
                {{ getSymbolToken?.toUpperCase() }}
              </span>
            </div>
          </div>
          <div
            class="swap-block__item-bal"
          >
            <div>
              {{ getRewardEmm }}
            </div>
            <div v-if="getRewardUsd">
              ~ ${{ getRewardUsd }}
            </div>
          </div>
        </div>
        <div class="swap-block__part-total">
          <h2>
            Total amount
          </h2>
          <div>
            {{ totalLiq }}
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
  mapActions, mapGetters,
} from 'vuex';
import {
  getNewOutputToken,
  getTokenBySymbol,
} from '@/store/helpers/index.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/components/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BN from 'bignumber.js';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { loadAbi, REWARD_TOKEN, srcStringBuilder } from '@/store/views/main/zapin/index.ts';
import { loadTokenImage } from '@/utils/tokenLogo.ts';
import {
  defineComponent,
} from 'vue';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { allTokensMap } from '@/hooks/fetch/useTokensQuery.ts';

export default defineComponent({
  name: 'WithdrawForm',
  components: {
    ChangeNetwork,
    ButtonComponent,
    Spinner,
  },
  props: {
    allTokensList: {
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
      outputTokens: [] as any[],
      poolTokens: [] as any[],
      gaugeContract: null as any,
      zapContract: null as any,
      poolTokenContract: null as any,

      isNftApproved: false,
      isSwapLoading: false,
    };
  },
  computed: {
    ...mapGetters('web3', ['evmSigner']),
    ...mapGetters('odosData', [
      'isAvailableOnNetwork',
    ]),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['account']),

    getSymbolToken() {
      if (this.zapPool.platform[0] === 'Pancake') return REWARD_TOKEN.CAKE;
      if (this.zapPool.platform[0] === 'Aerodrome') return REWARD_TOKEN.AERO;
      return '';
    },
    getImgToken() {
      return loadTokenImage(this.getSymbolToken).href;
    },
    getRewardUsd() {
      if (!this.getRewardTokenInfo) return 0;
      return this.getRewardEmm ? new BN(this.getRewardEmm)
        .times(this.getRewardTokenInfo?.price).toFixed(6) : 0;
    },
    getRewardEmm() {
      return new BN(this.zapPool.emissions).div(10 ** 18).toFixed(6);
    },
    getRewardTokenInfo() {
      const tokenInfo = allTokensMap(this.allTokensList).values().find((_: any) => {
        const allTokSymbol = _?.symbol?.toLowerCase();
        return allTokSymbol === this.getSymbolToken?.toLowerCase();
      });

      return tokenInfo || null;
    },
    totalLiq() {
      if (new BN(this.getRewardUsd).lt(0.01)) return '< $0.01';
      return `$ ${new BN(this.getRewardUsd).toFixed(2)}`;
    },
    zapsLoaded() {
      return this.zapPool && this.zapContract;
    },
    outputTokensWithSelectedTokensCount() {
      return this.outputTokens.filter((item: any) => item.selectedToken).length;
    },

    isDisableButton() {
      return (this.outputTokensWithSelectedTokensCount === 0 || !this.isAvailableOnNetwork
      );
    },
  },
  watch: {
    // on wallet connect
    async account(val) {
      if (!val) this.outputTokens = [getNewOutputToken()];
    },
    networkId(newVal) {
      if (newVal) {
        if (!this.isAvailableOnNetwork) {
          this.mintAction();
        }

        if (this.zapPool.chain === this.networkId) {
          this.initContracts();
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
  async mounted() {
    await this.initContracts();
    this.init();
    this.setIsZapModalShow(false);
  },
  created() {
    if (this.zapPool.chain !== this.networkId) return;
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
    mintAction() {
      this.showMintView();
      this.showSwapModal();
    },

    async initContracts() {
      const tokens = this.zapPool.name.split('/');
      const tokenA = getTokenBySymbol(tokens[0], this.allTokensList);
      const tokenB = getTokenBySymbol(tokens[1], this.allTokensList);

      const abiGauge = srcStringBuilder('V3GaugeRebalance')(this.zapPool.chainName, this.zapPool.platform[0]);
      const abiGaugeContractFileV3 = await loadAbi(abiGauge);

      const abiV3Zap = srcStringBuilder('V3Zap')(this.zapPool.chainName, this.zapPool.platform[0]);
      const abiContractV3Zap = await loadAbi(abiV3Zap);

      const abiV3Nft = srcStringBuilder('V3Nft')(this.zapPool.chainName, this.zapPool.platform[0]);
      const abiContractV3Nft = await loadAbi(abiV3Nft);

      this.gaugeContract = buildEvmContract(
        abiGaugeContractFileV3.abi,
        this.evmSigner,
        this.gaugeAddress,
      );

      this.zapContract = buildEvmContract(
        abiContractV3Zap.abi,
        this.evmSigner,
        abiContractV3Zap.address,
      );

      this.poolTokenContract = buildEvmContract(
        abiContractV3Nft.abi,
        this.evmSigner,
        abiContractV3Nft.address,
      );

      this.poolTokens = [tokenA, tokenB];

      if (!this.isAvailableOnNetwork) this.mintAction();
    },

    async init() {
      const bus = useEventBus('odos-transaction-finished');
      bus.on(() => {
        this.finishTransaction();
      });
    },
    finishTransaction() {
      this.closeWaitingModal();
    },

    async claimTrigger() {
      console.log(this.zapPool, 'claimTrigger');
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('unstaking');

        let tx;

        if (this.zapPool.isStaked) {
          tx = await this.gaugeContract.getReward(this.zapPool.tokenId);
        } else {
          tx = await this.poolTokenContract.collect(this.zapPool.tokenId);
        }

        await tx.wait();

        this.triggerSuccessZapin(
          {
            isShow: true,
            inputTokens: this.poolTokens,
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
@import "./styles.scss";
</style>
