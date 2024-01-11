<template>
  <div :class="['swap-module', { 'dark-theme-swap-module': isDarkTheme }]">
    <div class="swap-module__form" />
    <SliderComponent />
  </div>
</template>

<script lang="ts">
import SliderComponent from '@/modules/main/components/Slider/Index.vue';
import { mapState } from 'vuex';

export default {
  name: 'MainModule',
  components: {
    SliderComponent,
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

<style>
.swap-module {
  display: flex;
  width: 100%;
  background-color: #F4FAFE;
  border-radius: 30px;
  transition: background-color 0.15s ease;
}
.swap-module__form {
  width: 60%;
}
.dark-theme-swap-module {
  background-color: var(--color-dark-theme-dark-blue-2);
  transition: background-color 0.15s ease;
}
</style>
