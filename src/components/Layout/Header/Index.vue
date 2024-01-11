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
            <h2 style="padding: 10px 0 0;">Привет</h2>
          </template>

          <p>Я - модальное окно. Закрой меня скорее.</p>

          <template #footer>
            <ButtonComponent
              label="Закрыть"
              style="margin: 0 auto;"
              @click="showModal = false"
            />
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
import Logo from '@/assets/icons/header/IconLogo.vue';

export default {
  name: 'HeaderBar',
  components: {
    WalletComponent,
    ButtonComponent,
    ModalComponent,
    Logo,
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
</style>
