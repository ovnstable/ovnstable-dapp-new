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
          {{ type === 'portfolio' ? 'Safety score' : 'Net Asset Value USDC' }}
        </p>
        <p class="performance__portfolio-strategies-specification nav">
          {{ type === 'portfolio' ? 'Net Asset Value' : 'Liquidation value USDC' }}
        </p>
        <p class="performance__portfolio-strategies-specification percent">Percent in portfolio</p>
      </div>
      <div class="performance__portfolio-strategies-divider" />
      <div
        v-for="asset in assets as any[]"
        :key="asset.tokenName"
        class="performance__portfolio-strategies-stablecoins"
      >
        <div class="performance__portfolio-strategy">
          <div class="performance__portfolio-strategy-token-data">
            <BaseIcon
              name="tokenImage"
              :path="type === 'portfolio' ? asset.tokenImagePath : asset.strategyImagePath"
              class="performance__portfolio-strategy-token-img"
            />
            <p class="performance__portfolio-strategy-token-name">
              {{ type === 'portfolio' ? asset.tokenNameAsset : asset.strategyNameAsset }}
            </p>
            <a
              :href=asset.tokenLink
              class="performance__portfolio-strategy-token-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Link for token"
            >
              <BaseIcon
                name="tokenLink"
                path="assets/icons/common/LinkToken.vue"
                class="performance__portfolio-strategy-token-link-img"
              />
            </a>

          </div>
          <p :class="['performance__portfolio-strategy-token-score', type !== 'portfolio' ? 'nav-usdc' : '']">
            {{ type === 'portfolio' ? asset.safetyScore : formatCurrency(asset.netAssetValue) }}
          </p>
          <p class="performance__portfolio-strategy-token-NAV">
            {{ type === 'portfolio' ? formatCurrency(asset.NAV) : formatCurrency(asset.liquidationValue) }}
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
            {{ formatCurrency(totalNAV(assets)) }}
          </p>
          <p class="performance__portfolio-total-liquidation-value">
            {{ formatCurrency(totalLiquidationValue(assets)) }}
          </p>
        </div>
        <div class="performance__portfolio-total-circulation">
          <p class="performance__portfolio-total-label">Total {{ tokenName }} in circulation</p>
          <p class="performance__portfolio-total-circulation-number">
            {{ formatCurrency(tokenAmountInCirculation) }}
          </p>
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
  },
  methods: {
    formatCurrency(value: number) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(value).replace(/,/g, ' ');
    },
    totalNAV(assets: any[]) {
      return assets.reduce((total: number, asset: any) => total + asset.netAssetValue, 0);
    },
    totalLiquidationValue(assets: any[]) {
      return assets.reduce((total: number, asset: any) => total + asset.liquidationValue, 0);
    },

  },

};
</script>

<style>
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
    justify-content: space-between;
    color: var(--color-light-grey);
    font-size: 14px;
    font-weight: 400;
    padding: 0 20px;
}

.performance__portfolio-strategy {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.performance__portfolio-strategy-token-data {
    display: flex;
    align-items: center;
    flex: 1;
}

.performance__portfolio-strategy-token-name {
    margin-left: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
    font-weight: 400;
}

.performance__portfolio-strategy-token-link {
    margin-left: auto;
}

.performance__portfolio-strategy-token-score {
    flex: 1;
    text-align: center;
    color: var(--color-green);
    font-size: 16px;
    font-weight: 400;
}

.performance__portfolio-strategy-token-NAV {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
}

.performance__portfolio-strategy-portfolio-percent {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
}

.performance__portfolio-strategy-token-portfolio {
    margin-right: 12px;
}

.performance__portfolio-strategy-token-portfolio-number {
    white-space: nowrap;
    font-size: 16px;
    font-weight: 400;
}


.performance__portfolio-strategy-token-img,
.performance__portfolio-strategy-token-link,
.performance__portfolio-strategy-token-portfolio {
    flex-shrink: 0;
}
.performance__portfolio-strategies-divider {
   border: 1px solid var(--color-light-grey);
}
.score {
    margin-left: 80px;
}
.nav {
    margin-right: 15px;
}
.nav-usdc {
  color: var(--color-black);
}

.performance__portfolio-total-info {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-bottom: 12px;
  padding-left: 68px;
}

.performance__portfolio-total {
  display: flex;
  justify-content: space-between;
  max-width: calc(100% - 270px);
}

.performance__portfolio-total-nav-value,
.performance__portfolio-total-liquidation-value,
.performance__portfolio-total-circulation-number {
  font-weight: 400;
  text-align: right;
}

.performance__portfolio-total-nav-value {
  margin-left: 80px;
}

.performance__portfolio-total-circulation {
  display: flex;
  flex-direction: row;
}

.performance__portfolio-total-circulation-number {
  margin-left: 75px;
}

.performance__portfolio-total-nav-value,
.performance__portfolio-total-liquidation-value,
.performance__portfolio-total-circulation-number {
  font-size: 16px;
  font-weight: 800;
}

@media (max-width: 1024px) {
  .performance__portfolio-strategies-token-title {
    font-size: 20px;
  }
  .performance__portfolio-strategy-token-img,
  .performance__portfolio-strategy-token-link-img,
  .performance__portfolio-strategy-token-portfolio {
    transform: scale(0.85);
  }

  .performance__portfolio-strategy-token-name,
  .performance__portfolio-strategy-token-score,
  .performance__portfolio-strategy-token-NAV,
  .performance__portfolio-strategy-token-portfolio-number {
    font-size: 14px;
  }
  .score {
    margin-left: 20px;
  }
  .nav {
    margin-right: 30px;
  }

  .performance__portfolio-total {
    max-width: calc(100% - 160px);
  }

  .performance__portfolio-total-info {
    padding-left: 40px;
  }

  .performance__portfolio-total-liquidation-value {
    margin-right: 40px;
  }

  .performance__portfolio-total-nav-value {
    margin-left: 120px;
  }
  .performance__portfolio-total-circulation-number {
    margin-left: 12px;
  }
  .performance__portfolio-total-nav-value,
  .performance__portfolio-total-liquidation-value,
  .performance__portfolio-total-circulation-number {
    font-size: 14px;
  }
  .performance__portfolio-total-label{
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .performance__portfolio-strategies-token-title {
    font-size: 14px;
  }
  .performance__portfolio-strategy-token-img,
  .performance__portfolio-strategy-token-link-img,
  .performance__portfolio-strategy-token-portfolio {
    transform: scale(0.6);
  }

  .performance__portfolio-strategy-token-name,
  .performance__portfolio-strategy-token-score,
  .performance__portfolio-strategy-token-NAV,
  .performance__portfolio-strategy-token-portfolio-number {
    font-size: 12px;
  }
  .score {
    margin-left: 5px;
  }
  .nav {
    margin-right: 10px;
  }

  .performance__portfolio-strategy-portfolio-percent {
    display: none;
  }
  .performance__portfolio-strategies-specification {
    font-size: 10px;
  }

  .performance__portfolio-total {
    max-width: 100%
  }
  .performance__portfolio-total-nav-value,
  .performance__portfolio-total-liquidation-value,
  .performance__portfolio-total-circulation-number {
    font-size: 12px;
  }
  .performance__portfolio-total-label{
    font-size: 12px;
  }
}

@media (max-width: 576px) {
    .performance__portfolio-strategy-token-name {
        margin-left: 0;
    }
    .performance__portfolio-strategy {
        padding: 10px 10px;
    }
    .performance__portfolio-strategies-stablecoins-specifications {
        padding: 0 5px;
    }
    .performance__portfolio-strategies-token-title {
        font-size: 12px;
    }
    .performance__portfolio-strategy-token-img,
    .performance__portfolio-strategy-token-link-img,
    .performance__portfolio-strategy-token-portfolio {
        transform: scale(0.5);
    }

    .performance__portfolio-strategy-token-name,
    .performance__portfolio-strategy-token-score,
    .performance__portfolio-strategy-token-NAV,
    .performance__portfolio-strategy-token-portfolio-number {
        font-size: 10px;
    }
    .score {
        margin-left: 5px;
    }
    .nav {
        margin-right: 10px;
    }

    .performance__portfolio-strategies-specification {
        font-size: 8px;
    }
    .performance__portfolio-total-nav-value,
    .performance__portfolio-total-liquidation-value,
    .performance__portfolio-total-circulation-number {
      font-size: 10px;
    }
    .performance__portfolio-total-label{
     font-size: 10px;
    }
    .performance__portfolio-total-nav-value {
      margin-left: 90px;
    }
    .performance__portfolio-total-info {
      padding-left: 10px;
    }
}

</style>
