<template>
  <component :is="dynamicComponent" />
</template>

<script lang="ts">
import { defineComponent, h } from 'vue';

export function createSvgMap() {
  function getSvgNameFromPath(path: string) {
    const pathSplit = path.split('/');
    const fileName = pathSplit[pathSplit.length - 1] || '';
    const svgName = fileName.replace('.svg', '');

    return svgName;
  }

  const modules = import.meta.glob('@/assets/icons/**/*.svg', {
    import: 'default',
    eager: true,
  });

  const svgMap = new Map();

  Object.keys(modules).forEach((path) => {
    const svgName = getSvgNameFromPath(path);
    svgMap.set(svgName, modules[path]);
  });

  return svgMap;
}

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    dynamicComponent() {
      const svg = createSvgMap().get(this.name);
      return svg && h(svg);
    },
  },
});
</script>
