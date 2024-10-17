<!-- eslint-disable vuejs-accessibility/anchor-has-content -->
<template>
  <div class="pool-data">
    <div class="pool-data_wrapper">
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

            <div class="pool-data__nft-id">
              <span class="pool-data__id">
                ID: #{{ zapPool.tokenId?.toString() }}
              </span>
              <div
                @click="copyToClipBoard(zapPool.tokenId)"
                @keypress="copyToClipBoard(zapPool.tokenId)"
              >
                <BaseIcon
                  name="Copy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="usd_prices_wrapper">
        <div
          class="swap-block__item usd_price_row"
        >
          <span>
            Current price,
            {{ priceProportionTokens?.[0]?.symbol }} per
            {{ priceProportionTokens?.[1]?.symbol }}
          </span>
          <span class="usd_price">
            {{ getFixedVal(priceProportionValue) }}
          </span>
        </div>
        <div class="swap-block__item usd_price_row">
          <span>
            View price in:
          </span>
          <ButtonComponent
            :btn-styles="'grey'"
            @click="switchPrices"
          >
            <BaseIcon
              class="row-icon"
              name="SwapIconV3"
            />
            {{ priceProportionTokens?.[0]?.symbol }}
          </ButtonComponent>
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
          ${{ getRewardTotalUsd }}
        </div>
      </div>
      <span class="divider" />
      <div
        v-for="token in rewardTokens"
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
            {{ token.displayedValue }}
          </div>
          <div>
            ~ ${{ token.usdValue }}
          </div>
        </div>
      </div>
      <template v-if="getRewardUsd">
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
      </template>
      <template v-if="zapPool.merkleData.toClaim">
        <span class="divider" />
        <div
          class="swap-block__item"
        >
          <div
            class="swap-block__item-row"
          >
            <div class="swap-block__item-row--token-wrap">
              <img
                :src="getImgBySymbol(zapPool.merkleData.rewardToken?.symbol) as any"
                alt="select-token"
              >
              <span>
                {{ zapPool.merkleData.rewardToken?.symbol?.toUpperCase() }}
              </span>
            </div>
          </div>
          <div
            class="swap-block__item-bal"
          >
            <div>
              {{ zapPool.merkleData.toClaim }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { getNewInputToken, getTokenByAddress, getTokenBySymbol } from '@/store/helpers/index.ts';
import { formatInputTokens } from '@/utils/tokens.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import BN from 'bignumber.js';
import { loadTokenImage } from '@/utils/tokenLogo.ts';
import { fixedByPrice } from '@/utils/numbers.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import ButtonComponent from '@/components/Button/Index.vue';
import { getSymbolEmmToken } from '@/services/Web3Service/utils/index.ts';

export default {
  name: 'PositionForm',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  props: {
    allTokensList: {
      type: Array,
      required: false,
      default: null,
    },
    balanceList: {
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
      priceProportionTokens: [] as any,
      priceProportionValue: '' as any,
    };
  },
  computed: {
    getImgBySymbol() {
      return (symbol: string) => loadTokenImage(symbol);
    },
    getSymbolToken() {
      return getSymbolEmmToken(this.zapPool.platform[0]);
    },
    getFixedVal() {
      return (price: string) => {
        if (new BN(price).eq(0)) return 0;
        return new BN(price).toFixed(fixedByPrice(+price));
      };
    },
    zapAllTokens() {
      return mergedTokens(this.allTokensList as any[], this.balanceList as any[]);
    },
    getImgToken() {
      return loadTokenImage(getSymbolEmmToken(this.zapPool.platform[0])).href;
    },
    getRewardTotalUsd() {
      const res: BN = this.rewardTokens.reduce((acc: BN, curr: any) => {
        const val = new BN(curr.value).times(curr.selectedToken?.price).toFixed(6);

        return acc.plus(val);
      }, new BN(0));

      if (!this.getRewardUsd && res.eq(0)) return 0;

      return this.getRewardUsd ? new BN(this.getRewardUsd).plus(res).toFixed(6) : res.toFixed(6);
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
      const tokenInfo = getTokenBySymbol(this.getSymbolToken, this.zapAllTokens);

      return tokenInfo || null;
    },
    totalLiq() {
      if (this.zapAllTokens.length === 0) return 0;

      const res: BN = this.inputTokens.reduce((acc: BN, curr: any) => {
        const val = new BN(curr.value).times(curr.selectedToken?.price).toFixed(6);

        return acc.plus(val);
      }, new BN(0));

      if (res.lt(0.01)) return '0.01';

      return res.toFixed(4);
    },
  },
  mounted() {
    this.init();
    this.initRewardTokens()
    console.log(this.zapPool, '__ZAP')
  },
  methods: {
    init() {
      if (this.isLoaded) return;
      this.initLiqTokens();
      this.switchPrices();
    },
    initLiqTokens() {
      const token0 = getTokenByAddress(this.zapPool?.token0Add, this.zapAllTokens);
      const token1 = getTokenByAddress(this.zapPool?.token1Add, this.zapAllTokens);

      console.log(token1, '___tokenInfo2323')
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

      arrTokens = arrTokens.map((_: any, key: number) => {
        const price = this.zapPool?.position?.tokens[key][symbName[key]];

        return {
          ..._,
          value: new BN(price).toFixed(fixedByPrice(price)),
          sum: new BN(price).toFixed(fixedByPrice(price)),
        };
      });

      const inputTokenInfo = formatInputTokens(arrTokens);
      this.inputTokens = inputTokenInfo;
    },
    initRewardTokens() {
      const rewardToken = this.zapPool.rewards.tokens.map((_: any) => {
        const rewardData: any = Object.entries(_)[0];

        const tokenInfo = getTokenBySymbol(rewardData[0]?.toLowerCase(), this.zapAllTokens);

        if (!tokenInfo) return null

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

      console.log(rewardToken, '___rewardToken')

      this.rewardTokens = rewardToken;
    },
    copyToClipBoard(textToCopy: string) {
      navigator.clipboard.writeText(textToCopy);
    },
    switchPrices() {
      const tokensReversed = this.priceProportionTokens.length > 0
        ? this.priceProportionTokens.reverse()
        : this.inputTokens.map((token: any) => token.selectedToken);
      const priceProportion = new BN(tokensReversed?.[1]?.price)
        .div(new BN(tokensReversed?.[0]?.price)).toString();
      this.priceProportionTokens = tokensReversed;
      this.priceProportionValue = this.getFixedVal(priceProportion);
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
  margin-top: 15px;

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
.pool-data_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.pool-data__title {
  width: 100%;
  padding: 30px;
  border-radius: 20px;
  background-color: var(--color-8);
  border: 1px solid var(--color-6);
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.pool-data__rewards {
  width: 100%;
  margin-top: 0;
}

.pool-data__nft-id {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  gap: 10px;
  svg {
    width: 20px;
    height: 20px;
    pointer-events: all;
    cursor: pointer;
  };
}

.usd_price_row {
  margin-top: 15px;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-1);
  .usd_price {
    color: var(--color-3);
  }
}

.row-icon {
  margin-right: 4px
}
</style>
