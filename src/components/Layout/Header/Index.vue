<template>
  <div class="app-header">
    <div class="app-header__container">
      <div class="app-header__content">
        <div class="app-header__content__logo">
          <Logo />
          <h1>
            OVERNIGHT
          </h1>
        </div>
        <ButtonComponent
          v-if="walletConnected"
          @click="disconnectWallet"
        >DISCONNECT</ButtonComponent>
        <ButtonComponent
          v-else
          text="CONNECT"
          @click="connectWallet"
        >CONNECT</ButtonComponent>
        <ButtonComponent
          type="button"
          @click="openModal"
        >Open Modal</ButtonComponent>
        <ModalComponent v-model="showModal">
          <template #header>
            <BaseIcon
              name="modal-example"
              path="assets/icons/modal/ConfirmationModal.vue"
              class="app-header__modal-spinner"
            />
          </template>

          <p class="app-header__modal-title1">Waiting for confirmation</p>
          <p class="app-header__modal-confirmation-text">Confirm transaction in your wallet</p>
          <div class="app-header__modal-divider" />

          <template #footer>
            <p class="app-header__modal-title2">Tips of Dapp</p>
            <p class="app-header__modal-tip-text">
              Join our pools with one click with
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                class="app-header__modal-zap-in-text"
              >
                "Zap in"
              </a>
              button
            </p>
          </template>
        </ModalComponent>
      </div>
      <WalletComponent
        v-if="false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import WalletComponent from '@/components/Layout/Header/WalletComponent.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import ModalComponent from '@/components/Layout/Header/ModalComponent.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import Logo from '@/assets/icons/header/IconLogo.vue';

export default {
  name: 'HeaderBar',
  components: {
    WalletComponent,
    ButtonComponent,
    ModalComponent,
    Logo,
    BaseIcon,
  },
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    ...mapGetters('walletAction', ['walletConnected']),
  },
  methods: {
    disconnectWallet() {
      console.log('disconnectWallet');
      this.$store.dispatch('walletAction/disconnectWallet');
    },
    connectWallet() {
      console.log('connectWallet');
      this.$store.dispatch('walletAction/connectWallet');
    },
    openModal() {
      console.log('Open Modal clicked');
      this.showModal = true;
      console.log('showModal:', this.showModal);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 12px 0;
  background-color: #fff;
}

.app-header__container {
  width: 100%;
  max-width: 1360px;
  padding: 0 20px;
  margin: 0 auto;
}

.app-header__content {
  display: flex;
  justify-content: space-between;
}

.app-header__content__logo {
  display: flex;
  align-items: center;
  h1 {
    font-size: 15px;
    font-weight: 700;
    margin-left: 8px;
  }
}

.app-header__connect {
  display: block;
  margin-left: auto;
}

.app-header__modal-spinner {
  align-self: center;
}

.app-header__modal-title1 {
  margin-top: 40px;
  color: var(--color-black);
  font-size: 24px;
  font-weight: 600;
}

.app-header__modal-confirmation-text {
  margin-top: 20px;
  color: var( --color-dark-grey);
  font-size: 20px;
  font-weight: 600;
}
.app-header__modal-divider {
  border-top: 1px solid var(--color-light-grey);
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;
}

.app-header__modal-title2 {
  color: #29323E;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
}

.app-header__modal-tip-text {
  color: var(--color-dark-grey);
  font-size: 20px;
  font-weight: 400;
  margin-left: 118px;
  margin-right: 118px;
  margin-bottom: 56px;
}

.app-header__modal-zap-in-text {
  color: var(--color-blue);
  cursor: pointer;
}
.app-header__modal-zap-in-text:hover {
  text-decoration: underline;
}

.app-header__modal-spinner {
  animation: spin 2s linear infinite;
  margin-top: 56px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .app-header__modal-tip-text {
    margin-left: 80px;
    margin-right: 80px;
    margin-bottom: 40px;
  }
  .app-header__modal-spinner {
    margin-top: 40px;
  }
}

@media (max-width: 768px) {
  .app-header__modal-tip-text {
    margin-left: 60px;
    margin-right: 60px;
    margin-bottom: 30px;
  }
  .app-header__modal-spinner {
    margin-top: 30px;
  }
}
@media (max-width: 576px) {
.app-header__modal-tip-text {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .app-header__modal-spinner {
    margin-top: 10px;
  }
}

</style>
