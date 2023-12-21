<template>
  <div class="app-header">
    <div class="app-header__container">
      <div class="theme-toggle-group">
        <button
          type="button"
        >
          DARK/LIGHT
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

export default {
  name: 'HeaderBar',
  components: {
    WalletComponent,
  },
};
</script>

<style scoped>
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
  max-width: 1320px;
  margin: 0 auto;
}
</style>
