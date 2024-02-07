<template>
  <MarketPage :token-data="tokenData" :portfolio-data="portfolioData" :collateral-data="collateralData"
    :payout-data="payoutData" />
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
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.handleMarketIdChange(newId);
      },
    },
    '$store.state.network.networkName': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.handleNetworkChange();
      }
    },
  },
  methods: {
    handleMarketIdChange(newId:any) {
      const marketId = Array.isArray(newId) ? newId[0] : newId;
      if (!marketId || marketId === this.previousId) return;

      const tokenKey = `${marketId.toLowerCase()}Plus`;
      const currentNetworkName = this.$store.state.network.networkName.toLowerCase();
      const availableNetworks = Object.entries(chainContractsMap)
        .reduce((acc, [network, tokens]) => {
          if (tokens[tokenKey] && tokens[tokenKey].tokenPlus) {
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
      if (marketId) {
        this.fetchDataForMarketId(marketId, this.$store.state.network.networkName);
      }
    },
    async fetchDataForMarketId(marketId:any, networkName:string) {
      try {
        await Promise.all([
          this.$store.dispatch('tokenData/fetchTokenData', { marketId, networkName }),
          this.$store.dispatch('portfolioData/fetchPortfolioData', { marketId, networkName }),
          this.$store.dispatch('collateralData/fetchCollateralData', { marketId, networkName }),
          this.$store.dispatch('payoutData/fetchPayoutData', { marketId, networkName }),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    saveNetworkToLocalStore(chain:string) {
      this.$store.dispatch('network/changeDappNetwork', chain.toLowerCase());
    },
  },
  created() {
    if (!this.$route.params.id) {
      this.$router.push({ name: 'market', params: { id: 'usd' } });
    }
  },
};
</script>


<style>
.modal-content {
  padding: 50px 70px 30px 70px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-1);
    margin-bottom: 20px;
    text-align: center;
  }
}

.modal-content__spin {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.modal-content__confirm {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-2);
  margin-bottom: 40px;
  text-align: center;
}

.divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-7);
}

.modal-content__tips {
  margin-top: 40px;
}

</style>
