<template>
  <div class="insurance__premiums-title">
    <p>INSURANCE PREMIUMS OF USD+</p>
  </div>
  <div class="insurance__premiums-strategies">
    <div
      v-if="!device.isMobile"
      class="insurance__premiums-strategies-table"
    >
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
          class="insurance__total-info"
        >
          <div class="insurance__premiums-total">
            <p class="insurance__premiums-total-label">Total</p>
            <p>
              {{ formatCurrency(totalNAV(premiumsData as any)) }}
            </p>
            <p class="insurance__premiums-total-premiums">
              {{calculateTotalPremiumsPercentage(premiumsData as any)}}%
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="insurance__premiums-assets-mobile"
      v-else
    >
      <div
        v-for="premium in (premiumsData as any[])"
        :key="premium.id"
      >
        <div
          @click="openStrategyProfile(premium.address)"
          @keydown.enter="openStrategyProfile(premium.address)"
          class="insurance__premiums-asset"
        >
          <div class="insurance__premiums-assets-mobile-mobile">
            <div class="insurance__premiums-asset-token-data-mobile">

              <div class="insurance__premiums-asset-icon-mobile">
                <div
                  name="strategyImage"
                  class="insurance__premiums-asset-icon"
                  :style="{ 'background-color': getIconColor(premiumsData.indexOf(premium)) }"
                />
                <p
                  :class="['insurance-premium-name']"
                >
                  {{ premium.fullName }}
                </p>
              </div>
              <p>Strategy</p>
            </div>
            <div class="insurance__premiums-asset-nav-mobile">
              <p class="insurance__premiums-assets-mobile-score">
                {{ calculatePercentPortfolio(premium
                  .netAssetValue, totalNAV(premiumsData as any))}}
              </p>
              <p>% in collateral</p>
            </div>
            <div class="insurance__premiums-asset-liq-val-mobile">
              <p>
                {{ formatCurrency(premium.netAssetValue)}}
              </p>
              <p>Net asset value, USDC</p>
            </div>
            <div class="insurance__premiums-asset-share">
              <p>Share of yield retained as premiums in %</p>
            </div>
            <div class="insurance__premiums-asset-share-mobile">
              <div class="insurance-premium-progress-bar">
                <div
                  class="insurance-premium-progress"
                  :style="{ width: premium.riskFactor + '%', 'background-color': getIconColor(premiumsData.indexOf(premium)) }"
                />
              </div>
              <p class="insurance-premium-token-portfolio-num">{{ premium.riskFactor }}%</p>
            </div>
          </div>
          <div class="insurance__premiums-divider" />
        </div>
      </div>
      <div class="insurance__premiums-total">
        <p>Total</p>
        <div class="insurance__premiums-total-NAV">
          <p>
            {{ formatCurrency(totalNAV(premiumsData as any)) }}
          </p>
          <p>Net asset value, USDC</p>
        </div>
        <div class="insurance__premiums-total-share">
          <p>Premiums in %</p>
          <p>{{calculateTotalPremiumsPercentage(premiumsData as any)}}</p>
        </div>
      </div>
    </div>
  </div>
  <p class="insurance__premiums-payouts-title">INSURANCE PAYOUTS</p>

</template>

<script lang="ts">
import { deviceType } from '@/utils/deviceType.ts';

export default {
  name: 'InsurancePremiums',
  props: {
    premiumsData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    device() {
      return deviceType();
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
  padding-bottom: 20px;
  padding-top: 20px;
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
.insurance-premium-token-portfolio-num {
  flex: none;
  width: 60px;
  text-align: right;
}

.insurance__premiums-total {
  display: flex;
  justify-content: space-between;
}

.insurance__portfolio-divider {
  margin-bottom: 10px;
  border: 1px solid var(--color-5);
  width: 96%;
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
  background-color: var(--color-5);
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

.insurance__premiums-total {
  display: grid;
  grid-template-columns: 4fr 1fr 2.2fr 0fr;
  text-align: center;
}
.insurance__premiums-total-premiums {
  text-align: right;
}
.insurance__premiums-total p:first-child {
  text-align: left;
}

.insurance__premiums-total p  {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__premiums-strategies-table-score {
  margin-right: 20px;
}

.insurance__total-info {
  padding: 0px 20px;
}
.insurance__premiums-payouts-title {
  margin-top: 24px;
  font-size: 17px;
  color: var(--color-1);
  font-weight: 500;
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

  .insurance-premium-portfolio-percent {
    justify-content: flex-end;
  }
  .insurance__premiums-specs,
  .insurance-premium {
    grid-template-columns: 1.8fr 1fr 1.3fr 1.5fr;
  }
  .insurance__premiums-total {
    grid-template-columns: 4fr 1.2fr 2.2fr 0fr;
  }
  .insurance__premiums-strategies-table-score {
    margin: 0;
  }

  .insurance__premiums-specs p:last-child {
    text-align: right;
  }

  .insurance__premiums-total-label--circl {
    margin-right: 90px;
  }
}

@media (max-width: 768px) {
  .insurance__premiums-title {
    font-size: 15px;
  }
  .insurance__premiums-specs {
    font-size: 14px;
  }
  .insurance-premium-portfolio-percent {
    justify-content: flex-end;
  }
  .insurance__premiums-strategies-table-score {
    text-align: left;
  }
  .insurance__premiums-specs,
  .insurance-premium {
    grid-template-columns: 2fr 1fr 1fr 1.3fr;
  }

  .insurance__premiums-total {
    grid-template-columns: 5.2fr 1fr 2.2fr 0fr;
    p {
      white-space: nowrap;
      font-size: 13px;
    }
  }
  .insurance-premium p{
    font-size: 13px;
  }

  .insurance-premium-name {
    margin-left: 4px;
  }
  .insurance-premium-token-portfolio-num {
    flex: none;
    width: auto;
    margin-left: 5px;
  }
  .insurance-premium-progress-bar {
    width: 40px;
  }
}
@media (max-width: 500px) {
  .insurance-premium {
    padding: 0px 2px;
    display: flex;
    gap: 10px;
  }
  .insurance-premium-name {
    max-width: 30px;
  }
}

@media (max-width: 640px) {
  .insurance__premiums-title {
    font-size: 17px;
    margin-bottom: 24px;
  }
  .insurance-premium-name {
    max-width: 100%;
  }
  .insurance__premiums-strategies {
    display: flex;
    flex-direction: column;
  }
  .insurance__premiums-asset {
    padding: 0;
  }
  .insurance__premiums-asset-token-data {
    justify-content: space-between;
  }
  .insurance__premiums-asset {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .insurance__premiums-assets-mobile-mobile {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .insurance__premiums-assets-mobile {
    background-color: var(--color-8);
    border-radius: 10px;
    padding: 16px 10px;
    [data-theme="dark"] & {
      background-color: var(--color-7);
    }
  }
  .insurance__premiums-asset-token-data-mobile,
  .insurance__premiums-asset-nav-mobile,
  .insurance__premiums-asset-liq-val-mobile,
  .insurance__premiums-asset-percent-portfolio-mobile,
  .insurance__premiums-asset-share-mobile,
  .insurance__premiums-total-NAV,
  .insurance__premiums-total-share {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .insurance__premiums-total-share p:first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .insurance__premiums-asset-share p {
    color: var(--color-18);
    text-align: right;
  }
  .insurance__premiums-asset-icon {
    width: 14px;
    height: 14px;
    border-radius: 5px;
    margin-right: 6px;
  }
  .insurance__premiums-asset-icon-mobile {
    display: flex;
    flex-direction: row;
  }
  .insurance__premiums-assets-mobile-mobile {
    gap: 10px;
  }
  .insurance__premiums-asset-token-name {
    max-width: none;
  }
  .insurance__premiums-asset-token-data-mobile p:last-child,
  .insurance__premiums-asset-token-name {
    margin: 0;
  }
  .insurance__premiums-asset-progress-bar {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 150px;
    max-height: 12px;
  }
  .insurance__premiums-asset-token-portfolio-num {
    position: absolute;
    left: 100%;
    margin-left: 10px;
  }

  .insurance__premiums-asset-token-data-mobile p,
  .insurance__premiums-asset-nav-mobile p,
  .insurance__premiums-asset-liq-val-mobile p,
  .insurance__premiums-asset-percent-portfolio-mobile p {
    font-size: 14px;
  }

  .insurance__premiums-asset-token-data-mobile:nth-child(1),
  .insurance__premiums-asset-nav-mobile p:last-child,
  .insurance__premiums-asset-liq-val-mobile p:last-child,
  .insurance__premiums-asset-percent {
    color: var(--color-18);
  }
  .insurance__premiums-asset-token-name.asset {
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .insurance__premiums-divider {
    margin-top: 10px;
    margin-bottom: 16px;
    border: 1px solid var(--color-7);
    [data-theme="dark"] & {
      border-color: var(--color-2);
    }
  }
  .insurance__premiums-assets-mobile-score,
  .insurance__premiums-asset-liq-val-mobile p:first-child {
    color: var(--color-1);
    font-weight: 500;
  }
  .insurance-premium-progress-bar {
    width: 100%;
    margin-right: 10px;
  }
  .insurance__premiums-total {
    gap: 10px;
    display: flex;
    flex-direction: column;
    p {
      font-size: 14px;
      color: var(--color-2);
    }
  }
}

</style>
