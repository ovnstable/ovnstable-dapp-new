<template>
  <InsurancePage
    :token-data="insuranceTokenData"
    :first-load="firstRender"
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
      firstRender: true,
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
          this.fetchDataForMarketId(this.$store.state.network.networkName);
        }
      },
    },
  },
  async mounted() {
    await this.fetchDataForMarketId(this.$store.state.network.networkName.toLowerCase());
  },
  methods: {
    async fetchDataForMarketId(networkName: string) {
      this.loaded = false;
      try {
        await Promise.all([
          this.$store.dispatch('insuranceTokenData/fetchInsuranceTokenData', { networkName }),
        ]);
        this.loaded = true;
        this.firstRender = false;
      } catch (error) {
        this.loaded = false;
        this.firstRender = false;
        console.error('Error fetching data:', error);
      }
    },
  },

};
</script>
