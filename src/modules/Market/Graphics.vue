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
  data() {
    return {
      apyData: {
        type: 'APY',
        token: 'ETH+',
        value: '13.5%',
        date: 'from XX.XX.23',
        labels: ['01.02', '02.02', '03.02', '04.02', '05.02', '06.02', '07.02', '08.02', '09.02'],
        data: [10, 11, 12, 13, 16, 18, 22, 20, 30],
        label: 'APY',
      },
      tvlData: {
        type: 'APY', // or 'TVL'
        token: 'ETH+', // The token name
        value: '13.5%', // The current value
        date: 'from XX.XX.23', // The current date
        labels: ['January', 'February', 'March'], // Labels for the x-axis
        data: [10, 20, 30], // Data points for the y-axis
        label: 'TVL',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.performance__graphics {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: var(--color-4);
  [data-theme="dark"] & {
      background: var(--color-6);
  }
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
