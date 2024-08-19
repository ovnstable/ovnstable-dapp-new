<template>
  <div class="pool-data">
    <div class="pool-data__title">
      <div class="pool-data__name">
        <div class="pool-data__name-imgs">
          <img
            alt="token"
            :src="zapPool.token0Icon"
          />
          <img
            alt="token"
            :src="zapPool.token1Icon"
          />
        </div>

        <h1>
          {{ zapPool.name }}
        </h1>
      </div>
      <span class="pool-data__divider" />
      <div>
        <span>
          <div
            class="pools-data__range"
            :class="{ 'out-range': !zapPool?.position?.isInRange }"
          >
            {{ zapPool?.position?.isInRange ? 'IN RANGE' : 'OUT OF RANGE' }}
          </div>
        </span>
        <div class="pool-data__row">
          <div class="pool-data__plat">
            <BaseIcon :name="zapPool.platform[0]" />
            <span>
              {{ zapPool.platform[0] }}
            </span>
          </div>

          <span class="pool-data__id">
            ID: #{{ zapPool.tokenId?.toString() }}
          </span>
        </div>
      </div>
    </div>
    <div class="pool-data__liq swap-block__item-col--send">
      <div class="pool-data__header">
        <h1>
          LIQUIDITY
        </h1>

        <div>
          ${{ totalLiq }}
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
        <div
          v-if="token.value"
          class="swap-block__item-bal"
        >
          <div v-if="token.value">
            {{ token.displayedValue }}
          </div>
          <div>
            ~ ${{ getFixedVal(token.usdValue) }}
          </div>
        </div>
      </div>
      <!-- <span class="divider" /> -->
    </div>
    <div class="pool-data__rewards swap-block__item-col--send">
      <div class="pool-data__header">
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
</template>

<script lang="ts">
import { getNewInputToken, getTokenByAddress } from '@/store/helpers/index.ts';
import { poolTokensForZapMap } from '@/store/views/main/zapin/mocks.ts';
import { formatInputTokens } from '@/utils/tokens.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import BN from 'bignumber.js';
import { REWARD_TOKEN } from '@/store/views/main/zapin/index.ts';
import { loadTokenImage } from '@/utils/tokenLogo.ts';
import { allTokensMap } from '@/hooks/fetch/useTokensQuery.ts';
import { fixedByPrice } from '@/utils/numbers.ts';

export default {
  name: 'PositionForm',
  components: {
    BaseIcon,
  },
  props: {
    allTokensList: {
      type: Array,
      required: false,
      default: null,
    },
    zapPool: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      rewardTokens: [] as any,
      inputTokens: [] as any,
      isLoaded: false,
    };
  },
  computed: {
    getFixedVal() {
      return (price: string) => {
        if (new BN(price).eq(0)) return 0;
        return new BN(price).toFixed(fixedByPrice(+price));
      };
    },
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
      if (this.allTokensList.length === 0) return 0;

      const res: BN = this.inputTokens.reduce((acc: BN, curr: any) => {
        const val = new BN(curr.value).times(curr.selectedToken?.price).toFixed(6);

        return acc.plus(val);
      }, new BN(0));

      if (res.lt(0.01)) return '0.01';

      return res.toFixed(4);
    },
  },
  watch: {
    allTokensMap() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.isLoaded) return;
      this.initLiqTokens();
      this.initRewardTokens();
    },
    initLiqTokens() {
      const poolTokens = poolTokensForZapMap[this.zapPool.address];
      console.log(this.allTokensList, '__this.allTokensList');
      const token0 = getTokenByAddress(poolTokens[0].address, this.allTokensList);
      const token1 = getTokenByAddress(poolTokens[1].address, this.allTokensList);

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

      const symbName = this.zapPool?.name?.split('/');

      console.log(this.zapPool?.position?.tokens, '__this.zapPool?.position?.tokens');
      arrTokens = arrTokens.map((_: any, key: number) => {
        const price = this.zapPool?.position?.tokens[key][symbName[key]];

        return {
          ..._,
          value: new BN(price).toFixed(fixedByPrice(price)),
          sum: new BN(price).toFixed(fixedByPrice(price)),
        };
      });

      console.log(arrTokens, '__arrTokens');
      const inputTokenInfo = formatInputTokens(arrTokens);
      this.inputTokens = inputTokenInfo;
    },
    initRewardTokens() {
      const rewardToken = this.zapPool.rewards.tokens.map((_: any) => {
        const rewardData: any = Object.entries(_)[0];
        const tokenInfo = allTokensMap(this.allTokensList).values().find((_: any) => {
          const allTokSymbol = _?.symbol?.toLowerCase();
          return allTokSymbol === rewardData[0]?.toLowerCase();
        });

        return {
          displayedValue: new BN(rewardData[1] ?? 0).toFixed(8),
          id: Date.now().toString(),
          locked: true,
          proportion: 0,
          selectedToken: tokenInfo,
          sum: new BN(rewardData[1] ?? 0).toFixed(6),
          usdValue: new BN(rewardData[1] ?? 0).times(tokenInfo.price).toFixed(6),
          value: new BN(rewardData[1] ?? 0).toFixed(6),
        };
      });

      this.rewardTokens = rewardToken;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./ZapForm/styles.scss";

.pool-data {
  display: flex;
  gap: 40px;
  border: 2px solid var(--color-1);
  background-color: var(--color-4);
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 34px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-1);
  }

  [data-theme="dark"] & {
        background-color: var(--color-6);
        background-blend-mode: unset;
    }
}

.pool-data__name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pool-data__name-imgs {
  display: flex;

  img {
    width: 30px;
    height: 30px;
  }
}

.pool-data__row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    width: 30px;
    height: 30px;
  }
}

.pool-data__id {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-2);
}

.pool-data__plat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pools-data__range {
  text-align: right;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-12);

  &.out-range {
    color: red;
  }
}

.pool-data__divider {
  display: block;
  width: 100%;
  height: 1px;
  background-color: var(--color-6);
  margin: 20px 0;
}

.pool-data__header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    color: var(--color-3);
    font-size: 20px;
    font-weight: 600;
  }
}

.pool-data__liq {
  width: 100%;
  margin-top: 0;
}

.pool-data__title {
  width: 100%;
  padding: 30px;
  border-radius: 20px;
  background-color: var(--color-8);
  border: 1px solid var(--color-6);
}

.pool-data__rewards {
  width: 100%;
  margin-top: 0;
}
</style>
