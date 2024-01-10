<template>
  <component :is="dynamicComponent" />
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { uniqueId } from 'lodash';

export default {
  props: {
    path: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: () => uniqueId('icon'),
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
