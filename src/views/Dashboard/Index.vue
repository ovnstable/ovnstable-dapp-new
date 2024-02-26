<template>
  <DashboardPage
    :portfolioBalanceData="portfolioBalanceData"
    :firstLoad="firstRender"
    :loaded="loaded"
  />
</template>

<script lang="ts">
import DashboardPage from '@/modules/Dashboard/Index.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'DashboardView',
  components: {
    DashboardPage,
  },
  data() {
    return {
      loaded: true,
      firstRender: true,
    };
  },
  computed: {
    portfolioBalanceData() {
      return this.$store.state.porfolioBalanceData.porfolioBalanceData || {};
    },
    ...mapGetters('accountData', ['account']),
  },
  watch: {
    account(newAccount) {
      if (newAccount) {
        this.fetchDataForPortfolioBalance(this.$store.state.network.dashboardNetwork.toLowerCase());
      }
    },
    '$store.state.network.dashboardNetwork': {
      immediate: true,
      handler: function handleNetworkNameChange(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.fetchDataForPortfolioBalance(this.$store.state.network.dashboardNetwork);
        }
      },
    },
  },
  methods: {
    async fetchDataForPortfolioBalance(networkName: string) {
      this.loaded = false;
      const { account } = this;
      try {
        await Promise.all([
          this.$store.dispatch('porfolioBalanceData/fetchBalanceData', { account, networkName }),
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
