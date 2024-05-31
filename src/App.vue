<template>
  <div class="app-wrapper">
    <HeaderBar />

    <div
      v-if="isShowDeprecated"
      class="container"
    >
      <div class="app-wrapper__notify">
        <p>
          Dear users, please withdraw your funds from
          <b>Deprecated chains</b> also redeem your <b>Deprecated tokens</b>.
        </p>
        <ButtonComponent
          btn-styles="transparent"
          @on-click="showModal"
        >
          LEARN MORE
        </ButtonComponent>
      </div>
    </div>

    <div class="container">
      <Sidebar />
      <RouterView />
    </div>

    <FooterMobile v-if="!deviceType().isDesktop" />

    <WaitingModal :show-modal="showWaitModal" />
    <ErrorModal :show-modal="showErrorModal" />
    <SuccessModal :show-modal="showSuccessModal" />
    <DeprecatedModal
      :show-modal="showDeprecatedModal"
      @close="showDeprecatedModal = false"
    />
    <notifications />
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
import DeprecatedModal from '@/modules/ModalTemplates/DeprecatedModal/Index.vue';
import { deviceType } from '@/utils/deviceType.ts';
import ButtonComponent from '@/components/Button/Index.vue';
import { DEPRECATED_NETWORKS } from './utils/const.ts';

export default {
  name: 'AppView',
  components: {
    RouterView,
    HeaderBar,
    Sidebar,
    FooterMobile,
    DeprecatedModal,
    ErrorModal,
    WaitingModal,
    SuccessModal,
    ButtonComponent,
  },
  data() {
    return {
      showDeprecatedModal: false,
    };
  },
  async mounted() {
    await this.$store.dispatch('theme/initTheme');
    await this.$store.dispatch('web3/initWeb3');
    await this.$store.dispatch('walletAction/dappInitWalletConnect');
    // await this.fetchDataForBlastQuest();

    this.$store.dispatch('odosData/initUpdateBalancesInterval');
  },
  methods: {
    deviceType,
    showModal() {
      this.showDeprecatedModal = true;
    },
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
    ...mapGetters('network', ['networkId', 'isShowDeprecated']),
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

.app-wrapper__notify {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-bottom: 50px;
  background-color: var(--color-3);
  color: var(--color-4);
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;

  b {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    margin: 0 15px 0 15px;
  }
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
