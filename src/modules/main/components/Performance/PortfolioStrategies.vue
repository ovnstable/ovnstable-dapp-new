<template>
  <p class="performance__portfolio-strategies-token-title">
    {{ type === 'strategies' ? tokenName + ' portfolio' : tokenName + ' collateral assets' }}
  </p>
  <div class="performance__portfolio-strategies">
    <div class="performance__portfolio-strategies-stablecoins">
      <div class="performance__portfolio-strategies-stablecoins-specifications">
        <p class="performance__portfolio-strategies-specification">
          {{ type === 'portfolio' ? 'Stablecoin' : 'Strategy' }}
        </p>
        <p class="performance__portfolio-strategies-specification score">
          {{ type === 'portfolio' ? 'Safety score' : 'Net Asset Value' }}
        </p>
        <p class="performance__portfolio-strategies-specification nav">
          {{ type === 'portfolio' ? 'Net Asset Value' : 'Liquidation value' }}
        </p>
        <p class="performance__portfolio-strategies-specification percent">% in portfolio</p>
      </div>
      <div class="performance__portfolio-assets">
        <div
          v-for="asset in assets as any[]"
          :key="asset.tokenName"
          class="performance__portfolio-strategies-stablecoins"
        >
          <div class="performance__portfolio-strategy">
            <div class="performance__portfolio-strategy-token-data">
              <BaseIcon
                v-if="type === 'portfolio'"
                name="tokenImage"
                :path="asset.strategyImagePath"
                class="performance__portfolio-strategy-token-img"
              />
              <div class="performance__portfolio-strategy-icon" />
              <p class="performance__portfolio-strategy-token-name">
                {{ type === 'portfolio' ? asset.tokenNameAsset : asset.strategyNameAsset }}
              </p>
            </div>
            <p :class="['performance__portfolio-strategy-token-score', type !== 'portfolio' ? 'nav-usdc' : '']">
              {{ type === 'portfolio' ? asset.safetyScore : formatCurrency(asset.netAssetValue, collateralToken) }}
            </p>
            <p class="performance__portfolio-strategy-token-NAV">
              {{ type === 'portfolio' ? formatCurrency(asset.NAV, collateralToken) : formatCurrency(asset.liquidationValue, collateralToken) }}
            </p>
            <div class="performance__portfolio-strategy-portfolio-percent">
              <BaseIcon
                name="percentPortfolio"
                :path=asset.percentPortfolioPath
                class="performance__portfolio-strategy-token-portfolio"
              />
              <p class="performance__portfolio-strategy-token-portfolio-number">{{ asset.percentPortfolio }}</p>
            </div>
          </div>
          <div class="performance__portfolio-strategies-divider" />
        </div>
        <div
          v-if="type === 'strategies'"
          class="performance__portfolio-total-info"
        >
          <div class="performance__portfolio-total">
            <p class="performance__portfolio-total-label">Total</p>
            <p class="performance__portfolio-total-nav-value">
              {{ formatCurrency(totalNAV(assets, collateralToken), collateralToken) }}
            </p>
            <p class="performance__portfolio-total-liquidation-value">
              {{ formatCurrency(totalLiquidationValue(assets, collateralToken), collateralToken) }}
            </p>
          </div>
          <div class="performance__portfolio-total-circulation">
            <p class="performance__portfolio-total-label">Total {{ tokenName }} in circulation</p>
            <p class="performance__portfolio-total-circulation-number">
              {{ formatCurrency(tokenAmountInCirculation, collateralToken) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'PortfolioStrategies',
  components: {
    BaseIcon,
  },
  props: {
    tokenName: {
      type: String,
      default: 'ETH+',
    },
    assets: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      default: 'portfolio',
    },
    tokenAmountInCirculation: {
      type: Number,
      default: 0,
    },
    collateralToken: {
      type: String,
      default: '$',
    },
  },
  methods: {
    formatCurrency(value:any, collateralToken:string) {
      if (collateralToken === '$') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(value).replace(/,/g, ' ');
      }
      return `${value} ${collateralToken}`;
    },
    totalNAV(assets: any[], collateralToken: string) {
      const totalValue = assets.reduce((total, asset) => total + asset.netAssetValue, 0);
      return this.formatValue(totalValue, collateralToken);
    },

    totalLiquidationValue(assets: any[], collateralToken: string) {
      const totalValue = assets.reduce((total, asset) => total + asset.liquidationValue, 0);
      return this.formatValue(totalValue, collateralToken);
    },

    formatValue(value:number, collateralToken:string) {
      if (collateralToken === '$') {
        return value.toFixed(2);
      }
      return value.toFixed(4);
    },
  },

};
</script>

<style>
.performance__portfolio-assets {
  background: var(--color-dark-white);
  border-radius: 10px;
}
.performance__portfolio-strategies-token-title {
    margin-bottom: 24px;
    color: var(--color-black);
    font-size: 24px;
    font-weight: 400;
}

.performance__portfolio-strategies {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.performance__portfolio-strategies-stablecoins {
    display: flex;
    flex-direction: column;
    width: 100%;

}

.performance__portfolio-strategies-stablecoins-specifications {
    display: flex;
    padding: 0 20px;
    color: var(--color-dark-grey);
    font-size: 15px;
    font-weight: 400;
}

.performance__portfolio-strategies-specification {
  text-align: center;
  flex: 1;
}

.performance__portfolio-strategies-specification:first-child {
  text-align: left;
  flex: 2;
}

.performance__portfolio-strategies-specification.score {
  flex: 3;
}

.performance__portfolio-strategies-specification.nav {
  flex: 3;
}

.performance__portfolio-strategies-specification.percent {
  flex: 2;
  text-align: left;
}

.performance__portfolio-strategy {
    display: flex;
    padding: 10px 20px;
}

.performance__portfolio-strategy > * {
  flex: 1;
  text-align: center;
  color: var(--color-black);
  font-size: 15px;
  font-weight: 500;
}

.performance__portfolio-strategy-token-data {
    display: flex;
    align-items: center;
    flex: 2;
}

.performance__portfolio-strategy-token-score {
    flex: 3;
}

.performance__portfolio-strategy-token-NAV {
    flex: 3;
}

.performance__portfolio-strategy-portfolio-percent {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    justify-content: space-between;
    flex: 2;
}
.performance__portfolio-strategy-icon {
  width: 14px;
  height: 14px;
  border-radius: 5px;
  background: var(--color-blue);
}

.performance__portfolio-strategy-token-portfolio-number,
.performance__portfolio-strategy-token-name {
  color: var(--color-black);
  font-size: 15px;
  font-weight: 500;
}

.performance__portfolio-strategy-token-name {
  margin-left: 6px;
}
</style>
