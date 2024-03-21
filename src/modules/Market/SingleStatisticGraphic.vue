<template>
  <GraphicInterval
    :selectedInterval="currentInterval"
    :intervals="['1W', '1M', '3M', '6M', '1Y', 'ALL TIME']"
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
import { mapGetters } from 'vuex';
import GraphicInterval from '@/components/Graphic/GraphicInterval.vue';
import { type Payout } from '@/modules/Market/types/index.ts';
import { Chart, registerables } from 'chart.js';
import { appNetworksData } from '@/utils/const.ts';

const originPointPlugin = {
  id: 'originPointPlugin',
  afterDraw(chart: any) {
    const { ctx } = chart;
    const xAxis = chart.scales.x;
    const yAxis = chart.scales.y;

    const originX = xAxis.left;
    const originY = yAxis.bottom;

    ctx.save();
    ctx.beginPath();
    ctx.arc(originX, originY, 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();
  },
};

const pointStylePlugin = {
  id: 'pointStylePlugin',
  afterDraw(chart: any) {
    const { ctx } = chart;
    const yAxis = chart.scales.y;
    const middleY = (yAxis.top + yAxis.bottom) / 2;
    ctx.save();
    ctx.strokeStyle = '#A8D8FA';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(chart.chartArea.left, middleY);
    ctx.lineTo(chart.chartArea.right, middleY);
    ctx.stroke();
    ctx.restore();
  },
};

Chart.register(...registerables, originPointPlugin, pointStylePlugin);

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
      networksData: appNetworksData,
    };
  },
  computed: {
    ...mapGetters('theme', ['light']),

    activeNetworkData() {
      const network = this.$store.state.network.marketNetwork;
      const data = appNetworksData.find((_) => _.name.toLowerCase() === network.toLowerCase());
      return data || appNetworksData[0];
    },
    displayValue() {
      if (this.type === 'APY') {
        const payoutData = this.graphicData.payouts?.slice(0, this.getInterval());
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
          return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }).format(latestPayout.totalUsdPlus);
        }
      }
      return 'N/A';
    },
    startDateLabel() {
      if (this.type === 'TVL') {
        return 'Past 2 hours';
      }
      const payoutData = this.graphicData.payouts?.slice(0, this.getInterval());
      if (payoutData.length > 0) {
        const lastDate = new Date(payoutData[payoutData.length - 1].payableDate);
        return `from ${lastDate.toLocaleDateString()}`;
      }
      return '';
    },
    chartData() {
      const payoutData = this.graphicData.payouts?.slice(0, this.getInterval());
      const activeNetworkColor = this.activeNetworkData.color;
      payoutData.sort((a: { payableDate: any; }, b: { payableDate: any; }) => new Date(a
        .payableDate).getTime() - new Date(b.payableDate).getTime());

      return {
        chartData: {
          labels: payoutData
            .map((payout: Payout) => new Date(payout.payableDate).toLocaleDateString()),
          datasets: [{
            label: false,
            data: this.type === 'APY' ? payoutData.map((payout: Payout) => payout.annualizedYield) : payoutData
              .map((payout: Payout) => payout.totalUsdPlus),
            fill: false,
            borderColor: activeNetworkColor,
            backgroundColor: activeNetworkColor,
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0,
          }],
        },
      };
    },
    chartOptions() {
      const isApyType = this.type === 'APY';
      const isEth = this.tokenData.tokenName === 'ETH+';

      const intervalData = this.graphicData.payouts?.slice(0, this.getInterval());
      const dataValues = this.type === 'APY'
        ? intervalData.map((payout: Payout) => payout.annualizedYield)
        : intervalData.map((payout: Payout) => payout.totalUsdPlus);

      const minValue = Math.min(...dataValues) * 0.8;
      const maxValue = Math.max(...dataValues) * 1.2;
      const isDarkTheme = localStorage.getItem('theme-type') === 'dark';
      return {
        chartOptions: {
          scales: {
            y: {
              afterFit: (scaleInstance: any) => {
                const widths = {
                  apyType: 53,
                  eth: 76,
                  default: 60,
                };
                let newWidth;
                if (isApyType) {
                  newWidth = widths.apyType;
                } else if (isEth) {
                  newWidth = widths.eth;
                } else {
                  newWidth = widths.default;
                }
                Object.assign(scaleInstance, { width: newWidth });
              },

              beginAtZero: false,
              title: {
                display: true,
              },
              min: minValue,
              max: maxValue,
              ticks: {
                font: {
                  size: 10,
                },
                stepSize: (maxValue - minValue) / 6,
                color: isDarkTheme ? '#ffffff' : '#0f172a',
                min: 4,
                callback: (value: any) => {
                  if (isApyType) {
                    return `${value.toFixed(2)}%`;
                  } if (this.tokenData.tokenName === 'ETH+') {
                    const valueInETHs = `${value.toFixed(0)} WETH `;
                    return valueInETHs;
                  }
                  const valueInMillions = `$${(value / 1e6).toFixed(2)}M`;
                  return valueInMillions;
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
              backgroundColor: '#ffffff',
              titleFont: {
                size: 12,
              },
              titleColor: '#687386',
              bodyFont: {
                size: 12,
                weight: 'bold',
              },
              bodyColor: '#000',
              displayColors: false,
              padding: 10,
              callbacks: {
                label(context: any) {
                  let label = context.dataset.label || '';

                  if (label) {
                    label += ': ';
                  }
                  const value = context.parsed.y;
                  if (isApyType) {
                    label += `APY: ${value.toFixed(2)}%`;
                  } else if (isEth) {
                    const valueInETHs = `TVL WETH ${value.toFixed(6)}`;
                    label += valueInETHs;
                  } else {
                    return `TVL ${new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                    }).format(value)}`;
                  }
                  return label;
                },
                title(context: any) {
                  if (context.length > 0) {
                    const reversedData = [...intervalData].reverse();
                    const pointIndex = context[0].dataIndex;
                    const date = new Date(reversedData[pointIndex].payableDate);
                    const day = date.getUTCDate().toString().padStart(2, '0');
                    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                    const year = date.getUTCFullYear();
                    const hours = date.getUTCHours().toString().padStart(2, '0');
                    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                    const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes} UTS`;
                    return formattedDate;
                  }
                  return '';
                },

              },
            },
            pointStylePlugin: {
              activeNetworkColor: '',
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
        const canvas = this.$refs.myChart as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const { chartData } = this.chartData;
          const { chartOptions } = this.chartOptions;
          chartOptions.plugins = chartOptions.plugins || {};
          chartOptions.plugins.pointStylePlugin = chartOptions.plugins.pointStylePlugin || {};
          chartOptions.plugins.pointStylePlugin.activeNetworkColor = this.activeNetworkData.color;
          this.myChart = new Chart(ctx, {
            type: 'line',
            data: chartData as any,
            options: chartOptions as any,
            plugins: [originPointPlugin, pointStylePlugin],
          }) as any;
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
  width: 97%;
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
  [data-theme="dark"] & {
    background-color: var(--color-7);
    border: none;
  }
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
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.performance__graphic-values :nth-child(2) {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-2);
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

@media (max-width: 1080px) {
  .performance__graphic {
    padding: 0;
  }
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

@media (max-width: 640px) {
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
  .performance__graphic-values p:first-child {
    font-size: 14px;
  }
  .performance__graphic-values p:last-child {
    font-size: 12px;
  }
  .performance__graphic-values {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .performance__graphic-data {
    background: none;
    [data-theme="dark"] & {
      background-color: var(--color-6);
    }
  }
  .performance__graphic {
    margin-top: 2px;
    padding: 0;
    background: none;
    border: none;
  }
  .performance__graphic-display {
    border-radius: 10px;
    background-color: var(--color-8);
    [data-theme="dark"] & {
      background-color: var(--color-7);
    }
  }
  .performance__graphic-title {
    font-size: 14px;
  }
}
</style>
