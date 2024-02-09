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
      <div class="performance__graphic-values">
        <p>{{ displayValue }}</p>
        <p>{{ startDateLabel }}</p>
      </div>
    </div>

    <div class="performance__graphic-display">
      <canvas
        ref="myChart"
        :key="'canvas-' + currentInterval"
      />
    </div>
  </div>
</template>

<script lang="ts">
import GraphicInterval from '@/modules/Market/GraphicInterval.vue';
import { type Payout } from '@/modules/Market/types/index.ts';
import { Chart, registerables } from 'chart.js';

const originPointPlugin = {
  id: 'originPointPlugin',
  afterDraw(chart: any) {
    const { ctx } = chart;
    const xAxis = chart.scales.x;
    const yAxis = chart.scales.y;

    const originX = xAxis.getPixelForValue(0);
    const originY = yAxis.getPixelForValue(0);

    ctx.save();
    ctx.beginPath();
    ctx.arc(originX, originY, 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();
  },
};

Chart.register(...registerables, originPointPlugin);

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
    displayValue() {
      if (this.type === 'APY') {
        const payoutData = this.graphicData.payouts.slice(0, this.getInterval());
        const sumYield = payoutData
          .reduce((acc: any, payout: Payout) => acc + payout.annualizedYield, 0);
        const avgYield = (sumYield / payoutData.length) || 0;
        return `${avgYield.toFixed(2)}%`;
      } if (this.type === 'TVL') {
        const latestPayout = this.graphicData.payouts[0];
        if (latestPayout) {
          if (this.tokenData.tokenName === 'ETH+') {
            return `${latestPayout.totalUsdPlus.toFixed(6)} WETH`;
          }
          return `$${latestPayout.totalUsdPlus.toFixed(2)}`;
        }
      }
      return 'N/A';
    },

    startDateLabel() {
      if (this.type === 'TVL') {
        return 'Past 2 hours';
      }
      const payoutData = this.graphicData.payouts.slice(0, this.getInterval());
      if (payoutData.length > 0) {
        const lastDate = new Date(payoutData[payoutData.length - 1].payableDate);
        return `from ${lastDate.toLocaleDateString()}`;
      }
      return '';
    },
    chartData() {
      const payoutData = this.graphicData.payouts.slice(0, this.getInterval());
      payoutData.sort((a: { payableDate: any; }, b: { payableDate: any; }) =>
        new Date(a.payableDate) - new Date(b.payableDate));

      return {
        labels: payoutData
          .map((payout: Payout) => new Date(payout.payableDate).toLocaleDateString()),
        datasets: [{
          label: false,
          data: this.type === 'APY' ? payoutData.map((payout: Payout) => payout.annualizedYield) : payoutData
            .map((payout: Payout) => payout.totalUsdPlus),
          fill: false,
          borderColor: '#ff1100',
          backgroundColor: 'rgb(255, 99, 132)',
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0,
        }],
      };
    },
    chartOptions() {
      const isApyType = this.type === 'APY';
      return {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
            },
            ticks: {
              callback: (value: number) => {
                if (isApyType) {
                  return `${value.toFixed(1)}%`;
                } if (this.tokenData.tokenName === 'ETH+') {
                  return `${value.toLocaleString()} WETH`;
                } return `${value.toLocaleString()}\nUSD`;
              },
            },
            grid: {
              display: false,
            },
          },
          x: {
            ticks: {
              display: false,
            },
            title: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
            plugins: [originPointPlugin],
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
  width: 100%;
  min-height: 250px;
}
.performance__graphic{
  min-height: 250px;
  background-color: var(--color-8);
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid var(--color-8);
  margin-top: 5px;
}

.performance__graphic-data {
  margin-top: 10px;
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

.performance__graphic-values {
  p {
    text-align: right;
  }
}

.performance__graphic-values :nth-child(1) {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-1);
}

.performance__graphic-values :nth-child(2) {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-2);
}
@media (max-width: 1024px) {
  .performance__graphic-display {
    width: 100%;
    min-height: 150px;
  }
.performance__graphic{
  min-height: 150px;
  background-color: var(--color-8);
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid var(--color-8);
  margin-top: 5px;
}

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
