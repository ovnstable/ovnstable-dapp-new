<template>
  <div class="performance__graphics">
    <div class="performance__graphics-APY-graphic">
      <GraphicComponent
        :graphicData=payoutData
        :tokenData="tokenData"
        type='APY'
      />
    </div>
    <div class="performance__graphics-TVL-graphic">
      <GraphicComponent
        :graphicData=payoutData
        :tokenData="tokenData"
        type='TVL'
      />
    </div>
  </div>
</template>
<script lang="ts">

import GraphicComponent from '@/modules/Market/SingleStatisticGraphic.vue';

export default {
  name: 'GraphicsPerformance',
  components: {
    GraphicComponent,
  },
  props: {
    payoutData: {
      type: Object,
      default: () => ({}),
    },
    tokenData: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
.performance__graphics {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  background: var(--color-4);
  [data-theme="dark"] & {
      background: var(--color-6);
  }

  > .performance__graphics-APY-graphic,
  > .performance__graphics-TVL-graphic {
    flex: 1;
  }
}

@media (max-width: 1024px) {
  .performance__graphics {
    flex-direction: column;
  }
  .performance__graphics-TVL-graphic {
    margin: 0;
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
