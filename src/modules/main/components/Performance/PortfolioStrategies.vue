<template>
  <p class="performance__portfolio-strategies-token-title">{{ tokenName }} portfolio</p>
  <div class="performance__portfolio-strategies">
    <div class="performance__portfolio-strategies-stablecoins">
      <div class="performance__portfolio-strategies-stablecoins-specifications">
        <p class="performance__portfolio-strategies-specification">Stablecoin</p>
        <p class="performance__portfolio-strategies-specification score">Safety score</p>
        <p class="performance__portfolio-strategies-specification nav">Net Asset Value</p>
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
              :path=asset.tokenImagePath
              class="performance__portfolio-strategy-token-img"
            />
            <p class="performance__portfolio-strategy-token-name">{{ asset.tokenNameAsset }}</p>
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
              />
            </a>

          </div>
          <p class="performance__portfolio-strategy-token-score">{{asset.safetyScore }}</p>
          <p class="performance__portfolio-strategy-token-NAV">{{ asset.NAV }}</p>
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
    </div>
    <div class="performance__portfolio-strategies-piechart">
      <p>Piechart</p>
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

.performance__portfolio-strategies-piechart {
    margin-left: 60px;
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

</style>
