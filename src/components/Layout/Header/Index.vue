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
        <button
          type="button"
          class="app-header__connect"
        >
          CONNECT
        </button>
      </div>
      <WalletComponent
        v-if="false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import WalletComponent from '@/components/Layout/Header/WalletComponent.vue';
import Logo from '@/assets/icons/header/IconLogo.vue';

export default {
  name: 'HeaderBar',
  components: {
    WalletComponent,
    Logo,
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
