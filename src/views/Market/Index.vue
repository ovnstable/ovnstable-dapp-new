<template>
  <MarketPage
    :token-data="tokenData"
    :portfolio-data="portfolioData"
    :collateral-data="collateralData"
    :payout-data="payoutData"
    :first-load="firstRender"
    :loaded="loaded"
  />
</template>

<script lang="ts">
import MarketPage from '@/modules/Market/Index.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';

export default {
  name: 'MarketView',
  components: {
    MarketPage,
  },
  data() {
    return {
      previousId: '',
      previousNetworkName: '',
      loaded: true,
      firstRender: true,
    };
  },
  computed: {
    tokenData() {
      return this.$store.state.tokenData.tokenData || {};
    },
    portfolioData() {
      return this.$store.state.portfolioData.portfolioData || {};
    },
    collateralData() {
      return this.$store.state.collateralData.collateralData || {};
    },
    payoutData() {
      return this.$store.state.payoutData.payoutData || {};
    },
  },
  mounted() {
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.handleMarketIdChange(newId);
      },
    },
    '$store.state.network.marketNetwork': {
      immediate: true,
      handler: function handleNetworkNameChange(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.handleNetworkChange();
        }
      },
    },
  },
  methods: {
    handleMarketIdChange(newId: any) {
      const marketId = Array.isArray(newId) ? newId[0] : newId;
      if (!marketId || marketId === this.previousId) return;

      const tokenKey = `${marketId.toLowerCase()}Plus`;
      const marketUrlNetwork = this.$route.query.chain as string;
      const currentNetworkName = marketUrlNetwork
        ? marketUrlNetwork?.toLowerCase() : this.$store.state.network.marketNetwork?.toLowerCase();

      const chainContractsAny: any = chainContractsMap;

      const availableNetworks = Object.entries(chainContractsAny)
        .reduce((acc: string[], [network, tokens]: [string, any]) => {
          if (tokenKey in tokens && tokens[tokenKey].tokenPlus) {
            acc.push(network);
          }
          return acc;
        }, []);

      if (!availableNetworks.includes(currentNetworkName)) {
        const newNetworkName = availableNetworks[0];
        if (newNetworkName) {
          this.saveNetworkToLocalStore(newNetworkName);
        } else {
          console.error(`No available networks found for token ${tokenKey}.`);
        }
      } else {
        this.fetchDataForMarketId(marketId, currentNetworkName);
      }

      this.previousId = marketId;
    },

    handleNetworkChange() {
      const marketId = this.$route.params.id;
      const marketUrlNetwork = this.$route.query.chain;
      const marketNetwork = marketUrlNetwork || this.$store.state.network.marketNetwork;

      if (marketId && marketNetwork) this.fetchDataForMarketId(marketId, marketNetwork);
    },
    async fetchDataForMarketId(marketId: any, networkName: string) {
      this.loaded = false;
      try {
        await Promise.all([
          this.$store.dispatch('tokenData/fetchTokenData', { marketId, networkName }),
          this.$store.dispatch('portfolioData/fetchPortfolioData', { marketId, networkName }),
          this.$store.dispatch('collateralData/fetchCollateralData', { marketId, networkName }),
          this.$store.dispatch('payoutData/fetchPayoutData', { marketId, networkName }),
        ]);
        this.loaded = true;
        this.firstRender = false;
      } catch (error) {
        console.error('Error fetching data:', error);
        this.loaded = false;
        this.firstRender = false;
      }
    },
    saveNetworkToLocalStore(chain:string) {
      this.$store.dispatch('network/changeMarketNetwork', chain.toLowerCase());
    },
  },
  created() {
    if (!this.$route.params.id) {
      this.$router.push({ name: 'market', params: { id: 'usd' } });
    }
  },
};
</script>
