<template>
  <div class="performance__graphics">
    <div class="performance__graphics-APY-graphic">
      <GraphicComponent
        :graphicData=payoutData
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
  props: {
    payoutData: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    this.calculateComp();
  },
  methods: {
    calculateComp() {
      const startValue = 1;
      let accumulator = startValue;
      this.accumulatorDay = startValue;
      this.accumulatorWeek = startValue;
      this.accumulatorMonth = startValue;
      let counter = this.payoutData.length;
      this.payoutData.reverse().forEach((payout: any) => {
        accumulator *= (1 + payout.dailyProfit);
        payout.comp = (accumulator * 100 / startValue - 100);
        payout.comp = parseFloat(payout.comp ? payout.comp : 0.00).toFixed(3);

        if (counter <= 7) {
          this.accumulatorWeek *= (1 + payout.dailyProfit);
        }

        if (counter <= 30) {
          this.accumulatorMonth *= (1 + payout.dailyProfit);
        }
        if (counter === 1) {
          this.accumulatorDay *= (1 + payout.dailyProfit);
        }
        counter--;
      });
      this.accumulatorDay = (this.accumulatorDay - 1) * 100;
      this.accumulatorWeek = (this.accumulatorWeek - 1) * 100;
      this.accumulatorMonth = (this.accumulatorMonth - 1) * 100;
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
