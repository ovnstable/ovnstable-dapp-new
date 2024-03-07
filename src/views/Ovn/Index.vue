<template>
  <p>{{ OvnTokenData }}</p>
  <OvnPage />
</template>

<script lang="ts">
import OvnPage from '@/modules/Ovn/Index.vue';

export default {
  name: 'OvnView',
  components: {
    OvnPage,
  },
  data() {
    return {
      loaded: true,
      firstRender: true,
    };
  },
  computed: {
    ovnTokenData() {
      return this.$store.state.ovnTokenData.ovnTokenData || {};
    },
  },
  // watch: {
  //   '$store.state.network.ovnNetwork': {
  //     immediate: true,
  //     handler: function handleNetworkNameChange(newVal, oldVal) {
  //       if (newVal !== oldVal) {
  //         this.fetchDataForOVN(this.$store.state.network.ovnNetwork);
  //       }
  //     },
  //   },
  // },
  async mounted() {
    await this.fetchDataForOVN();
  },
  methods: {
    async fetchDataForOVN() {
      this.loaded = false;
      console.log('we are in fetchDataForOVN');
      try {
        await Promise.all([
          this.$store.dispatch('ovnTokenData/fetchOVNTokenData'),
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
