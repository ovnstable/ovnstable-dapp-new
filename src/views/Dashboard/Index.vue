<template>
  <DashboardPage
    :portfolioBalanceData="portfolioBalanceData"
    :firstLoad="firstRender"
    :loaded="loaded"
  />
</template>

<script lang="ts">
import DashboardPage from '@/modules/Dashboard/Index.vue';
import { mapGetters, mapActions } from 'vuex';

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
    '$store.state.network.dashboardNetwork': {
      immediate: true,
      handler: function handleNetworkNameChange(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.refreshBalance();
          this.fetchDataForPortfolioBalance(this.$store.state.network.dashboardNetwork);
        }
      },
    },
  },
  async mounted() {
    await this.fetchDataForPortfolioBalance(this
      .$store.state.network.dashboardNetwork.toLowerCase());
  },
  methods: {
    ...mapActions('accountData', ['refreshBalance']),
    async fetchDataForPortfolioBalance(networkName: string) {
      const { account } = this;
      this.loaded = false;
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
