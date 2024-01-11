<template>
  <div :class="['app-wrapper', { 'dark-theme-app-wrapper': isDarkTheme }]">
    <HeaderBar />

    <div :class="['container', { 'dark-theme-container': isDarkTheme }]">
      <Sidebar />
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import { RouterView } from 'vue-router';
import HeaderBar from '@/components/Layout/Header/Index.vue';
import Sidebar from '@/components/Layout/Sidebar/Index.vue';
import { mapState } from 'vuex';

export default {
  name: 'AppView',
  components: {
    RouterView,
    HeaderBar,
    Sidebar,
  },
  async mounted() {
    await this.$store.dispatch('web3/initWeb3');
    await this.$store.dispatch('walletAction/dappInitWalletConnect');
  },
  computed: {
    ...mapState({
      isDarkTheme: (state: any) => state.accountUI.isDarkTheme,
    }),
    themeClass() {
      return {
        'dark-theme': this.isDarkTheme,
        'light-theme': !this.isDarkTheme,
      };
    },
  },
};
</script>

<style scoped>
.app-wrapper {
  width: 100vw;
  transition: background-color 0.15s ease;
}
.container {
  width: 100%;
  max-width: 1360px;
  padding: 0 20px;
  gap: 80px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.dark-theme-app-wrapper {
  background-color: var(--color-dark-theme-background);
  transition: background-color 0.15s ease;
}
</style>
