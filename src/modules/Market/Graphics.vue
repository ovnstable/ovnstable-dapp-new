<template>
  <div class="performance__graphics">
    <div
      class="performance__graphics-APY-graphic"
      v-if="!loaded"
    >
      <div class="graphic__loader">
        <Spinner />
      </div>
    </div>
    <div
      class="performance__graphics-APY-graphic"
      v-else
    >
      <GraphicComponent
        :graphicData=payoutData
        :tokenData="tokenData"
        type='APY'
      />
    </div>
    <div
      class="performance__graphics-TVL-graphic"
      v-if="loaded"
    >
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
import Spinner from '@/components/Spinner/Index.vue';

export default {
  name: 'GraphicsPerformance',
  components: {
    GraphicComponent,
    Spinner,
  },
  props: {
    loaded: {
      type: Boolean,
      default: false,
    },
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
.graphic__loader {
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.performance__graphics {
  min-height: 350px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  background: var(--color-4);
  [data-theme="dark"] & {
    background: var(--color-17);
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
