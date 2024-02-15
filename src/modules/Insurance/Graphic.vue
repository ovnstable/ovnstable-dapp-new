<template>
  <div class="performance__graphics">
    <div class="performance__graphics-APY-graphic">
      <GraphicComponent
        :graphicData="reversedPayoutData"
        :accumulatorDay="payoutData.accumulatorDay"
        :accumulatorWeek="payoutData.accumulatorWeek"
        :accumulatorMonth="payoutData.accumulatorMonth"
      />
    </div>
  </div>
</template>
<script lang="ts">

import GraphicComponent from '@/modules/Insurance/SingleStatisticGraphic.vue';

export default {
  name: 'GraphicsPerformance',
  components: {
    GraphicComponent,
  },
  data() {
    return {
      accumulatorDay: 0,
      accumulatorWeek: 0,
      accumulatorMonth: 0,
    };
  },
  computed: {
    reversedPayoutData() {
      return [...this.payoutData.payouts].reverse();
    },
  },
  props: {
    payoutData: {
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
