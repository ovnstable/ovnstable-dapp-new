<template>
  <component
    :is="dynamicComponent"
    :fill-color="fillColor"
  />
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    fillColor: {
      type: String,
      default: '#687386',
      required: false,
    },
  },

  computed: {
    dynamicComponent() {
      // const name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
      return defineAsyncComponent(() => import(/* @vite-ignore */`../../${this.path}`));
    },
  },
};
</script>
