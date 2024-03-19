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
        You successfully staked
      </h1>

      <div
        v-if="successData"
        class="modal-content__data"
      >
        <div class="modal-content__data-logo">
          <img
            alt="img"
            v-if="successData.pool.token0Icon"
            :src="successData.pool.token0Icon"
          />
          <img
            alt="img"
            v-if="successData.pool.token1Icon"
            :src="successData.pool.token1Icon"
          />
          <img
            alt="img"
            v-if="successData.pool.token2Icon"
            :src="successData.pool.token2Icon"
          />
          <img
            alt="img"
            v-if="successData.pool.token3Icon"
            :src="successData.pool.token3Icon"
          />
        </div>
        <div class="modal-content__data-main">
          <div class="modal-content__data-row">
            <div class="success-token-title">Pool name</div>
            <span class="success-data-item">
              {{ successData.pool.name }}
            </span>
          </div>
          <div class="modal-content__data-row">
            <div class="success-token-title">Staking platform</div>
            <span class="success-data-item">
              {{ successData.pool.platform[0][0] }}
            </span>
          </div>
          <div class="modal-content__data-row">
            <div class="success-token-title">Swapped from</div>
            <div class="success-data-list">
              <span
                v-for="(token, index) in successData.inputTokens"
                :key="token.symbol"
                class="success-data-item"
              >
                {{
                  index === 0 && token.selectedToken
                    ? token.selectedToken.symbol
                    : ", " + token.selectedToken.symbol
                }}
              </span>
            </div>
          </div>
          <div class="modal-content__data-row">
            <div class="success-token-title">Swapped to</div>
            <div class="success-data-list">
              <span
                v-for="(token, index) in successData.outputTokens"
                :key="token.symbol"
                class="success-data-item"
              >
                {{
                  index === 0 && token.selectedToken
                    ? token.selectedToken.symbol
                    : ", " + token.selectedToken.symbol
                }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-content__data-main">
          <div class="modal-content__data-row modal-content__data-row--stake">
            <div class="success-token-title">
              Received stake position
            </div>
            <div class="success-data-list">
              <div
                v-for="stake in (tokensStakeList as any)"
                :key="stake.id"
                class="success-position-data-item"
              >
                {{ stake.value }}
                {{ stake.token.symbol }}
              </div>
            </div>
          </div>

          <div class="modal-content__data-row">
            <div class="success-token-title">Returned in wallet</div>
            <div class="success-data-list">
              <div
                v-for="returnData in tokensReturnList"
                :key="returnData.id"
                class="success-data-item"
              >
                {{ formatMoney(returnData.value, 6) }}
                {{ returnData.token.symbol }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-content__data-row">
          <a
            :href="openPositionOnPool"
            target="_blank"
            rel="noopener noreferrer"
            class="platform-position-container text-center mt-5"
          >
            <ButtonComponent btn-styles="link">MY POSITION IN POOL</ButtonComponent>
          </a>

          <div class="modal-content__link">
            <a
              :href="openOnExplorer"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Scan
            </a>
            <BaseIcon name="scan-open" />
          </div>
        </div>
      </div>
      <div class="divider" />

      <!-- <div>
            <Carousel />
          </div> -->
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from '@/components/Modal/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { mapGetters } from 'vuex';
import { formatMoney } from '@/utils/numbers.ts';

export default {
  name: 'SuccessZapModal',
  components: {
    ModalComponent,
    ButtonComponent,
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
  },
  data() {
    return {
      tokensStakeList: [] as any[],
      tokensReturnList: [] as any[],
      showModal: false,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
    successData(val) {
      if (val) {
        this.initStakeList();
        this.initReturnList();
      }
    },
  },
  mounted() {
    this.initStakeList();
    this.initReturnList();
  },
  computed: {
    ...mapGetters('network', ['getParams']),
    openPositionOnPool() {
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

      if (this.successData.pool.platform[0] === 'Curve') {
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
    initStakeList() {
      if (!this.successData || !this.successData.inputTokens) return;

      for (let i = 0; i < this.successData.inputTokens.length; i++) {
        const token = this.successData.inputTokens[i];
        const { value } = token;

        this.tokensStakeList.push({
          id: `${token.id}stake`,
          token: token.selectedToken,
          value,
        });
      }
    },
    initReturnList() {
      if (!this.successData || !this.successData.outputTokens) {
        return;
      }

      for (let i = 0; i < this.successData.outputTokens.length; i++) {
        const token = this.successData.outputTokens[i];
        const value = token.sum;
        this.tokensReturnList.push({
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
  min-width: 600px;
  padding: 50px 70px 30px 70px;

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
}

.modal-content__data {
  width: 100%;
}

.modal-content__data-logo {
  text-align: center;
}

.modal-content__data-main {
  margin: 20px 0;
}

.modal-content__data-row {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}

.modal-content__data-row--stake {
  margin-bottom: 10px;
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

  span, h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  &:first-child {
    span {
      color: var(--color-18);
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
