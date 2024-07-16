<template>
  <div class="performance__graphics">
    <div
      v-if="!loaded"
      class="performance__graphics-APY-graphic"
    >
      <div class="graphic__loader">
        <Spinner />
      </div>
    </div>
    <div
      v-if="loaded && isDeprecated"
      class="performance__deprecated"
    >
      <p v-html="deprecatedText" />

      <div>
        <router-link to="/">
          <ButtonComponent
            btn-styles="secondary"
            class="performance__btn"
          >
            redeem/unwrap {{ tokenSymbol }}+
          </ButtonComponent>
        </router-link>
        <!-- <ButtonComponent
          btn-styles="secondary"
          class="performance__btn"
        >
          redeem/unwrap {{tokenSymbol}}+ on arbitrum
        </ButtonComponent> -->
      </div>
    </div>
    <div
      v-else-if="loaded"
      class="performance__graphics-APY-graphic"
    >
      <GraphicComponent
        :graphic-data="payoutData"
        :token-data="tokenData"
        type="APY"
      />
    </div>
    <div
      v-if="loaded && !isDeprecated"
      class="performance__graphics-TVL-graphic"
    >
      <GraphicComponent
        :graphic-data="payoutData"
        :token-data="tokenData"
        type="TVL"
      />
    </div>
  </div>
</template>
<script lang="ts">

import GraphicComponent from '@/modules/Market/SingleStatisticGraphic.vue';
import Spinner from '@/components/Spinner/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';

const deprecatedStringBuilder = (chainStr: string, symbol: string) => `${chainStr} ${symbol} tokens are deprecated. Overnight will no longer support these tokens. there will be no payments, Please <b>redeem</b> or <b>unwrap</b> your funds if you have invested in ${symbol}.`;

const deprecatedTextMap = [
  {
    symbol: 'dai',
    chain: [42161, 10, 8453],
    text: deprecatedStringBuilder('arbitrum, optimism and base', 'dai+'),
  },
  {
    symbol: 'eth',
    chain: [42161],
    text: deprecatedStringBuilder('arbitrum', 'eth+'),
  },
  {
    symbol: 'usdt',
    chain: [56, 324],
    text: deprecatedStringBuilder('binance and zksync', 'usdt+'),
  },
  {
    symbol: 'usd',
    chain: [137, 56, 324],
    text: deprecatedStringBuilder('polygon, binance and zksync', 'usd+'),
  },
];

const chains: {[key: string]: number} = {
  arbitrum: 42161,
  bsc: 56,
  optimism: 10,
  polygon: 137,
  base: 8453,
  zksync: 324,
};

export default {
  name: 'GraphicsPerformance',
  components: {
    GraphicComponent,
    ButtonComponent,
    Spinner,
  },
  props: {
    loaded: {
      type: Boolean,
      default: false,
    },
    payoutData: {
      type: Object,
      default: () => ({}),
    },
    tokenData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isDeprecated() {
      const marketUrlNetwork = this.$route.query.chain || this.$store.state.network.marketNetwork;
      const networkId = chains[marketUrlNetwork];
      const token = this.$route.params.id;

      if (!networkId || !token) return false;

      const isInDeprecated = deprecatedTextMap
        .some((_) => _.symbol === token && _.chain.includes(networkId));

      console.log(token, isInDeprecated);

      return isInDeprecated;
    },

    deprecatedText() {
      const marketUrlNetwork = this.$route.query.chain || this.$store.state.network.marketNetwork;
      const idNetwork = chains[marketUrlNetwork];
      const textData = deprecatedTextMap
        .find((_) => _.symbol === this.$route.params.id && _.chain.includes(idNetwork));

      return textData ? textData.text : '';
    },

    tokenSymbol() {
      return this.$route.params.id;
    },
  },
};
</script>

<style>
.performance__deprecated b {
  text-decoration: underline;
}
</style>
<style lang="scss" scoped>
.graphic__loader {
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.performance__graphics {
  min-height: 250px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  background: var(--color-4);
  [data-theme="dark"] & {
    background: var(--color-17);
  }

  > .performance__graphics-APY-graphic,
  > .performance__graphics-TVL-graphic {
    flex: 1;
  }
}

@media (max-width: 1024px) {
  .graphic__loader {
    min-height: 486px;
  }
  .performance__graphics {
    flex-direction: column;
  }
  .performance__graphics-TVL-graphic {
    margin: 0;
    width: 100%;
  }
  .performance__graphics-APY-graphic {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .performance__graphics {
    flex-direction: column;
  }
  .performance__graphics-TVL-graphic {
    margin-top: 0px;
  }
}

.performance__deprecated {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: var(--color-8);
  border-radius: 8px;
  width: 100%;
  text-align: center;
  font-weight: 600;
  line-height: 25px;
  text-transform: uppercase;
  height: 100%;
  p {
    width: 80%;
  }

  div {
    display: flex;
    margin-top: 20px;
    gap: 30px;
  }
}

.performance__btn {
  text-transform: uppercase;
}
</style>
