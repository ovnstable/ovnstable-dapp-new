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
          text="DISCONNECT"
          @click="disconnectWallet"
        />
        <ButtonComponent
          v-else
          text="CONNECT"
          @click="connectWallet"
        />
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
import Logo from '@/assets/icons/header/IconLogo.vue';

export default {
  name: 'HeaderBar',
  components: {
    WalletComponent,
    ButtonComponent,
    Logo,
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
