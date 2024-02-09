<template>
  <GraphicInterval
    :selectedInterval="currentInterval"
    :intervals="['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL TIME']"
    @update:interval="updateInterval"
  />
  <div class="performance__graphic">
    <div class="performance__graphic-data">
      <p class="performance__graphic-title">
        {{ type === 'APY' ? `Average ${tokenData.tokenName} APY` : `${tokenData.tokenName} TVL` }}
      </p>
    </div>
    <div class="performance__graphic-display">
      <canvas ref="myChart" :key="'canvas-' + currentInterval" />
    </div>
  </div>
</template>

<script lang="ts">
import GraphicInterval from '@/modules/Market/GraphicInterval.vue';
import { type Payout } from '@/modules/Market/types/index.ts';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'GraphicComponent',
  components: {
    GraphicInterval,
  },
  props: {
    graphicData: {
      type: Object,
      required: true,
    },
    tokenData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentInterval: '1W',
      myChart: null,
    };
  },
  computed: {
    averageYield() {
      const payoutData = this.graphicData.payouts.slice(0, this.getInterval());
      const sumYield = payoutData
        .reduce((acc: any, payout: Payout) => acc + payout.annualizedYield, 0);
      const avgYield = (sumYield / payoutData.length) || 0;
      return avgYield.toFixed(2);
    },
    startDateLabel() {
      const payoutData = this.graphicData.payouts.slice(0, this.getInterval());
      if (payoutData.length > 0) {
        const lastDate = new Date(payoutData[payoutData.length - 1].payableDate);
        return `from ${lastDate.toLocaleDateString()}`;
      }
      return '';
    },
    chartData() {
      const payoutData = this.graphicData.payouts.slice(0, this.getInterval());

      return {
        labels: payoutData
          .map((payout: Payout) => new Date(payout.payableDate).toLocaleDateString()),
        datasets: [{
          label: false,
          data: payoutData.map((payout:Payout) => payout.annualizedYield),
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.5,
        }],
      };
    },
    chartOptions() {
      return {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
            },
          },
          x: {
            ticks: {
              display: false,
            },
            title: {
              display: false,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: `${this.averageYield}%\n${this.startDateLabel}`,
            position: 'top',
            align: 'end',
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 0,
          },
        },
      };
    },
  },

  methods: {
    updateInterval(newInterval: string) {
      this.currentInterval = newInterval;
      this.$nextTick(() => {
        if (this.$refs.myChart) {
          this.initChart();
        } else {
          console.error('Canvas element is not available.');
        }
      });
    },

    getInterval() {
      let sliceEnd;
      switch (this.currentInterval) {
        case '1D':
          sliceEnd = 1;
          break;
        case '1W':
          sliceEnd = 7;
          break;
        case '1M':
          sliceEnd = 30;
          break;
        case '3M':
          sliceEnd = 90;
          break;
        case '6M':
          sliceEnd = 180;
          break;
        case '1Y':
          sliceEnd = 365;
          break;
        case 'ALL TIME':
          sliceEnd = this.graphicData.payouts.length;
          break;
        default:
          sliceEnd = 7;
          break;
      }
      return sliceEnd;
    },

    initChart() {
      if (this.$refs.myChart) {
        const ctx = this.$refs.myChart.getContext('2d');
        if (ctx) {
          const chartData = this.chartData;
          const chartOptions = this.chartOptions;

          this.myChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions,
          });
        } else {
          console.error('Failed to get canvas context.');
        }
      } else {
        console.error('Canvas element is not available for chart initialization.');
      }
    },
  },

  mounted() {
    this.initChart();
  },
};
</script>

<style lang="scss" scoped>
.performance__graphic-display {
  height: 300px;
}
.performance__graphic{
  height: 300px;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid var(--color-1);
  margin-top: 5px;
}

.performance__graphic-data {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  flex-grow: 1;
}
.performance__graphic-data-text {
  margin-left: 167px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.performance__graphic-title {
  color: var(--color-1);
  font-size: 15px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.performance__graphic-value {
  color: var(--color-1);
  font-size: 20px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.performance__graphic-date {
  color: var(--color-1);
  font-size: 12px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

@media (max-width: 1250px) {
  .performance__graphic-data-text {
    margin-left: 50px;
  }
}

@media (max-width: 768px) {
  .performance__graphic-value {
      font-size: 16px;
  }
  .performance__graphic-title {
      font-size: 12px;
  }
  .performance__graphics-buttons-interval > * {
      font-size: 10px;
  }
  .performance__graphic-date {
        font-size: 10px;
  }
  .performance__graphic{
      padding: 15px 30px;
  }
}
@media (max-width: 576px) {
  .performance__graphic-value {
      font-size: 14px;
  }
  .performance__graphic-title {
      font-size: 10px;
  }
  .performance__graphics-buttons-interval > * {
      font-size: 8px;
  }
  .performance__graphic-date {
        font-size: 8px;
  }
  .performance__graphic{
      padding: 10px 20px;
  }
}
</style>
