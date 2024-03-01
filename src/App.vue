<template>
  <div class="app-wrapper">
    <HeaderBar />

    <div class="container">
      <Sidebar />
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
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
  async mounted() {
    await this.$store.dispatch('walletAction/dappInitWalletConnect');
    await this.$store.dispatch('web3/initWeb3');
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
}
@media (max-width: 768px) {
  .app-wrapper {
    width: 100vw;
  }
}

@media (max-width: 576px) {
  .app-wrapper {
    width: 100vw;
  }
}
</style>
