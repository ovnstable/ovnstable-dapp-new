<template>
  <div class="main-module">
    <p>{{ sliderData }}</p>
    <MainModule />
    <PoolsContainer :type="'ALL'" />
  </div>
</template>

<script lang="ts">
import MainModule from '@/modules/Main/Index.vue';
import PoolsContainer from '@/modules/Main/components/PoolsTable/Index.vue';

export default {
  name: 'MainView',
  components: {
    MainModule,
    PoolsContainer,
  },
  computed: {
    sliderData() {
      return this.$store.state.sliderData.sliderData || {};
    },
  },
  methods: {
    async fetchDataSlider() {
      console.log('lets try to fetch');
      try {
        await Promise.all([
          this.$store.dispatch('sliderData/fetchSliderData'),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
  mounted() {
    this.fetchDataSlider(); // Call the method here
  },
};
</script>

<style>
.main-module {
  width: 100%;
}
</style>
