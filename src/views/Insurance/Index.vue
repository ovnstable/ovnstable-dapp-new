<template>
  <InsurancePage
    :token-data="insuranceTokenData"
    :loaded="loaded"
  />
</template>

<script lang="ts">
import InsurancePage from '@/modules/Insurance/Index.vue';

export default {
  name: 'MarketView',
  components: {
    InsurancePage,
  },
  data() {
    return {
      loaded: true,
    };
  },
  computed: {
    insuranceTokenData() {
      return this.$store.state.insuranceTokenData.insuranceTokenData || {};
    },
  },
  watch: {
    '$store.state.network.networkName': {
      immediate: true,
      handler: function handleNetworkNameChange(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.handleNetworkChange();
        }
      },
    },
  },
  async mounted() {
    await this.fetchDataForMarketId(this.$store.state.network.networkName.toLowerCase());
  },
  methods: {
    handleNetworkChange() {
      const marketId = this.$route.params.id;
      if (marketId) {
        this.fetchDataForMarketId(this.$store.state.network.networkName);
      }
    },
    async fetchDataForMarketId(networkName: string) {
      this.loaded = true;
      try {
        await Promise.all([
          this.$store.dispatch('insuranceTokenData/fetchInsuranceTokenData', { networkName }),
        ]);
        this.loaded = false;
      } catch (error) {
        this.loaded = true;
        console.error('Error fetching data:', error);
      }
    },
  },

};
</script>
