<template>
  <div class="performance__graphics">
    <p>{{ payoutData }}</p>
    <div class="performance__graphics-APY-graphic">
      <!-- <GraphicComponent
        :graphicData=payoutData
        type='APY'
      /> -->
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
  },
  mounted() {
    this.calculateComp();
  },
  methods: {
    calculateComp() {
      let startValue = 1;
      let accumulator = startValue;
      this.payoutData.reverse().forEach((payout: any) => {
        accumulator *= (1 + payout.dailyProfit);
        console.log('accamulator after', accumulator);
        payout.comp = (accumulator * 100 / startValue - 100);
        payout.comp = parseFloat(payout.comp ? payout.comp : 0.00).toFixed(3);
      });
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
