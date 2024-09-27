<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div>
    <div>
      <h2>
        Position you merge to chosen
      </h2>
      <div class="swap-block__select">
        <template v-if="positionsSelected?.length > 0">
          <div class="positions-row">
            <div class="positions-row">
              <div class="positions-modal__item-imgs">
                <img
                  alt="token"
                  :src="positionsData[0].token0Icon"
                />
                <img
                  alt="token"
                  :src="positionsData[0].token1Icon"
                />
              </div>
              <span class="positions-modal__item-prim">
                {{ positionsData[0].name }}
              </span>
              <span class="positions-modal__item-sec">
                #{{ positionsData[0].tokenId?.toString() }}
              </span>
            </div>
            <div
              class="positions-close"
              @click="clearPos"
              @keypress="clearPos"
            >
              <BaseIcon name="Close" />
            </div>
          </div>
        </template>
        <div
          v-else
          class="swap-block__select-trigger"
          @click="showModalPos"
          @keypress="showModalPos"
        >
          Select position
        </div>
      </div>

      <div class="positions-row positions-row--full">
        <div
          v-if="totalLiq"
          class="swap-block__item-col--send full-block"
        >
          <div class="swap-block__part-total">
            <h1>
              LIQUIDITY
            </h1>
            <div>
              {{ totalLiq }}
            </div>
          </div>
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

        <div
          v-if="totalLiq"
          class="pool-data__rewards swap-block__item-col--send full-block"
        >
          <div class="swap-block__part-total">
            <h1>
              REWARDS
            </h1>

            <div>
              ${{ getRewardUsd }}
            </div>
          </div>
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
                {{ getFixedVal(getRewardEmm) }}
              </div>
              <div v-if="getRewardUsd">
                ~ ${{ getFixedVal(getRewardUsd) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SwapSlippageSettings
        @change-slippage="handleCurrentSlippageChanged"
      />
    </div>
    <SwapRouting
              v-if="odosData?.netOutValue"
              :swap-data="odosData"
              :merged-list="allTokensList"
              :input-tokens="inputTokens"
              :output-tokens="selectedOutputTokens"
              :initial-position-tokens="initPositionTokens"
              :routing-type="MODAL_TYPE.MERGE"
              :zap-pool="positionsData[0]"
            />
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
          v-if="false"
          btn-size="large"
          full
          btn-styles="primary"
          disabled
        >
          {{ disableButtonMessage }}
        </ButtonComponent>
        <ButtonComponent
          v-else-if="positionsStaked.length > 0"
          btn-size="large"
          btn-styles="primary"
          full
          :loading="isSwapLoading"
          :disabled="isWithdrawDisabled"
          @click="withdrawTrigger(positionsStaked[0])"
          @keypress="withdrawTrigger(positionsStaked[0])"
        >
          WITHDRAW #{{ positionsStaked[0] }}
        </ButtonComponent>
        <ButtonComponent
          v-else-if="positionsNotApproved.length > 0"
          btn-size="large"
          btn-styles="primary"
          full
          :loading="isSwapLoading"
          @click="approveNftPosition(positionsNotApproved[0])"
          @keypress="approveNftPosition(positionsNotApproved[0])"
        >
          APPROVE #{{ positionsNotApproved[0] }}
        </ButtonComponent>
        <ButtonComponent
          v-else-if="!isMerged"
          btn-size="large"
          btn-styles="primary"
          full
          :loading="isSwapLoading"
          @click="mergeTrigger"
          @keypress="mergeTrigger"
        >
          Merge NFTs
        </ButtonComponent>
        <ButtonComponent
          v-else
          btn-size="large"
          btn-styles="primary"
          full
          :loading="isSwapLoading"
          @click="approveForGauge"
          @keypress="approveForGauge"
        >
          Approve and Stake
        </ButtonComponent>
      </div>
    </div>

    <ZapInStepsRow
      v-if="zapPool.chain === networkId"
      class="zapin__modal-steps"
      :current-stage="currentStage"
    />

    <PositionsModal
      :is-show="showPositionsModal"
      :selected-positions="positionsSelected"
      :positions-list="filteredPositions"
      @close="showPositionsModal = false"
      @position-select="selectPos"
    />
  </div>
</template>
<script lang="ts">
import {
  mapActions, mapGetters,
  mapMutations,
} from 'vuex';
import {
  getNewInputToken,
  getTokenByAddress,
  getTokenBySymbol,
} from '@/store/helpers/index.ts';

import ButtonComponent from '@/components/Button/Index.vue';
import BN from 'bignumber.js';
import { MANAGE_FUNC, mergeStep, withdrawStep } from '@/store/modals/waiting-modal.ts';
import { formatInputTokens } from '@/utils/tokens.ts';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { defineComponent, markRaw, type PropType } from 'vue';
import { fixedByPrice } from '@/utils/numbers.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import {
  getSymbolEmmToken, initOutputToken, initReqData, initZapData, initZapinContracts,
  parseLogs,
} from '@/services/Web3Service/utils/index.ts';
import SwapSlippageSettings from '@/components/SwapSlippage/Index.vue';
import PositionsModal from '@/modules/ManagePosition/ZapForm/Merge/PositionsModal.vue';
import { usePositionsQuery } from '@/hooks/fetch/usePositionsQuery.ts';
import { usePoolsQueryNew } from '@/hooks/fetch/usePoolsQuery.ts';
import { awaitDelay } from '@/utils/const.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ZapinService, { ZAPIN_FUNCTIONS, ZAPIN_TYPE } from '@/services/Web3Service/Zapin-service.ts';
import odosApiService from '@/services/odos-api-service.ts';
import { ethers } from 'ethers';
import { parseErrorLog } from '@/utils/errors.ts';
import { loadTokenImage } from '@/utils/tokenLogo.ts';
import ZapInStepsRow from '@/components/StepsRow/ZapinRow/MergeRow.vue';
import SwapRouting from '@/components/SwapRouting/Index.vue';
import type { IPositionsInfo } from '@/types/positions';
import type { PLATFORMS, TFilterPoolsParams } from '@/types/common/pools';

export default defineComponent({
  name: 'MergeForm',
  components: {
    ButtonComponent,
    PositionsModal,
    SwapSlippageSettings,
    BaseIcon,
    ZapInStepsRow,
    SwapRouting,
  },
  props: {
    zapPool: {
      type: Object as PropType<IPositionsInfo>,
      required: true,
      default: () => ({}),
    },
    gaugeAddress: {
      type: String,
      required: true,
    },
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
  },
  setup() {
    const { data: positionData } = usePositionsQuery();
    const { data: poolList } = usePoolsQueryNew();

    return {
      positionsList: positionData,
      poolList,
    };
  },
  data() {
    return {
      isMerged: false,
      currentStage: mergeStep.WITHDRAWNFT,
      showPositionsModal: false,
      positionsSelected: [] as string[],
      positionsData: [] as IPositionsInfo[],
      // before MERGE all positions should be unstaked and approved for zapin contract
      positionsStaked: [] as string[],
      positionsNotApproved: [] as string[],
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      initPositionTokens: [] as any[],
      newPositionTokens: [] as any[],
      poolTokens: [] as any[],
      gaugeContracts: [] as any[],
      zapContract: null as any,
      poolTokenContract: null as any,
      isSwapLoading: false,
      odosDataLoading: false,
      slippagePercent: 1,
      MODAL_TYPE,
      odosData: {} as any,
    };
  },
  computed: {
    ...mapGetters('network', ['networkId']),
    ...mapGetters('web3', ['evmSigner']),
    ...mapGetters('odosData', ['isAvailableOnNetwork']),
    ...mapGetters('accountData', ['account']),

    disableButtonMessage() {
      // if (!this.zapPool.position.isInRange) return 'OUT OF RANGE, MERGE UNAVAILABLE';

      return null;
    },
    // isDisableButton() {
    //   return !this.zapPool.position?.isInRange;
    // },
    totalLiq() {
      if (this.inputTokens.length === 0) return 0;

      const res: BN = this.inputTokens.reduce((acc, curr) => {
        const val = new BN(curr.value).times(curr.selectedToken.price).toFixed(6);

        return acc.plus(val);
      }, new BN(0));

      if (res.lt(0.01)) return '0.01';

      return res.toFixed(4);
    },
    getSymbolToken() {
      return getSymbolEmmToken(this.positionsData[0].platform[0]);
    },
    getImgToken() {
      return loadTokenImage(getSymbolEmmToken(this.positionsData[0].platform[0])).href;
    },
    getRewardUsd() {
      if (!this.getRewardTokenInfo) return 0;
      return this.getRewardEmm ? new BN(this.getRewardEmm)
        .times(this.getRewardTokenInfo?.price).toFixed(6) : 0;
    },
    getRewardEmm() {
      return this.positionsData?.length > 0
        ? new BN(this.positionsData[0].emissions).div(10 ** 18).toFixed(6) : '0';
    },
    getRewardTokenInfo() {
      const tokenInfo = getTokenBySymbol(this.getSymbolToken, this.zapAllTokens);

      return tokenInfo || null;
    },
    getFixedVal() {
      return (price: string) => {
        if (new BN(price).eq(0)) return 0;
        return new BN(price).toFixed(fixedByPrice(+price));
      };
    },
    v3RangeTicks() {
      if (!this.zapPool) return [];

      return [
        this.zapPool.ticks?.tickLower?.toString(),
        this.zapPool.ticks?.tickUpper.toString(),
      ];
    },
    isWithdrawDisabled() {
      return this.positionsData?.length === 0;
    },
    filteredPositions() {
      if (!this.zapPool || this.positionsList?.length === 0) return [];

      return this.positionsList
        .filter((_) => _?.platform[0] === this.zapPool?.platform[0])
        .filter((_) => _?.tokenId?.toString() !== this.zapPool?.tokenId?.toString());
    },
    zapAllTokens() {
      return mergedTokens(this.allTokensList as any[], this.balanceList as any[]);
    },
    selectedOutputTokens() {
      return this.outputTokens.filter((item: any) => item.selectedToken);
    },
  },
  watch: {
    currentStage(stage: withdrawStep) {
      this.$store.commit('zapinData/changeState', { field: 'currentStage', val: stage });
    },
  },
  mounted() {
    this.$store.commit('zapinData/changeState', { field: 'currentStage', val: withdrawStep.WITHDRAW });
    this.setStagesMap(MANAGE_FUNC.MERGE);
    this.setIsZapModalShow(true);

    this.initZapPoolData();
  },
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('poolsData', ['setIsZapModalShow']),
    ...mapActions('odosData', ['triggerSuccessZapin']),
    ...mapActions('waitingModal', ['closeWaitingModal', 'showWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('poolsData', ['setFilterParams']),
    ...mapMutations('waitingModal', ['setStagesMap']),

    commitEventToStore(field: string, value: any) {
      this.$store.commit('odosData/changeState', {
        field,
        val: value,
      });
    },
    async initZapPoolData() {
      if (this.zapPool?.isStaked) this.positionsStaked = [this.zapPool?.tokenId?.toString()];
      const contractsData = await initZapinContracts(
        this.zapPool,
        this.zapAllTokens,
        this.evmSigner,
        this.gaugeAddress,
      );

      this.gaugeContracts.push(contractsData.gaugeContract);
      this.poolTokens = contractsData.poolTokens;
    },
    clearApprove(tokenId: any) {
      const index = this.positionsNotApproved.indexOf(tokenId);
      if (index === -1) return;

      this.positionsNotApproved.splice(index, 1);

      if (this.positionsNotApproved?.length > 0) {
        console.log(this.positionsNotApproved, '___this.positionsNotApproved');
        this.approveNftPosition(this.positionsNotApproved[0]);
        this.currentStage = mergeStep.APPROVENFT;
      } else {
        this.mergeTrigger();
        this.currentStage = mergeStep.MERGE;
      }
    },
    clearStaked(index: number) {
      this.positionsStaked.splice(index, 1);
      this.gaugeContracts.splice(index, 1);

      if (this.positionsStaked?.length > 0) {
        this.withdrawTrigger(this.positionsStaked[0]);
        this.currentStage = mergeStep.WITHDRAWNFT;
      } else if (this.positionsNotApproved?.length > 0) {
        this.approveNftPosition(this.positionsNotApproved[0]);
        this.currentStage = mergeStep.APPROVENFT;
      }
    },
    clearPos() {
      this.positionsData = [];
      this.positionsSelected = [];
      this.inputTokens = [];
    },
    async selectPos(pos: IPositionsInfo) {
      this.positionsSelected = [pos.tokenId?.toString()];
      this.positionsData = [pos];
      this.handleClickSearch(pos);
      await awaitDelay(500);
      const gaugeAdd = this.searchGauge(pos);

      this.initContracts(pos, gaugeAdd);
    },
    showModalPos() {
      this.showPositionsModal = true;
    },
    handleClickSearch(zapPool: any) {
      if (!zapPool) return;
      const tokens = (zapPool?.name as string)?.split('/');

      const filterParams: Partial<TFilterPoolsParams> = {
        token0: tokens[0],
      };
      this.setFilterParams(filterParams);
    },
    searchGauge(pool: IPositionsInfo) {
      if (!this.poolList || this.poolList?.length === 0 || !pool) return '';
      const foundPool = this.poolList
        .find((_: any) => _.address?.toLowerCase() === pool.address?.toLowerCase());

      if (foundPool) return foundPool.gauge;
      return '';
    },
    async initContracts(pos: IPositionsInfo, gaugeAddress: string) {
      const contractsData = await initZapinContracts(
        pos,
        this.zapAllTokens,
        this.evmSigner,
        gaugeAddress,
      );

      this.gaugeContracts.push(contractsData.gaugeContract);
      this.zapContract = contractsData.zapContract;
      this.poolTokenContract = contractsData.poolTokenContract;

      if (pos?.isStaked) this.positionsStaked.push(pos.tokenId?.toString());

      if (!this.isAvailableOnNetwork) this.mintAction();

      this.initLiqTokens();

      this.checkNftsApprove([this.zapPool?.tokenId?.toString(), pos.tokenId?.toString()]);
    },

    async approveNftPosition(tokenId: string) {
      this.isSwapLoading = true;

      try {
        console.log(tokenId, '__isApproved');
        this.showWaitingModal('Approve');
        const tx = await this.poolTokenContract.approve(this.zapContract?.target, tokenId);

        await tx.wait();
        await awaitDelay(1000);
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.clearApprove(tokenId);
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
    initLiqTokens() {
      const tokens = this.positionsData[0].name.split('/');
      const token0 = getTokenByAddress(this.positionsData[0]?.token0Add, this.zapAllTokens);
      const token1 = getTokenByAddress(this.positionsData[0]?.token1Add, this.zapAllTokens);

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
        const val = this.positionsData[0].position?.tokens[key][tokens[key]];
        const valOrig = this.positionsData[0].position?.tokensOrig[key][tokens[key]];

        return {
          ..._,
          contractValue: valOrig,
          value: new BN(val).toFixed(fixedByPrice(+val)),
          sum: new BN(val).toFixed(fixedByPrice(+val)),
        };
      });

      this.initPositionTokens = arrTokens;

      const inputTokenInfo = formatInputTokens(arrTokens);
      this.inputTokens = inputTokenInfo;

      const tokenA = initOutputToken(this.poolTokens[0], true, 50);
      const tokenB = initOutputToken(this.poolTokens[1], true, 50);
      this.outputTokens = [tokenA, tokenB];

      this.recalculateProportion();
    },
    handleCurrentSlippageChanged(newSlippage: number) {
      this.slippagePercent = newSlippage;
    },
    async odosSwapRequest(requestData: any) {
      return odosApiService
        .quoteRequest(requestData)
        .then((data) => {
          this.$store.commit('odosData/changeState', {
            field: 'swapResponseInfo',
            val: data,
          });
          return data;
        })
        .catch((e) => {
          this.closeWaitingModal();
          if (e && e.message && e.message.includes('path')) {
            this.showErrorModalWithMsg({ errorType: 'odos-path', errorMsg: e });
            return;
          }

          this.showErrorModalWithMsg({ errorType: 'odos', errorMsg: e });
        });
    },
    async mergeTrigger() {
      this.isSwapLoading = true;
      this.odosDataLoading = true;

      try {
        this.showWaitingModal('unstaking');

        const recalculateProportionParams = {
          selectedInputTokens: this.inputTokens,
          selectedOutputTokens: this.selectedOutputTokens,
          zapPool: this.zapPool,
          zapContract: this.zapContract,
          v3RangeTicks: this.v3RangeTicks,
          networkId: this.networkId,
          slippageLimitPercent: this.slippagePercent,
          odosSwapRequest: this.odosSwapRequest,
          simulateSwap: true,
          typeFunc: ZAPIN_TYPE.MERGE,
          showErrorModalWithMsg: this.showErrorModalWithMsg,
          mergeIds: this.positionsSelected,
        };

        const data = await ZapinService.recalculateProportionOdosV3(recalculateProportionParams);

        console.log(data, '__data');
        if (!data || (data && !data.odosData)) {
          this.odosDataLoading = false;
          this.isSwapLoading = false;
          return;
        }

        const assembleData = {
          userAddr: ethers.getAddress(
            this.zapContract.target?.toLowerCase(),
          ),
          pathId: data.odosData?.pathId,
          simulate: true,
        };

        odosApiService
          .assembleRequest(assembleData)
          .then(async (responseAssembleData) => {
            await this.initZapInTransaction(
              responseAssembleData,
              data.inputTokens,
              data.outputTokensForZap,
              data.amountOut,
              data.amountMins,
            );
          });

        this.closeWaitingModal();
      } catch (e) {
        console.log(e);
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
    },
    async initZapInTransaction(
      responseData: any,
      requestInputTokens: any[],
      requestOutputTokens: any[],
      proportions: any,
      amountMins: string[],
    ) {
      const requestData = initReqData(
        requestInputTokens,
        requestOutputTokens,
        this.zapContract.target,
      );

      const { txData, gaugeData } = initZapData(
        requestData,
        responseData,
        amountMins,
        this.slippagePercent,
        this.zapPool.address,
        proportions,
        {
          ticks: this.v3RangeTicks,
        },
      );

      this.showWaitingModal('Staking in process');

      const params = {
        from: this.account,
        gasPrice: ethers.parseUnits('100', 'gwei'),
        gasLimit: 1000000,
      };

      console.log(this.zapContract, '-this.zapContract');
      console.log(txData, 'swapdata');
      console.log(gaugeData, 'gaugeData');
      console.log((params), 'params');

      const tokensMerge = this.positionsData.map((_) => _.tokenId?.toString());

      console.log(
        this.zapPool?.tokenId?.toString,
        tokensMerge,
        '___PARAMS',
      );

      try {
        const logsData = await ZapinService
          .triggerZapin(
            this.zapContract,
            txData,
            gaugeData,
            params,
            ZAPIN_FUNCTIONS.MERGE,
            this.zapPool.tokenId?.toString(),
            tokensMerge,
          );

        console.log(logsData, '___receipt');
        if (!logsData) throw new Error('No Transaction');

        this.$store.commit('odosData/changeState', {
          field: 'lastParsedZapResponseData',
          val: markRaw(logsData),
        });

        parseLogs(logsData, this.commitEventToStore);

        this.approveForGauge();
        this.isMerged = true;
        this.currentStage = mergeStep.APPROVE_GAUGE;
      } catch (e: any) {
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.showErrorModalWithMsg({
          errorType: 'zap',
          errorMsg: parseErrorLog(e),
        });
      }
    },
    async withdrawTrigger(tokenId: string) {
      console.log(tokenId, 'unstakeTrigger');
      this.isSwapLoading = true;

      const indexOfToken = this.positionsStaked.indexOf(tokenId);

      if (indexOfToken === -1) {
        this.isSwapLoading = false;
        return;
      }

      try {
        this.showWaitingModal('unstaking');

        await ZapinService.withdrawTrigger(
          this.zapPool,
          tokenId,
          this.gaugeContracts[indexOfToken],
          this.account,
        );

        console.log('WITHDRAW');
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.clearStaked(indexOfToken);
      } catch (e) {
        console.log(e);
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
    },
    async approveForGauge() {
      this.isSwapLoading = true;

      const contractsData = await initZapinContracts(
        this.zapPool,
        this.zapAllTokens,
        this.evmSigner,
        this.gaugeAddress,
      );

      try {
        this.showWaitingModal('Approve');
        const tx = await this.poolTokenContract
          .approve(contractsData.gaugeContract?.target, this.zapPool?.tokenId);

        await tx.wait();
        this.stakeTrigger();
        this.closeWaitingModal();
        this.currentStage = mergeStep.STAKE_LP;
      } catch (e) {
        console.log(e);
        this.closeWaitingModal('Approve');
        this.isSwapLoading = false;
      }
    },
    async stakeTrigger() {
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('staking');

        const contractsData = await initZapinContracts(
          this.zapPool,
          this.zapAllTokens,
          this.evmSigner,
          this.gaugeAddress,
        );

        const tx = await ZapinService.stakeTrigger(
          this.zapPool.platform[0] as PLATFORMS,
          contractsData.gaugeContract,
          this.zapPool.tokenId?.toString(),
          this.account,
          this.poolTokenContract,
        );

        if (!tx) throw new Error('no stake transaction');

        this.isSwapLoading = false;
        const inputTokens = [...this.inputTokens];
        const outputTokens = [...this.selectedOutputTokens];
        this.triggerSuccessZapin(
          {
            isShow: true,
            inputTokens,
            outputTokens,
            hash: tx.hash,
            pool: this.zapPool,
            modalType: MODAL_TYPE.MERGE,
          },
        );
        this.closeWaitingModal();
      } catch (e) {
        console.log(e);
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
    },
    async checkNftsApprove(nftIds: string[]) {
      if (!this.poolTokenContract) return;

      nftIds.forEach(async (_) => {
        const isApproved = await this.poolTokenContract.getApproved(_);

        if (isApproved?.toLowerCase() !== this.zapContract?.target?.toLowerCase()) {
          this.positionsNotApproved.push(_);
        }
      });
    },
    async recalculateProportion() {
      if (!this.v3RangeTicks || this.inputTokens?.length === 0) return;

      this.odosDataLoading = true;

      try {
        console.log(this.positionsSelected, '__POS');
        const recalculateProportionParams = {
          selectedInputTokens: this.inputTokens,
          selectedOutputTokens: this.selectedOutputTokens,
          zapPool: this.zapPool,
          zapContract: this.zapContract,
          v3RangeTicks: this.v3RangeTicks,
          networkId: this.networkId,
          slippageLimitPercent: this.slippagePercent,
          odosSwapRequest: this.odosSwapRequest,
          simulateSwap: true,
          typeFunc: ZAPIN_TYPE.MERGE,
          showErrorModalWithMsg: this.showErrorModalWithMsg,
          mergeIds: this.positionsSelected,
        };

        const data = await ZapinService.recalculateProportionOdosV3(recalculateProportionParams);

        if (!data || (data && !data.odosData)) {
          this.odosDataLoading = false;
          return;
        }

        this.newPositionTokens = data.outputTokens.map((token: any, i) => ({
          ...token,
          sum: new BN(token.sum).plus(new BN(this.inputTokens[i].sum)).toFixed(),
          value: new BN(token.sum).plus(new BN(this.inputTokens[i].sum)).toFixed(),
        }));

        const totalFinalOutputUsd = this.newPositionTokens
          .reduce((acc: any, curr: any) => acc
            .plus(new BN(curr.sum).times(curr.selectedToken?.price)), new BN(0)).toFixed();

        this.outputTokens = data?.outputTokens;
        this.odosData = {
          ...data.odosData,
          netOutValue: totalFinalOutputUsd,
        };
        this.odosDataLoading = false;
      } catch (e) {
        this.showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
        this.odosDataLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "./styles.scss"
</style>

<style lang="scss" scoped>
@import "../styles.scss"
</style>
