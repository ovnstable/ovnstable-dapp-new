<template>
  <component :is="dynamicComponent" />
</template>

<script lang="ts">
import { h } from 'vue';
import { svgIconsMap } from '@/utils/const.ts';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    dynamicComponent() {
      const svg = svgIconsMap.get(this.name);
      return svg && h(svg);
    },
  },
};
</script>
