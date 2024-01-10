<template>
  <div class="swap-module">
    <div class="swap-module__form" />
    <SliderComponent />
  </div>
</template>

<script lang="ts">
import SliderComponent from '@/modules/main/components/Slider/Index.vue';

export default {
  name: 'MainModule',
  components: {
    SliderComponent,
  },
};
</script>

<style>
.swap-module {
  display: flex;
  width: 100%;
  background-color: #F4FAFE;
  border-radius: 30px;
}
.swap-module__form {
  width: 60%;
}
.dark-theme {
  background-color: var(--color-dark-theme-dark-blue-2);
  /* opacity: 50%; */
}
</style>
