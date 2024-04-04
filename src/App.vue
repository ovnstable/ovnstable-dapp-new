<template>
  <div class="app-wrapper">
    <HeaderBar />

    <div class="container">
      <Sidebar />
      <RouterView />
    </div>

    <FooterMobile v-if="!deviceType().isDesktop" />

    <WaitingModal :show-modal="showWaitModal" />
    <ErrorModal :show-modal="showErrorModal" />
    <SuccessModal :show-modal="showSuccessModal" />
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { RouterView } from 'vue-router';
import HeaderBar from '@/components/Layout/Header/Index.vue';
import Sidebar from '@/components/Layout/Sidebar/Index.vue';
import FooterMobile from '@/components/Layout/FooterMobile/Index.vue';
import WaitingModal from '@/modules/ModalTemplates/WaitingModal/Index.vue';
import ErrorModal from '@/modules/ModalTemplates/ErrorModal/Index.vue';
import SuccessModal from '@/modules/ModalTemplates/SuccessModal/Index.vue';
import { deviceType } from '@/utils/deviceType.ts';

export default {
  name: 'AppView',
  components: {
    RouterView,
    HeaderBar,
    Sidebar,
    FooterMobile,
    ErrorModal,
    WaitingModal,
    SuccessModal,
  },
  async mounted() {
    await this.$store.dispatch('theme/initTheme');
    await this.$store.dispatch('web3/initWeb3');
    await this.$store.dispatch('walletAction/dappInitWalletConnect');
    await this.fetchDataForBlastQuest();

    this.$store.dispatch('odosData/initUpdateBalancesInterval');
  },
  methods: {
    deviceType,
    async fetchDataForBlastQuest() {
      try {
        this.$store.commit('jackpotData/setJackpotDataLoaded', false);
        await Promise.all([
          this.$store.dispatch('jackpotData/fetchJackpotData'),
        ]);
        this.$store.commit('jackpotData/setJackpotDataLoaded', true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
  computed: {
    ...mapGetters('waitingModal', { showWaitModal: 'show' }),
    ...mapGetters('errorModal', { showErrorModal: 'show' }),
    ...mapGetters('successModal', { showSuccessModal: 'show' }),
  },
};
</script>
<style lang="scss" scoped>
.app-wrapper {
  height: calc(100vh - 100px);
}
.container {
  width: 100%;
  max-width: 1360px;
  padding: 0 20px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

  @media (min-width: 640px) {
    gap: 40px;
  }

  @media (min-width: 1024px) {
    gap: 80px;
  }
  @media (max-width: 640px) {
    margin-top: 60px;
    padding: 0;
  }
}
</style>
