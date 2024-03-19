<template>
  <div
    :class="[
      'performance__portfolio-strategies-token-title',
      device.isMobile && type === 'portfolio' ? 'performance__portfolio-strategies-token-portfolio-mob' : '',
    ]"
  >
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
    <div
      v-if="!device.isMobile"
      class="performance__portfolio-strategies-stables"
    >
      <div class="performance__portfolio-strategies-stables-specs">
        <p>{{ type === 'portfolio' ? 'Stablecoin' : 'Strategy' }}</p>
        <p>{{ type === 'portfolio' ? 'Safety score' : 'Net asset value' }}</p>
        <p>{{ type === 'portfolio' ? 'Net Asset Value' : 'Liquidation value' }}</p>
        <p>% in portfolio</p>
      </div>
      <div class="performance__portfolio-assets">

        <div
          v-for="asset in (assets as any[])"
          :key="asset.tokenName"
        >
          <div
            class="performance__portfolio-strategies-stables"
          >
            <div
              @click="handleContainerClick(asset)"
              @keydown.enter="handleContainerClick(asset)"
              tabindex="0"
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
                  :name="getIconName(asset.id.tokenName)"
                  class="performance__portfolio-asset-icon"
                />
                <p
                  :class="['performance__portfolio-strategy-token-name', { asset: type === 'strategies' }]"
                >
                  {{ type === 'portfolio' ? asset.id.tokenName : asset.fullName }}
                </p>
              </div>
              <p :class="{ 'performance__portfolio-strategies-stables-score': type === 'portfolio' }">
                {{ type === 'portfolio' ? 'VERY HIGH' : formatCurrency(asset.netAssetValue, collateralToken) }}
              </p>
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
                  :href="'https://debank.com/profile/' + asset.address"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-ovn"
                >
                  <p>{{ formatTransactionID(asset.address) }}</p>
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
    <div
      class="performance__portfolio-strategies-stables"
      v-else
    >
      <div
        v-for="asset in (assets as any[])"
        :key="asset.tokenName"
      >
        <div
          @click="handleContainerClick(asset)"
          @keydown.enter="handleContainerClick(asset)"
          tabindex="0"
          :class="[
            'performance__portfolio-strategy',
            { assets: type === 'portfolio' && assets.indexOf(asset) === assets.length - 1 },
          ]"
        >
          <div class="performance__portfolio-strategies-stables-mobile">
            <div class="performance__portfolio-strategy-token-data-mobile">

              <div class="performance__portfolio-strategy-icon-mobile">
                <div
                  v-if="type === 'strategies'"
                  name="strategyImage"
                  class="performance__portfolio-strategy-icon"
                  :style="{ 'background-color': getIconColor(assets.indexOf(asset)) }"
                />
                <BaseIcon
                  v-if="type === 'portfolio'"
                  :name="getIconName(asset.id.tokenName)"
                  class="performance__portfolio-asset-icon"
                />
                <p
                  :class="['performance__portfolio-strategy-token-name', { asset: type === 'strategies' }]"
                >
                  {{ type === 'portfolio' ? asset.id.tokenName : asset.fullName }}
                </p>
              </div>
              <p>{{ type === 'portfolio' ? 'Stablecoin' : 'Strategy' }}</p>
            </div>
            <div class="performance__portfolio-strategy-nav-mobile">
              <p :class="{ 'performance__portfolio-strategies-stables-score': type === 'portfolio' }">
                {{ type === 'portfolio' ? 'VERY HIGH' : formatCurrency(asset.netAssetValue, collateralToken) }}
              </p>
              <p>{{ type === 'portfolio' ? 'Safety score' : 'Net asset value' }}</p>
            </div>
            <div class="performance__portfolio-strategy-liq-val-mobile">
              <p>
                {{ type === 'portfolio' ? formatCurrency(asset.netAssetValue, collateralToken) : formatCurrency(asset.liquidationValue, collateralToken) }}
              </p>
              <p>{{ type === 'portfolio' ? 'Net Asset Value' : 'Liquidation value' }}</p>
            </div>
            <div class="performance__portfolio-strategy-percent-portfolio-mobile">
              <div class="performance__portfolio-strategy-progress-bar">
                <div
                  class="performance__portfolio-strategy-progress"
                  :style="{ width: calculatePercentPortfolio(asset.netAssetValue, totalPortfolioValue(assets)) + '%', 'background-color': getIconColor(assets.indexOf(asset)) }"
                />
                <p class="performance__portfolio-strategy-token-portfolio-num">{{ calculatePercentPortfolio(asset.netAssetValue, totalPortfolioValue(assets)) }}%</p>
              </div>
              <p class="performance__portfolio-strategy-percent">% in portfolio</p>
            </div>
          </div>

        </div>

        <BaseIcon
          v-if="type === 'strategies'"
          class="performance__portfolio-dropdown-arrow"
          :name="dropdownVisible === asset.fullName ? 'ArrowUp' : 'ArrowDown'"
        />
        <div
          v-if="(type !== 'strategies' || dropdownVisible !== asset.fullName) && (type !== 'portfolio' || assets.indexOf(asset) !== assets.length - 1)"
          class="performance__portfolio-strategies-divider"
        />
        <div
          v-show="dropdownVisible === asset.fullName"
          class="performance__portfolio-dropdown-content"
        >
          <div class="performance__portfolio-dropdown performance__portfolio-dropdown--dep-to">
            <p>Lending Protocol Deposited To:</p>
            <p>{{ asset.lendingProtocolDepositedTo }}</p>
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
            <p>LP Farming:</p>
            <p>{{ asset.lpFarmingPlatform }}</p>
          </div>
          <div class="performance__portfolio-dropdown performance__portfolio-dropdown--lp-pair">
            <p>LP Pai:</p>
            <p>{{ asset.lpPair }}</p>
          </div>
          <div class="performance__portfolio-dropdown performance__portfolio-dropdown--debank">
            <p>See on DeBank:</p>
            <a
              :href="'https://debank.com/profile/' + asset.address"
              target="_blank"
              rel="noopener noreferrer"
              class="link-ovn"
            >
              <p>{{ formatTransactionID(asset.address) }}</p>
            </a>
          </div>
          <div
            v-if="assets.indexOf(asset) != assets.length - 1"
            class="performance__portfolio-strategies-divider"
          />
        </div>
      </div>
      <div
        v-if="type === 'strategies'"
        class="performance__portfolio-strategies-total-mobile"
      >
        <p>Total</p>
        <div class="performance__portfolio-total-nv-mobile">
          <p class="performance__portfolio-total-nav-val">
            {{ formatCurrency(totalNAV(assets, collateralToken), collateralToken) }}
          </p>
          <p>Net asset value</p>
        </div>
        <div class="performance__portfolio-total-liq-mobile">
          <p class="performance__portfolio-total-liquidation-val">
            {{ formatCurrency(totalLiquidationValue(assets, collateralToken), collateralToken) }}
          </p>
          <p>Liquidation value</p>
        </div>
        <div class="performance__portfolio-circle-mobile">
          <p class="performance__portfolio-total-label performance__portfolio-total-label--circl">Total {{ tokenName }} in circulation</p>
          <p class="performance__portfolio-total-circl-number">
            {{ formatCurrency(tokenAmountInCirculation, collateralToken) }}
          </p>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { deviceType } from '@/utils/deviceType.ts';

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
  computed: {
    device() {
      return deviceType();
    },
  },
  data() {
    return {
      dropdownVisible: null as string | null,
    };
  },
  methods: {
    handleContainerClick(asset: any) {
      if (this.type === 'strategies') {
        this.dropdownVisible = this.dropdownVisible === asset.fullName ? null : asset.fullName;
      } else if (this.type === 'portfolio') {
        window.open(`${this.$store.state.network.marketExplorerURL}address/${asset.tokenAddress}`, '_blank');
      }
    },
    formatCurrency(value: any, collateralToken: string) {
      if (collateralToken !== 'WETH') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(value).replace(/,/g, ' ');
      }
      return `${Number(value).toFixed(6)} ${collateralToken}`;
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
    isLastAsset(asset: any) {
      return this.assets.indexOf(asset) === this.assets.length - 1;
    },
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
        USDbC: 'USDС_market',
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
  margin-top: 8px;
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

.performance__portfolio-dropdown--dep-to {
  margin-top: 0;
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
  background-color: var(--color-5);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  [data-theme="dark"] & {
    background-color: var(--color-17);
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

@media (max-width: 768px) {
  .performance__portfolio-strategies-stables-specs {
    padding: 0 10px;
    p {
      font-size: 14px;
    }
  }
  .performance__portfolio-strategy {
    p {
      font-size: 13px;
    }
  }

  .performance__portfolio-strategy-token-name {
    max-width: 110px;
    margin-left: 4px;
    margin-right: 30px;
  }
  .performance__portfolio-strategy p:nth-child(2),
  .performance__portfolio-strategy p:nth-child(3),
  .performance__portfolio-total-circl p:nth-child(2) {
    text-align: left;
  }
   .performance__portfolio-total-circl p:nth-child(2) {
    margin-left: 2px;
   }

  .performance__portfolio-strategies-stables-specs p:nth-child(2) {
    margin-left: 30px;
  }
  .performance__portfolio-strategy-progress-bar {
    display: none;
  }
  .performance__portfolio-strategy-portfolio-percent {
    justify-content: flex-start;
  }
  .performance__portfolio-strategy-token-data {
    margin-left: 10px;
  }
  .performance__portfolio-strategies-stables-specs,
  .performance__portfolio-strategy {
    grid-template-columns: 1.2fr 1.3fr 1.5fr 1.3fr;
  }

  .performance__portfolio-total {
    grid-template-columns: 1fr 1.1fr 1.05fr 1fr;
  }
  .performance__portfolio-total-liquidation-val {
    display: flex;
    align-items: right;
    text-align: right;
  }
  .performance__portfolio-total-circl {
    grid-template-columns: 0.9fr 1fr 1.8fr 0.1fr;
  }
  .performance__portfolio-total p:nth-child(2) {
    text-align: left;
    margin-right: 20px;
  }
  .performance__portfolio-total p:nth-child(3) {
    text-align: left;
    margin-right: 16px;
  }
  .performance__portfolio-strategy-portfolio-percent {
    margin-left: 4px;
  }

  .performance__portfolio-strategy p:nth-child(3) {
    margin-left: 10px;
  }
  .performance__portfolio-strategy {
    padding-right: 4px;
    padding-left: 4px;
  }

  .performance__portfolio-strategy p {
    display: flex;
    align-items: center;
  }
  .performance__portfolio-strategy-token-portfolio-num {
    margin-left: 6px;
  }

  .performance__portfolio-total-label,
  .performance__portfolio-total-label--circl {
    font-size: 14px;
  }

  .performance__portfolio-total-nav-val,
  .performance__portfolio-total-liquidation-val,
  .performance__portfolio-total-circl-number {
    font-size: 13px;
  }

  .performance__portfolio-total-label--circl {
    margin: 0;
  }

  .performance__portfolio-strategies-token-title {
    font-size: 16px;
  }
  .performance__portfolio-description {
    font-size: 14px;
    text-align: right;
  }
  .performance__portfolio-total-label--circl {
    margin-right: 12px;
  }
  .performance__portfolio-strategies-stables-score {
    margin-right: 40px;
  }
}

@media (max-width: 576px) {
  .performance__portfolio-strategy-token-name {
    max-width: 60px;
    margin-left: 4px;
    margin-right: 30px;
    overflow-wrap: break-word;
    word-break: break-all;
    display: inline-block;
  }
  .performance__portfolio-strategies-stables-score {
    margin-right: 0;
  }
  .performance__portfolio-strategy p:nth-child(3) {
    margin-left: 4px;
  }

  .performance__portfolio-strategies-stables-specs p:last-child {
    text-align: right;
  }

  .performance__portfolio-strategies-stables-score {
    margin-right: 10px;
  }
  .performance__portfolio-strategy-token-name {
    margin-right: 20px;
  }

  .performance__portfolio-total p:nth-child(2),
  .performance__portfolio-total p:nth-child(3),
  .performance__portfolio-total-circl p:nth-child(2) {
    max-width: 66px;
  }

  .performance__portfolio-total-circl p:nth-child(2) {
    margin-left: 6px
  }

  .performance__portfolio-description {
    font-size: 13px;
  }

  .performance__portfolio-total p:nth-child(2) {
    margin-left: 6px;
  }

}

@media (max-width: 640px) {
  .performance__portfolio-description {
    font-size: 14px;
  }
  .performance__portfolio-assets {
    padding: 16px 10px;
  }
  .performance__portfolio-strategy {
    padding: 0;
  }
  .performance__portfolio-strategy-token-data {
    justify-content: space-between;
  }
  .performance__portfolio-strategy {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .performance__portfolio-strategies-stables-mobile {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .performance__portfolio-strategies-stables {
    background-color: var(--color-8);
    border-radius: 10px;
    padding: 16px 10px;
    [data-theme="dark"] & {
      background-color: var(--color-7);
    }
  }
  .performance__portfolio-strategy-token-data-mobile,
  .performance__portfolio-strategy-nav-mobile,
  .performance__portfolio-strategy-liq-val-mobile,
  .performance__portfolio-strategy-percent-portfolio-mobile {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .performance__portfolio-strategy-icon-mobile {
    display: flex;
    flex-direction: row;
  }
  .performance__portfolio-strategies-stables-mobile {
    gap: 10px;
  }
  .performance__portfolio-strategy-token-name {
    max-width: none;
  }
  .performance__portfolio-strategy-token-data-mobile p:last-child,
  .performance__portfolio-strategy-token-name {
    margin: 0;
  }
  .performance__portfolio-strategies-divider {
    border-color: var(--color-7);
  }
   .performance__portfolio-strategy-progress-bar {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 150px;
    max-height: 12px;
  }
  .performance__portfolio-strategy-token-portfolio-num {
    position: absolute;
    left: 100%;
    margin-left: 10px;
  }
  .performance__portfolio-strategies-divider {
    margin-top: 10px;
    margin-bottom: 16px
  }

  .performance__portfolio-strategy-token-data-mobile p,
  .performance__portfolio-strategy-nav-mobile p,
  .performance__portfolio-strategy-liq-val-mobile p,
  .performance__portfolio-strategy-percent-portfolio-mobile p {
    font-size: 14px;
  }

  .performance__portfolio-strategy-token-data-mobile:nth-child(1),
  .performance__portfolio-strategy-nav-mobile p:last-child,
  .performance__portfolio-strategy-liq-val-mobile p:last-child,
  .performance__portfolio-strategy-percent  {
    color: var(--color-2);
  }
  .performance__portfolio-asset-icon {
    margin-right: 10px;
  }
  .performance__portfolio-strategy-token-name.asset {
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .performance__portfolio-dropdown-content {
    margin: 0;
  }

  .performance__portfolio-dropdown-content {
    display: flex;
    flex-direction: column;
  }
  .performance__portfolio-dropdown {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
  .performance__portfolio-dropdown p:last-child {
    margin: 0;
    text-align: right;
  }
  .performance__portfolio-dropdown p {
    white-space: nowrap;
  }
  .performance__portfolio-dropdown-arrow {
    margin-top: 10px;
  }
  .performance__portfolio-dropdown--dep-to {
    margin-top: 16px;
  }

  .performance__portfolio-strategies-total-mobile {
    display: flex;
    flex-direction: column;
    gap: 10px ;
    p {
      font-size: 14px;
      font-weight: 500;
    }
  }

  .performance__portfolio-total-nv-mobile,
  .performance__portfolio-total-liq-mobile,
  .performance__portfolio-circle-mobile {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .performance__portfolio-total-label--circl,
  .performance__portfolio-total-circl-number {
    margin: 0;
  }

  .performance__portfolio-strategies-token-portfolio-mob {
    display: flex;
    flex-direction: column;
    .performance__portfolio-description {
      margin-top: 10px;
      text-align: left
    }
  }

}
</style>
