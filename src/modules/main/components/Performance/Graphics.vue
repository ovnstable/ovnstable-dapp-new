<template>
  <div class="performance__graphics">
    <div class="performance__graphics-APY-graphic">
      <GraphicComponent />
    </div>
    <div class="performance__graphics-TVL-graphic">
      <GraphicComponent />
    </div>
  </div>
</template>
<script lang="ts">

import GraphicComponent from '@/modules/main/components/Performance/Graphic.vue';

export default {
  name: 'GraphicsPerformance',
  components: {
    GraphicComponent,
  },
};
</script>

<style scoped>
  .performance__graphics {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  border: 1px solid var(--color-black);
  background: var(--color-white);
  box-shadow: 0px 1px 0px 0px var(--color-black);
  padding: 14px 20px;
  width: calc(100% - 40px);
}

@media (max-width: 1024px) {
  .performance__graphics {
    flex-direction: column;
  }
  .performance__graphics-TVL-graphic {
    margin-top: 50px;
    width: 100%;
  }
  .performance__graphics-APY-graphic {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .performance__graphics {
    flex-direction: column;
  }
  .performance__graphics-TVL-graphic {
    margin-top: 50px;
  }
}

</style>
