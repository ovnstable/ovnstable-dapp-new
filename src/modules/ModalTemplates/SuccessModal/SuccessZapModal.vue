<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >

    <div class="modal-content">
      <BaseIcon
        class="modal-content__icon"
        name="CommonSuccess"
      />
      <h1>
        YOU SUCCESSFULLY ZAP IN
      </h1>

      <span class="divider" />

      <div class="zap-header-container">
        <PoolLabel :pool="successData.pool" />
        <div class="modal-content__data-row">
          <a
            :href="openPositionOnPool"
            target="_blank"
            rel="noopener noreferrer"
            class="view-position-link"
          >
            <ButtonComponent btn-styles="link">
              VIEW POSITION
              <BaseIcon name="PayoutArrow" />
            </ButtonComponent>
          </a>
        </div>
      </div>

      <span class="divider" />

      <div
        v-if="successData"
        class="modal-content__data"
      >

        <div class="modal-content__data-main">
          <div class="data-row sent">
            <div class="success-row-title">
              Sent
            </div>
            <div class="success-data-list">
              <div
                v-for="sentData in (tokensSentList as any)"
                :key="sentData.id"
                class="token-amount"
              >
                - {{ sentData.value }}
                {{ sentData.token.symbol }}
              </div>
            </div>
          </div>

          <div class="data-row returned">
            <div class="success-row-title">Returned</div>
            <div class="success-data-list">
              <div
                v-for="returnData in tokensReturnList"
                :key="returnData.id"
                class="token-amount"
              >
                + {{ formatMoney(returnData.value, 6) }}
                {{ returnData.token.symbol }}
              </div>
            </div>
          </div>

          <div class="data-row staked">
            <div class="success-row-title">
              Staked
            </div>
            <div class="success-data-list">
              <div
                v-for="stakeData in (tokensStakedList as any)"
                :key="stakeData.id"
                class="token-amount"
              >
                + {{ formatMoney(stakeData.value, 6) }}
                {{ stakeData.token.symbol }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <span class="divider" />

      <div class="zap-modal-footer">
        Leave your feedback on Zap In feature and win $50 reward
        <a
          href='https://forms.gle/BCwwX4yhGW7EadTCA'
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
import PoolLabel from '@/modules/Main/components/ZapModal/PoolLabel.vue';
import { mapGetters } from 'vuex';
import { formatMoney } from '@/utils/numbers.ts';
import BigNumber from 'bignumber.js';

export default {
  name: 'SuccessZapModal',
  components: {
    ModalComponent,
    ButtonComponent,
    PoolLabel,
    BaseIcon,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    setShowFunc: {
      type: Function,
      required: true,
    },
    successData: {
      type: Object,
      required: true,
    },
    returnedToUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tokensSentList: [] as any[],
      tokensReturnList: [] as any[],
      tokensStakedList: [] as any[],
      showModal: this.isShow,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
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
  computed: {
    ...mapGetters('network', ['getParams']),
    openPositionOnPool(): string {
      if (!this.successData.pool) return '';

      if (this.successData.pool.platform[0] === 'Lynex') {
        return `https://app.lynex.fi/liquidity/manage/${this.successData.pool.address}`;
      }
      if (this.successData.pool.platform[0] === 'Chronos') {
        return `https://app.chronos.exchange/liquidity/${this.successData.pool.address}`;
      }

      if (this.successData.pool.platform[0] === 'Thena') {
        return `https://www.thena.fi/liquidity/manage/${this.successData.pool.address}`;
      }

      if (this.successData.pool.platform[0] === 'Ramses') {
        return `https://app.ramses.exchange/liquidity/${this.successData.pool.address}`;
      }

      if (this.successData.pool.platform[0] === 'Velodrome') {
        return 'https://velodrome.finance/dash';
      }

      if (this.successData.pool.platform[0] === 'Aerodrome') {
        return 'https://aerodrome.finance/dash';
      }

      if (this.successData.pool.platform[0] === 'Arbidex') {
        return 'https://arbidex.fi/xarxfarms';
      }

      if (this.successData.pool.platform[0] === 'Baseswap') {
        return 'https://baseswap.fi/farms';
      }

      if (this.successData.pool.platform[0] === 'Alienbase') {
        return 'https://app.alienbase.xyz/farms';
      }

      if (this.successData.pool.platform[0] === 'Swapbased') {
        return 'https://swapbased.finance/#/farm';
      }

      if (this.successData.pool.platform[0] === 'Velocimeter') {
        return 'https://base.velocimeter.xyz/liquidity';
      }

      if (this.successData.pool.platform[0] === 'Sperax') {
        return `https://demeter.sperax.io/farm/42161/${this.successData.pool.address}`;
      }

      if (this.successData.pool.platform[0] === 'Defiedge') {
        return `https://app.defiedge.io/s/optimism/${this.successData.pool.address}`;
      }

      if (this.successData.pool.address === '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013') {
        return 'https://curve.fi/#/arbitrum/pools/factory-v2-117';
      }

      if (this.successData.pool.address === '0x1446999B0b0E4f7aDA6Ee73f2Ae12a2cfdc5D9E7') {
        return 'https://curve.fi/#/arbitrum/pools/factory-stable-ng-15';
      }

      if (this.successData.pool.address === 'Curve') {
        return 'https://curve.fi/#/base/pools/factory-v2-2/deposit';
      }

      if (this.successData.pool.platform[0] === 'Convex') {
        return 'https://www.convexfinance.com/stake/arbitrum/13';
      }

      if (this.successData.pool.platform[0] === 'Beefy') {
        return 'https://app.beefy.com/dashboard';
      }

      if (this.successData.pool.platform[0] === 'Pancake') {
        return `https://pancakeswap.finance/info/v3/arb/pairs/${this.successData.pool.address}`;
      }

      console.error(
        'Open Position failed, dex not found.',
        this.successData.pool.platform[0],
      );

      return '';
    },
    openOnExplorer() {
      const { explorerUrl } = this.getParams(this.successData.chain);
      return `${explorerUrl}tx/${this.successData.hash}`;
    },
  },
  methods: {
    formatMoney,
    closeModal() {
      this.setShowFunc({ isShow: false });
    },
    initSentList() {
      if (!this.successData || !this.successData.inputTokens) return;

      for (let i = 0; i < this.successData.inputTokens.length; i++) {
        const token = this.successData.inputTokens[i];
        const { value } = token;

        this.tokensSentList.push({
          id: `${token.id}stake`,
          token: token.selectedToken,
          value,
        });
      }
    },
    initReturnedList(): any[] {
      if (!this.successData || !this.successData.outputTokens || !this.returnedToUser) {
        return [];
      }

      console.log('__retUserSuccessParse', this.returnedToUser);

      // eslint-disable-next-line prefer-destructuring
      const outputTokens = this.successData.outputTokens;
      console.log(outputTokens.length);

      for (let i = 0; i < outputTokens.length; i++) {
        const token = outputTokens[i];
        // eslint-disable-next-line no-restricted-globals
        const valDecimals = (18 - token.selectedToken.decimals) ?? 18;
        const fValue = new BigNumber(this.returnedToUser.amounts[i])
          .div(10 ** 15).toString();
        const fValue2 = new BigNumber(this.returnedToUser.amounts[i])
          .div(10 ** valDecimals).toString();
        const value = new BigNumber(fValue).isNaN() ? '0' : fValue;
        this.tokensReturnList.push({
          id: `${token.id}return`,
          token: token.selectedToken,
          value,
          fValue2,
        });
        console.log('__returnedFinal', this.tokensReturnList);
      }
      return this.tokensReturnList;
    },
    initStakedList() {
      if (!this.successData || !this.successData.outputTokens) {
        return;
      }

      for (let i = 0; i < this.successData.outputTokens.length; i++) {
        const token = this.successData.outputTokens[i];
        // eslint-disable-next-line no-restricted-globals
        const value = new BigNumber(token.sum).isNaN() ? '0' : token.sum;
        this.tokensStakedList.push({
          id: `${token.id}return`,
          token: token.selectedToken,
          value,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  min-width: 600px;
  padding: 50px 30px 30px 30px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-1);
    margin-bottom: 20px;
  }

  img {
    width: 32px;
    height: 32px;
  }

  .zap-header-container {
    width: 100%;
    display: flex;
    gap: 10px;
    flex-direction: column;
  }

  .zap-header {
    width: 100%;
    background: none;
    margin: none;
    padding: none;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: var(--color-7);
  }

  .zap-modal-footer {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;

    .button {
      color: var(--color-4);
      border-radius: 50px;
      gap: 20px;
      padding: 5px 10px;
      background-color: var(--color-3);

      &:hover {
        background-color: var(--color-4);
        color: var(--color-3);
      }

      svg {
        fill: var(--color-4);
        path: {
          fill: var(--color-4);
        }
      }
    }

  }
}

.modal-content__data {
  width: 100%;
}

.modal-content__data-logo {
  text-align: center;
}

.modal-content__data-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .view-position-link .button {
    border: 1px solid var(--color-2);
    color: var(--color-2);
    border-radius: 50px;
    gap: 20px;
    padding: 5px 10px;

    &:hover {
        background-color: var(--color-3);
        color: var(--color-4);
      }

    svg {
      fill: var(--color-2);
      height: 80%;
    }
  }
}

.modal-content__data-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  font-weight: 500;

  .data-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 16px;

    &.sent .token-amount {
      color: var(--color-14);
    }

    &.staked .token-amount {
      color: var(--color-3);
    }

    &.returned .token-amount {
      color: var(--color-12);
    }

    .success-row-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .success-data-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
}

.modal-content__link {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-content__icon {
  width: 90px;
  height: 90px;
  margin-bottom: 20px;
}

.modal-content__tokens {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 50px;
  margin-bottom: 30px;
}

.modal-content__tokens-col {
  text-align: center;

  span,
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  &:first-child {
    span {
      color: var(--color-1);
    }
  }

  &:last-child {
    span {
      color: var(--color-12);
    }
  }
}

@media (max-width: 640px) {
  .modal-content {
    padding: 5px 7px 3px 7px;
    min-width: 0;
    max-width: 400px;
  }

  .modal-content__link {
    margin-left: 40px;
  }
}
</style>
