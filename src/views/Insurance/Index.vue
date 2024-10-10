<template>
  <InsurancePage
    :token-data="insuranceTokenData"
    :payout-data="insurancePayouts"
    :premiums-data="insurancePremiums"
    :first-load="firstRender"
    :loaded="loaded"
  />
</template>

<script lang="ts">
import InsurancePage from '@/modules/Insurance/Index.vue';

export default {
  name: 'InsuranceView',
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
    insurancePayouts() {
      return this.$store.state.insurancePayouts.insurancePayouts || {};
    },
    insurancePremiums() {
      return this.$store.state.insurancePremiums.insurancePremiums || {};
    },
  },
  watch: {
    '$store.state.network.insuranceNetwork': {
      immediate: true,
      handler: function handleNetworkNameChange(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.fetchDataForInsurance();
        }
      },
    },
  },
  async mounted() {
    await this.fetchDataForInsurance();
  },
  methods: {
    async fetchDataForInsurance() {
      this.loaded = false;
      try {
        await Promise.all([
          this.$store.dispatch('insuranceTokenData/fetchInsuranceTokenData'),
          this.$store.dispatch('insurancePayouts/fetchInsurancePayouts'),
          this.$store.dispatch('insurancePremiums/fetchInsurancePremiums'),
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
