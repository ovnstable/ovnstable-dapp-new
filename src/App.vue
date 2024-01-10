<template>
  <div class="app-wrapper">
    <HeaderBar />

    <div
      class="container"
      :class="{ 'dark-theme': isDarkTheme }"
    >
      <Sidebar />
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { RouterView } from 'vue-router';
import HeaderBar from '@/components/Layout/Header/Index.vue';
import Sidebar from '@/components/Layout/Sidebar/Index.vue';

export default {
  name: 'AppView',
  components: {
    RouterView,
    HeaderBar,
    Sidebar,
  },
  computed: {
    ...mapState({
      isDarkTheme: (state:any) => state.accountUI.isDarkTheme,
    }),
  },
  async mounted() {
    await this.$store.dispatch('web3/initWeb3');
    await this.$store.dispatch('walletAction/dappInitWalletConnect');
  },
};
</script>

<style scoped>
.app-wrapper {
  width: 100vw;
}
.container {
  width: 100%;
  max-width: 1360px;
  padding: 0 20px;
  gap: 80px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  transition: background-color 0.15s ease;
}
.dark-theme {
  background-color: var(--color-dark-theme-background);
  transition: background-color 0.15s ease;
}
</style>
