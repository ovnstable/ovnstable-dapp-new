<template>
  <div class="performance__graphics">
    <div class="performance__graphics-APY-graphic">
      <GraphicComponent :graphic-data=apyData />
    </div>
    <div class="performance__graphics-TVL-graphic">
      <GraphicComponent :graphic-data=tvlData />
    </div>
  </div>
</template>
<script lang="ts">

<<<<<<< HEAD:src/modules/Main/components/Market/Graphics.vue
import GraphicComponent from '@/modules/main/components/Market/SingleStatisticGraphic.vue';
=======
import GraphicComponent from '@/modules/Main/components/Performance/SingleStatisticGraphic.vue';
>>>>>>> 90985c8a1fbbe7aa8b264fbd315093abd93c3d2d:src/modules/Main/components/Performance/Graphics.vue

export default {
  name: 'GraphicsPerformance',
  components: {
    GraphicComponent,
  },
  data() {
    return {
      apyData: {
        type: 'APY',
        token: 'ETH+',
        value: '13.5%',
        date: 'from XX XX. ‘23',
      },
      tvlData: {
        type: 'TVL',
        token: 'ETH+',
        value: '123.631341 WETH',
        date: 'past 2 hours',
      },
    };
  },
};
</script>

<style scoped>
.performance__graphics {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: var(--color-4);
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
