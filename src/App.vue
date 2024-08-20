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
          @on-click="toggleDeprectedModal"
        >
          LEARN MORE
        </ButtonComponent>
      </div>
    </div>

    <div class="container">
      <RouterView />
    </div>

    <FooterDesktop v-if="deviceType().isDesktop" />
    <FooterMobile v-else />

    <WaitingModal :show-modal="showWaitModal" />
    <ErrorModal :show-modal="showErrorModal" />
    <SuccessModal
      v-if="showSuccessModal"
      :show-modal="showSuccessModal"
    />
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
import FooterMobile from '@/components/Layout/FooterMobile/Index.vue';
import FooterDesktop from '@/components/Layout/FooterDesktop/Index.vue';
import WaitingModal from '@/modules/ModalTemplates/WaitingModal/Index.vue';
import ErrorModal from '@/modules/ModalTemplates/ErrorModal/Index.vue';
import SuccessModal from '@/modules/ModalTemplates/SuccessModal/Index.vue';
import DeprecatedModal from '@/modules/ModalTemplates/DeprecatedModal/Index.vue';
import { deviceType } from '@/utils/deviceType.ts';
import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'AppView',
  components: {
    RouterView,
    HeaderBar,
    FooterMobile,
    FooterDesktop,
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
  computed: {
    ...mapGetters('network', ['isShowDeprecated']),
    ...mapGetters('waitingModal', { showWaitModal: 'show' }),
    ...mapGetters('errorModal', { showErrorModal: 'show' }),
    ...mapGetters('successModal', { showSuccessModal: 'show' }),
  },
  async mounted() {
    await this.$store.dispatch('theme/initTheme');
    await this.$store.dispatch('walletAction/dappInitWalletConnect');
  },
  methods: {
    deviceType,
    toggleDeprectedModal() {
      this.showDeprecatedModal = true;
    },
  },
};
</script>
<style lang="scss" src="./app.scss" scoped />
