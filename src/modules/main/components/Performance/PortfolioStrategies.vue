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
            <BaseIcon
              name="tokenLink"
              path="assets/icons/common/LinkToken.vue"
              class="performance__portfolio-strategy-token-link"
            />
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
}
.performance__portfolio-strategies-stablecoins {
    display: flex;
    flex-direction: column;
}
.performance__portfolio-strategies-stablecoins-specifications {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: var(--color-light-grey);
    font-size: 14px;
    font-weight: 400;
    padding: 0 20px;
}
.performance__portfolio-strategy {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 20px 20px 20px 20px;
}

.performance__portfolio-strategy-token-data {
    display: flex;
    align-items: center;
    min-width: 172px;
}
.performance__portfolio-strategy-token-name {
    margin-left: 12px;
}
.performance__portfolio-strategy-token-link {
    margin-left: auto;
}
.score {
    margin-left: 200px;
}
.nav {
    margin-left: 130px;
    margin-right: 226px;
}
.performance__portfolio-strategy-portfolio-percent {
    display: flex;
    flex-direction: row;
}
.performance__portfolio-strategy-token-portfolio {
    margin-top: 5px;
    margin-right: 12px;
}
.performance__portfolio-strategies-divider {
   border: 1px solid var(--color-light-grey);
}
.performance__portfolio-strategies-piechart {
    margin-left: 60px;
}
</style>
