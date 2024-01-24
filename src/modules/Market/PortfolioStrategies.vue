<template>
  <div class="performance__portfolio-strategies-token-title">
    {{ type === 'strategies' ? tokenName + ' portfolio' : tokenName + ' collateral assets' }}
    <a
      v-if="type === 'strategies'"
      href="https://docs.overnight.fi/advanced/strategies"
      target="_blank"
      rel="noopener noreferrer"
      :class="{
        'performance__portfolio-description': true,
        'link-ovn': true,
        strategies: true,
      }"
    >
      Learn about our strategies
    </a>
    <p
      v-else
      :class="'performance__portfolio-description'"
    >
      Using our products you assume the risk of the protocols integrated into our collateral
    </p>

  </div>
  <div class="performance__portfolio-strategies">
    <div class="performance__portfolio-strategies-stables">
      <div class="performance__portfolio-strategies-stables-specs">
        <p>{{ type === 'portfolio' ? 'Stablecoin' : 'Strategy' }}</p>
        <p>{{ type === 'portfolio' ? 'Safety score' : 'Net asset value' }}</p>
        <p>{{ type === 'portfolio' ? 'Net Asset Value' : 'Liquidation value' }}</p>
        <p>% in portfolio</p>
      </div>
      <div class="performance__portfolio-assets">
        <div
          v-for="asset in assets as any[]"
          :key="asset.tokenName"
          class="performance__portfolio-strategy-container"
        >
          <div
            class="performance__portfolio-strategies-stables"
            @click="type === 'strategies' && toggleDropdown(asset.fullName)"
            @keydown.enter="type === 'strategies' && toggleDropdown(asset.fullName)"
            tabindex="0"
          >
            <div
              :class="[
                'performance__portfolio-strategy',
                { assets: type === 'portfolio' && assets.indexOf(asset) === assets.length - 1 },
              ]"
            >
              <div class="performance__portfolio-strategy-token-data">
                <div
                  v-if="type === 'strategies'"
                  name="strategyImage"
                  class="performance__portfolio-strategy-icon"
                  :style="{ 'background-color': getIconColor(assets.indexOf(asset)) }"
                />
                <BaseIcon
                  v-if="type === 'portfolio'"
                  name="ARB"
                  class="performance__portfolio-asset-icon"
                />
                <p
                  :class="['performance__portfolio-strategy-token-name', { asset: type === 'strategies' }]"
                >
                  {{ type === 'portfolio' ? asset.id.tokenName : asset.fullName }}
                </p>
              </div>
              <p>{{ type === 'portfolio' ? asset.safetyScore : formatCurrency(asset.netAssetValue, collateralToken) }}</p>
              <p>
                {{ type === 'portfolio' ? formatCurrency(asset.netAssetValue, collateralToken) : formatCurrency(asset.liquidationValue, collateralToken) }}
              </p>
              <div class="performance__portfolio-strategy-portfolio-percent">
                <div class="performance__portfolio-strategy-progress-bar">
                  <div
                    class="performance__portfolio-strategy-progress"
                    :style="{ width: calculatePercentPortfolio(asset.netAssetValue, totalPortfolioValue(assets)) + '%', 'background-color': getIconColor(assets.indexOf(asset)) }"
                  />
                </div>
                <p class="performance__portfolio-strategy-token-portfolio-num">{{ calculatePercentPortfolio(asset.netAssetValue, totalPortfolioValue(assets)) }}%</p>
              </div>

            </div>
            <div
              v-show="dropdownVisible === asset.fullName"
              class="performance__portfolio-dropdown-content"
            >
              <div class="performance__portfolio-strategies-divider" />
              <div class="performance__portfolio-dropdown performance__portfolio-dropdown--dep-to">
                <p>Lending Protocol Deposited To:</p>
                <p>{{ asset.lendingProtocolDepositedTo }}</p>
                <p>See on Debank:</p>
                <a
                  :href="'https://debank.com/profile/' + asset.linkDepositedProtocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-ovn"
                >
                  <p>{{ formatTransactionID(asset.linkDepositedProtocol) }}</p>
                </a>
              </div>
              <div class="performance__portfolio-dropdown performance__portfolio-dropdown--dep-asset">
                <p>Deposited asset:</p>
                <p>{{ asset.depositedAsset }}</p>
              </div>
              <div class="performance__portfolio-dropdown performance__portfolio-dropdown--borrowed">
                <p>Borrowed asset:</p>
                <p>{{ asset.borrowedAsset }}</p>
              </div>
              <div class="performance__portfolio-dropdown performance__portfolio-dropdown--lp-farming">
                <p>LP Farming</p>
                <p>{{ asset.lpFarmingPlatform }}</p>
              </div>
              <div class="performance__portfolio-dropdown performance__portfolio-dropdown--lp-pair">
                <p>LP Pair</p>
                <p>{{ asset.lpPair }}</p>
              </div>
              <div
                v-if="assets.indexOf(asset) != assets.length - 1"
                class="performance__portfolio-strategies-divider"
              />
            </div>
          </div>
        </div>
        <div
          v-if="type === 'strategies'"
          class="performance__portfolio-divider"
        />
        <div
          v-if="type === 'strategies'"
          class="performance__portfolio-total-info"
        >
          <div class="performance__portfolio-total">
            <p class="performance__portfolio-total-label">Total</p>
            <p class="performance__portfolio-total-nav-val">
              {{ formatCurrency(totalNAV(assets, collateralToken), collateralToken) }}
            </p>
            <p class="performance__portfolio-total-liquidation-val">
              {{ formatCurrency(totalLiquidationValue(assets, collateralToken), collateralToken) }}
            </p>

          </div>
          <div class="performance__portfolio-total-circl">
            <p class="performance__portfolio-total-label performance__portfolio-total-label--circl">Total {{ tokenName }} in circulation</p>
            <p class="performance__portfolio-total-circl-number">
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
  data() {
    return {
      dropdownVisible: null as string | null,
    };
  },
  methods: {
    toggleDropdown(tokenName: string | null) {
      if (this.type === 'strategies') {
        this.dropdownVisible = this.dropdownVisible === tokenName ? null : tokenName;
      }
    },
    formatCurrency(value:any, collateralToken:string) {
      if (collateralToken !== 'WETH') {
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
    isLastAsset(asset:any) {
      return this.assets.indexOf(asset) === this.assets.length - 1;
    },
    getIconColor(index:number) {
      const colors = [
        getComputedStyle(document.documentElement).getPropertyValue('--color-3').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--color-11').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--color-9').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--color-10').trim()];
      return colors[index % colors.length];
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
}

.performance__portfolio-strategy {
  display: flex;
  padding: 0px 20px;
  padding-bottom: 10px;
  padding-top: 5px;
}

.performance__portfolio-strategy > * {
  flex: 1;
  text-align: center;
  color: var(--color-1);
  font-size: 15px;
  font-weight: 500;
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
}
.performance__portfolio-strategy-token-name {
  margin-left: 17px;
  display: flex;
  min-width: 153px;
}
.asset {
    margin-left: 6px;
}
.performance__portfolio-total-info {
  padding: 0px 20px;
  display: flex;
  flex-direction: column;
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

.performance__portfolio-total-nav-val,
.performance__portfolio-total-liquidation-val,
.performance__portfolio-total-circl-number {
  text-align: right;
  flex: none;
}

.performance__portfolio-total-liquidation-val {
  margin-right: 15px;
}
.performance__portfolio-total > *,
.performance__portfolio-total-circl > * {
  text-align: center;
}

.performance__portfolio-total{
  width: 70%;
}

.performance__portfolio-total-circl  {
   width: 39.8%;
}
.performance__portfolio-total-label,
.performance__portfolio-total-circl .performance__portfolio-total-label {
  text-align: left;
}

.performance__portfolio-total-label,
.performance__portfolio-total-circl .performance__portfolio-total-label {
  text-align: left;
}
.performance__portfolio-total-label,
.performance__portfolio-total-nav-val,
.performance__portfolio-total-liquidation-val {
  flex: 1;
}
.performance__portfolio-total-liquidation-val {
  text-align: right;
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
}
.strategies {
  color: var(--color-3);
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

.assets {
  padding-bottom: 0px;
}

.performance__portfolio-strategy-token-img {
  margin-right: 17px;
}

.performance__portfolio-strategy-progress-bar {
  border-radius: 3px;
  background: var(--color-6);
  width: 160px;
  height: 12px;
  margin-right: 3px;
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

.performance__portfolio-strategies-stables-specs p,
.performance__portfolio-strategy p {
  text-align: center;
  flex: 1;
}

.performance__portfolio-strategies-stables-specs p:first-child,
.performance__portfolio-strategy p:first-child {
  text-align: left;
  flex: 2.7;
}

.performance__portfolio-strategies-stables-specs p:nth-child(2),
.performance__portfolio-strategies-stables-specs p:nth-child(3),
.performance__portfolio-strategy p:nth-child(2),
.performance__portfolio-strategy p:nth-child(3) {
  flex: 4;
}

.performance__portfolio-strategies-stables-specs p:nth-child(4),
.performance__portfolio-strategy p:nth-child(4) {
  flex: 3.2;
  display: flex;
  justify-content: flex-end;
  text-align: right;
}

.performance__portfolio-strategies-stables-specs p:nth-child(4) {
  justify-content: flex-start;
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
}


@media (max-width: 1024px) {
  .performance__portfolio-strategy-progress-bar {
    width: 50px;
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
