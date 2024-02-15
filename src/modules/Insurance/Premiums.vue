<template>
  <div class="insurance__premiums-title">
    <p>INSURANCE PREMIUMS OF USD+</p>
  </div>
  <div class="insurance__premiums-strategies">
    <div class="insurance__premiums-strategies-table">
      <div class="insurance__premiums-specs">
        <p>Strategy</p>
        <p>% in collateral</p>
        <p>Net asset value, USDC</p>
        <p>Share of yield retained as premiums in %</p>
      </div>
      <div class="insurance__premiums-assets">

        <div
          v-for="premium in (premiumsData as any[])"
          :key="premium.id"
        >
          <div
            class="insurance__premiums-strategies-table"
            @click="openStrategyProfile(premium.address)"
            @keydown.enter="openStrategyProfile(premium.address)"
          >
            <div
              :class="[
                'insurance-premium',
                { assets: premiumsData.indexOf(premium) === premiumsData.length - 1 },
              ]"
            >
              <div class="insurance-premium-token-data">
                <div
                  name="strategyImage"
                  class="insurance-premium-icon"
                  :style="{ 'background-color': getIconColor(premiumsData.indexOf(premium)) }"
                />
                <p
                  :class="['insurance-premium-name']"
                >
                  {{ premium.fullName }}
                </p>
              </div>
              <p class="insurance__premiums-strategies-table-score">
                {{ calculatePercentPortfolio(premium
                  .netAssetValue, totalNAV(premiumsData as any))}}%
              </p>
              <p>
                {{ formatCurrency(premium.netAssetValue)}}
              </p>
              <div class="insurance-premium-portfolio-percent">
                <div class="insurance-premium-progress-bar">
                  <div
                    class="insurance-premium-progress"
                    :style="{ width: premium.riskFactor + '%', 'background-color': getIconColor(premiumsData.indexOf(premium)) }"
                  />
                </div>
                <p class="insurance-premium-token-portfolio-num">{{ premium.riskFactor }}%</p>
              </div>

            </div>
          </div>
        </div>
        <div
          class="insurance__portfolio-divider"
        />
        <div
          class="performance__portfolio-total-info"
        >
          <div class="performance__portfolio-total">
            <p class="performance__portfolio-total-label">Total</p>
            <p class="performance__portfolio-total-nav-val">
              {{ formatCurrency(totalNAV(premiumsData as any)) }}
            </p>
            <p class="performance__portfolio-total-premiums">
              {{calculateTotalPremiumsPercentage(premiumsData as any)}}%
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">

export default {
  name: 'InsurancePremiums',
  props: {
    premiumsData: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatCurrency(value: any) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(value).replace(/,/g, ' ');
    },
    openStrategyProfile(explorerAddress: string) {
      const url = `https://debank.com/profile/${explorerAddress}`;
      window.open(url, '_blank');
    },
    totalNAV(premiums: any[]) {
      const totalValue = premiums.reduce((total, asset) => total + asset.netAssetValue, 0);
      return totalValue.toFixed(2);
    },
    calculateTotalPremiumsPercentage(premiumsData: any) {
      const totalNav = this.totalNAV(premiumsData);
      const totalPremiumsPercentage = premiumsData.reduce((total: any, premium: any) => {
        if (premium.riskFactor) {
          const navPercentage = (premium.netAssetValue / totalNav) * 100;
          const riskCovered = (navPercentage * premium.riskFactor) / 100;
          return total + riskCovered;
        }
        return total;
      }, 0);

      return totalPremiumsPercentage.toFixed(2);
    },

    getIconColor(index: number) {
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
  },
};
</script>

<style lang="scss" scoped>
.insurance__premiums-assets {
  background: var(--color-8);
  border-radius: 10px;
  [data-theme="dark"] & {
    background: var(--color-7);
  }
}
.insurance__premiums-title {
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

.insurance__premiums-strategies {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.insurance__premiums-strategies-table {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.insurance__premiums-specs {
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

.insurance-premium {
  display: flex;
  padding: 0px 20px;
  padding-bottom: 10px;
  padding-top: 5px;
}
.insurance-premium p {
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.insurance-premium-token-data {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 2;
}

.insurance-premium-portfolio-percent {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  justify-content: space-between;
  flex: 2;
}

.insurance-premium-icon {
  width: 14px;
  height: 14px;
  border-radius: 5px;
  margin-right: 3px;
}

.insurance-premium-token-portfolio-num,
.insurance-premium-name {
  color: var(--color-1);
  font-size: 15px;
  font-weight: 500;
  text-align: right;
}
.insurance-premium-name {
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
.insurance-premium-token-portfolio-num {
  flex: none;
  width: 60px;
  text-align: right;
}

.performance__portfolio-total,
.performance__portfolio-total-circl {
  display: flex;
  justify-content: space-between;
}

.insurance__portfolio-divider {
  margin-bottom: 10px;
  border: 1px solid var(--color-5);
  width: 96%;
}
.insurance__premiums-strategies-divider {
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
.insurance__premiums-assets {
  padding-bottom: 20px;
  padding-top: 20px;
}

.performance__portfolio-total-info {
  color: var(--color-2);
  font-size: 15px;
  font-weight: 500;
}

.insurance-premium-progress-bar {
  border-radius: 3px;
  background: var(--color-6);
  width: 200px;
  height: 12px;
}

.insurance-premium-progress {
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
.insurance__premiums-specs,
.insurance-premium {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1.5fr;
  text-align: center;
}

.insurance-premium {
  transition: background-color 0.3s ease;
}
.insurance-premium > * {
  color: var(--color-1);
  font-size: 15px;
  font-weight: 500;
}
.insurance-premium:hover {
  background-color: var(--color-6);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  [data-theme="dark"] & {
    background-color: var(--color-2);
  }
}

.insurance__premiums-specs p:first-child,
.insurance__premiums-specs p:last-child {
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
  grid-template-columns: 4fr 1fr 2.2fr 0fr;
  text-align: center;
}
.performance__portfolio-total-premiums {
  text-align: right;
}
.performance__portfolio-total p:first-child {
  text-align: left;
}

.performance__portfolio-total-circl p:nth-child(2) {
  text-align: center;
  margin: 0;
}

.insurance__premiums-strategies-table-score {
  margin-right: 20px;
}

@media (max-width: 1024px) {
  .insurance-premium-name {
    text-align: left;
    margin-left: 10px;
    display: flex;
    width: 150px;
  }

  .insurance-premium-progress-bar {
    width: 100px;
  }

  .insurance__premiums-specs,
  .insurance-premium,
  .performance__portfolio-total,
  .performance__portfolio-total-circl {
    grid-template-columns: 1.8fr 1fr 1.3fr 1.5fr;
  }
  .insurance__premiums-strategies-table-score {
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
