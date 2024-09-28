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
      </div>
      <div class="swap-block__part-total">
        <h2>
          Total amount
        </h2>
        <div>
          {{ totalLiq }}
        </div>
      </div>
    </div>
    <div class="swap-block__part">
      <SwapRouting
      v-if="zapPool"
            :swap-data="[]"
            :merged-list="[]"
            :input-tokens="[]"
            :output-tokens="[]"
            :routing-type="MODAL_TYPE.HARVEST"
            :zap-pool="zapPool"
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
</template>
<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-continue -->
<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import {
  mapActions, mapGetters,
} from 'vuex';
import {
  getNewOutputToken,
} from '@/store/helpers/index.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/components/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BN from 'bignumber.js';
import { REWARD_TOKEN } from '@/store/views/main/zapin/index.ts';
import { loadTokenImage } from '@/utils/tokenLogo.ts';
import {
  defineComponent,
  type PropType,
} from 'vue';
import { allTokensMap } from '@/hooks/fetch/useTokensQuery.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { parseErrorLog } from '@/utils/errors.ts';
import { initZapinContracts } from '@/services/Web3Service/utils/index.ts';
import ZapinService from '@/services/Web3Service/Zapin-service.ts';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import SwapRouting from '@/components/SwapRouting/Index.vue';
import type { IPositionsInfo } from '@/types/positions';

export default defineComponent({
  name: 'HarvestForm',
  components: {
    ChangeNetwork,
    ButtonComponent,
    Spinner,
    SwapRouting,
  },
  props: {
    allTokensList: {
      type: Array,
      required: true,
      default: () => [],
    },
    zapPool: {
      type: Object as PropType<IPositionsInfo>,
      required: false,
      default: null,
    },
    balanceList: {
      type: Array,
      required: true,
      default: () => [],
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
    mergedAllTokens() {
      return mergedTokens(this.allTokensList as any[], this.balanceList as any[]);
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
    this.setIsZapModalShow(false);
  },
  created() {
    if (this.zapPool.chain !== this.networkId) return;
    this.initContracts();
  },
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('poolsData', ['setIsZapModalShow']),
    ...mapActions('odosData', ['triggerSuccessZapin']),
    ...mapActions('waitingModal', ['closeWaitingModal', 'showWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),
    mintAction() {
      this.showMintView();
      this.showSwapModal();
    },

    async initContracts() {
      const contractsData = await initZapinContracts(
        this.zapPool,
        this.mergedAllTokens,
        this.evmSigner,
        this.gaugeAddress,
      );

      this.gaugeContract = contractsData.gaugeContract;
      this.zapContract = contractsData.zapContract;
      this.poolTokenContract = contractsData.poolTokenContract;
      this.poolTokens = contractsData.poolTokens;

      if (!this.isAvailableOnNetwork) this.mintAction();
    },

    async claimTrigger() {
      try {
        this.showWaitingModal('unstaking');
        this.isSwapLoading = true;
        await ZapinService.claimPosition(
          this.zapPool,
          this.gaugeContract,
          this.poolTokenContract,
          this.triggerSuccessZapin,
          this.account,
        );

        this.closeWaitingModal();
      } catch (e) {
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
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
