<template>
  <p class="performance__portfolio-strategies-token-title">{{ tokenName }} portfolio</p>
  <div class="performance__portfolio-strategies">
    <div class="performance__portfolio-strategies-stablecoins">
      <div class="performance__portfolio-strategies-stablecoins-specifications">
        <p class="performance__portfolio-strategies-specification">Stablecoin</p>
        <p class="performance__portfolio-strategies-specification">Safety score</p>
        <p class="performance__portfolio-strategies-specification">Net Asset Value</p>
        <p class="performance__portfolio-strategies-specification">Percent in portfolio</p>
      </div>
      <div
        v-for="asset in assets as any[]"
        :key="asset.tokenName"
        class="performance__portfolio-strategies-stablecoins"
      >
        <div class="performance__portfolio-strategy">
          <BaseIcon
            name="tokenImage"
            :path=asset.tokenImagePath
            class="performance__portfolio-strategy-token-img"
          />
          <p class="performance__portfolio-strategy-token-name">{{asset.tokenNameAsset }}</p>
          <BaseIcon
            name="tokenLink"
            path="assets/icons/common/LinkToken.vue"
            class="performance__portfolio-strategy-token-link"
          />
          <p class="performance__portfolio-strategy-token-score">{{asset.safetyScore }}</p>
          <p class="performance__portfolio-strategy-token-NAV">{{ asset.NAV }}</p>
          <BaseIcon
            name="percentPortfolio"
            :path=asset.percentPortfolioPath
            class="performance__portfolio-strategy-token-portfolio"
          />
          <p class="performance__portfolio-strategy-token-portfolio-number">{{ asset.percentPortfolio }}</p>
        </div>
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

</style>
