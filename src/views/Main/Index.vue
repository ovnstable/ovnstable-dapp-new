<template>
  <div class="main-module">
    <MainModule
      :slider-data="sliderData"
      :sliderLoaded="sliderLoaded"
    />
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
  data() {
    return {
      sliderLoaded: true,
    };
  },
  computed: {
    sliderData() {
      return this.$store.state.sliderData.sliderData || {};
    },
  },
  methods: {
    async fetchDataSlider() {
      this.sliderLoaded = false;
      try {
        await Promise.all([
          this.$store.dispatch('sliderData/fetchSliderData'),
        ]);
        this.sliderLoaded = true;
      } catch (error) {
        this.sliderLoaded = false;
        console.error('Error fetching data:', error);
      }
    },
  },
  mounted() {
    this.fetchDataSlider();
  },
};
</script>

<style>
.main-module {
  width: 100%;
}
</style>
