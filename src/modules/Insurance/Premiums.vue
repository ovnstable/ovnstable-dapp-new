<template>
  <div class="performance__portfolio-strategies-token-title">
    <p>INSURANCE PREMIUMS OF USD+</p>
  </div>
  <div class="performance__portfolio-strategies">
    <div class="performance__portfolio-strategies-stables">
      <div class="performance__portfolio-strategies-stables-specs">
        <p>Strategy</p>
        <p>% in collateral</p>
        <p>Net asset value, USDC</p>
        <p>Share of yield retained as premiums in %</p>
      </div>
      <div class="performance__portfolio-assets">

        <div
          v-for="premium in (premiumsData as any[])"
          :key="premium.id"
        >
          <div
            class="performance__portfolio-strategies-stables"
          >
            <div
              :class="[
                'performance__portfolio-strategy',
                { assets: premiumsData.indexOf(premium) === premiumsData.length - 1 },
              ]"
            >
              <div class="performance__portfolio-strategy-token-data">
                <div
                  name="strategyImage"
                  class="performance__portfolio-strategy-icon"
                  :style="{ 'background-color': getIconColor(premiumsData.indexOf(premium)) }"
                />
                <p
                  :class="['performance__portfolio-strategy-token-name']"
                >
                  {{ premium.fullName }}
                </p>
              </div>
              <p class="performance__portfolio-strategies-stables-score">
                {{ premium.netAssetValue}}
              </p>
              <p>
                NAV{{ formatCurrency(premium.netAssetValue)}}
              </p>
              <div class="performance__portfolio-strategy-portfolio-percent">
                <div class="performance__portfolio-strategy-progress-bar">
                  <div
                    class="performance__portfolio-strategy-progress"
                  />
                </div>
                <p class="performance__portfolio-strategy-token-portfolio-num">{{ premium.riskFactor }}%</p>
              </div>

            </div>
          </div>
        </div>
        <div
          class="performance__portfolio-divider"
        />
        <div
          class="performance__portfolio-total-info"
        >
          <div class="performance__portfolio-total">
            <p class="performance__portfolio-total-label">Total</p>
            <p class="performance__portfolio-total-nav-val">
              the total 213
            </p>
            <p class="performance__portfolio-total-nav-val">
              the total 213
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
  name: 'InsurancePremiums',
  components: {
    BaseIcon,
  },
  props: {
    premiumsData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dropdownVisible: null as string | null,
    };
  },
  methods: {
    formatCurrency(value: any, collateralToken: string) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(value).replace(/,/g, ' ');
    },
    totalNAV(assets: any[], collateralToken: string) {
      const totalValue = assets.reduce((total, asset) => total + asset.netAssetValue, 0);
      return this.formatValue(totalValue, collateralToken);
    },

    totalLiquidationValue(assets: any[], collateralToken: string) {
      const totalValue = assets.reduce((total, asset) => total + asset.liquidationValue, 0);
      return this.formatValue(totalValue, collateralToken);
    },

    formatValue(value: number, collateralToken: string) {
      if (collateralToken === '$') {
        return value.toFixed(2);
      }
      return value.toFixed(4);
    },
    // isLastAsset(asset: any) {
    //   return this.assets.indexOf(asset) === this.assets.length - 1;
    // },
    getIconColor(index: number) {
      const colors = [
        getComputedStyle(document.documentElement).getPropertyValue('--color-3').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--color-11').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--color-9').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--color-10').trim()];
      return colors[index % colors.length];
    },
    getIconName(tokenName: string) {
      const tokenNameMapping: { [key: string]: string } = {
        'USDbC (delta-neutral)': 'USDС_market',
        'USDT (delta-neutral)': 'USDT_market',
      };

      const normalizedTokenName = tokenName.toLowerCase();
      const matchedKey = Object.keys(tokenNameMapping)
        .find((key) => normalizedTokenName === key.toLowerCase());
      if (matchedKey) {
        return tokenNameMapping[matchedKey];
      }

      if (normalizedTokenName.includes('usdc')) {
        return 'USDС_market';
      } if (normalizedTokenName.includes('usdt')) {
        return 'USDT_market';
      }

      return `${tokenName}_market`;
    },

    totalPortfolioValue(assets: any[]) {
      return assets
        .reduce((total: any, asset: { netAssetValue: any; }) => total + asset.netAssetValue, 0);
    },

    calculatePercentPortfolio(assetValue: number, totalPortfolioValue: number) {
      return ((assetValue / totalPortfolioValue) * 100).toFixed(2);
    },

    formatTransactionID(id: string): string {
      if (id === undefined) {
        return '';
      }
      return `${id.substring(0, 5)}...${id.substring(id.length - 4)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.performance__portfolio-assets {
  background: var(--color-8);
  border-radius: 10px;
  [data-theme="dark"] & {
    background: var(--color-7);
  }
}
.performance__portfolio-strategies-token-title {
  margin-bottom: 20px;
  margin-top: 24px;
  color: var(--color-1);
  font-size: 17px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.performance__portfolio-strategies {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.performance__portfolio-strategies-stables {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.performance__portfolio-strategies-stables-specs {
  display: flex;
  padding: 0 20px;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 6px;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.performance__portfolio-strategy {
  display: flex;
  padding: 0px 20px;
  padding-bottom: 10px;
  padding-top: 5px;
}
.performance__portfolio-strategy p {
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.performance__portfolio-strategy-token-data {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 2;
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
  margin-right: 3px;
}

.performance__portfolio-strategy-token-portfolio-num,
.performance__portfolio-strategy-token-name {
  color: var(--color-1);
  font-size: 15px;
  font-weight: 500;
  text-align: right;
}
.performance__portfolio-strategy-token-name {
  margin-left: 17px;
  display: flex;
  width: 300px;
}
.asset {
  margin-left: 6px;
}
.performance__portfolio-total-info {
  padding: 0px 20px;
  display: flex;
  flex-direction: column;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.performance__portfolio-strategy-token-portfolio-num {
  flex: none;
  width: 60px;
  text-align: right;
}

.performance__portfolio-total,
.performance__portfolio-total-circl {
  display: flex;
  justify-content: space-between;
}

.performance__portfolio-divider {
  margin-bottom: 10px;
  border: 1px solid var(--color-5);
  width: 96%;
}
.performance__portfolio-strategies-divider {
  margin-bottom: 4px;
  border: 1px solid var(--color-5);
  width: 100%;
}

.performance__portfolio-description {
  color: var(--color-2);
  font-size: 15px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.strategies {
  color: var(--color-3);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.strategies:hover {
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.performance__portfolio-assets {
  padding-bottom: 20px;
  padding-top: 20px;
}

.performance__portfolio-total-info {
  color: var(--color-2);
  font-size: 15px;
  font-weight: 500;
}

.performance__portfolio-strategy-progress-bar {
  border-radius: 3px;
  background: var(--color-6);
  width: 200px;
  height: 12px;
}

.performance__portfolio-strategy-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
}

.performance__portfolio-dropdown-content {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-top: 4px;
  margin-bottom: 7px;
}
.performance__portfolio-dropdown {
  display: flex;
  flex-direction: row;
}

.performance__portfolio-dropdown p {
  font-size: 15px;
  font-weight: 400;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.performance__portfolio-dropdown--lp-pair p:nth-child(1),
.performance__portfolio-dropdown--lp-farming p:nth-child(1),
.performance__portfolio-dropdown--borrowed p:nth-child(1),
.performance__portfolio-dropdown--dep-asset p:nth-child(1) {
  flex:3;
}
.performance__portfolio-dropdown--lp-pair p:nth-child(2),
.performance__portfolio-dropdown--lp-farming p:nth-child(2),
.performance__portfolio-dropdown--borrowed p:nth-child(2),
.performance__portfolio-dropdown--dep-asset p:nth-child(2) {
  flex:7;
}

.performance__portfolio-dropdown--dep-to p:nth-child(1) {
  padding-right: 12px;
}

.performance__portfolio-dropdown--dep-to p:nth-child(2) {
  flex: 4;
  text-align: center;
  padding-right: 35px;
}

.performance__portfolio-dropdown--dep-to p:nth-child(3) {
  flex: 3.2;
  text-align: center;
  padding-right: 40px;
}

.performance__portfolio-dropdown--dep-to a:nth-child(4) {
  flex: 3.2;
  text-align: left;
  padding-right: 45px;
}
.performance__portfolio-strategies-stables-specs,
.performance__portfolio-strategy {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1.5fr;
  text-align: center;
}

.performance__portfolio-strategy {
  transition: background-color 0.3s ease;
}
.performance__portfolio-strategy > * {
  color: var(--color-1);
  font-size: 15px;
  font-weight: 500;
}
.performance__portfolio-strategy:hover {
  background-color: var(--color-6);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  [data-theme="dark"] & {
    background-color: var(--color-2);
  }
}

.performance__portfolio-strategies-stables-specs p:first-child,
.performance__portfolio-strategies-stables-specs p:last-child {
  text-align: left;
}

.performance__portfolio-total-circl-number {
  text-align: right;
  margin-right: 10px;
}

.performance__portfolio-total-circl {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.performance__portfolio-total-circl .performance__portfolio-total-label {
  flex-grow: 1;
  text-align: left;
}
.performance__portfolio-asset-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.performance__portfolio-total,
.performance__portfolio-total-circl {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1.5fr;
  text-align: center;
}
.performance__portfolio-total p:first-child {
  text-align: left;
}

.performance__portfolio-total-circl p:nth-child(2) {
  text-align: center;
  margin: 0;
}

.performance__portfolio-strategies-stables-score {
  margin-right: 20px;
}

@media (max-width: 1024px) {
  .performance__portfolio-strategy-token-name {
    text-align: left;
    margin-left: 10px;
    display: flex;
    width: 150px;
  }

  .performance__portfolio-strategy-progress-bar {
    width: 100px;
  }

  .performance__portfolio-strategies-stables-specs,
  .performance__portfolio-strategy,
  .performance__portfolio-total,
  .performance__portfolio-total-circl {
    grid-template-columns: 1.8fr 1fr 1.3fr 1.5fr;
  }
  .performance__portfolio-strategies-stables-score {
    margin: 0;
  }

  .performance__portfolio-dropdown--dep-to p {
    text-align: center;
    flex: 1;
    padding: 0;
  }

  .performance__portfolio-dropdown--dep-to p:first-child {
    text-align: left;
    flex: 2.7;
    padding: 0;
  }

  .performance__portfolio-dropdown--dep-to p:nth-child(2),
  .performance__portfolio-dropdown--dep-to p:nth-child(3) {
    flex: 4;
    padding: 0;
  }

  .performance__portfolio-dropdown--dep-to p:nth-child(2) {
    margin-left: 60px;
  }

  .performance__portfolio-dropdown--dep-to p:nth-child(4)  {
    flex: 3.2;
    display: flex;
    justify-content: flex-end;
    text-align: right;
    padding: 0;
  }

  .performance__portfolio-total-label--circl {
    margin-right: 90px;
  }
  .performance__portfolio-total-circl-number {
    margin-left: 5px;
  }
}
</style>
