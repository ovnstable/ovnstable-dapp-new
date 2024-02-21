<template>
  <div class="insurance__graphic">
    <div class="insurance__graphic-display">
      <canvas
        ref="myChart"
        :key="'canvas-' + getDashboardInterval"
      />
    </div>

  </div>
</template>

<script lang="ts">
import { Chart, registerables } from 'chart.js';
import { appNetworksData } from '@/utils/const.ts';
import { chainContractsMap } from '@/utils/contractsMap.ts';

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
    ctx.fillStyle = '#687386';
    ctx.fill();
    ctx.restore();
  },
};

Chart.register(...registerables, originPointPlugin);

export default {
  name: 'DashboardSingleGraphic',
  props: {
    portfolioBalanceData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentInterval: 'DAY',
      myChart: null,
      networksData: appNetworksData,
    };
  },
  watch: {
    // Watch for changes in getDashboardInterval computed property
    getDashboardInterval(newInterval) {
      this.currentInterval = newInterval;
      // Next, re-initialize the chart
      this.$nextTick(() => {
        if (this.myChart) {
          this.myChart.destroy(); // Destroy the existing chart instance before creating a new one
        }
        this.initChart(); // Call initChart to create a new chart with the updated interval
      });
    },
  },
  computed: {
    getDashboardInterval() {
      return this.$store.state.intervalDashboard.intervalDashboard;
    },
    activeNetworkData() {
      const network = this.$store.state.network.dashboardNetwork;
      const data = appNetworksData.find((_) => _.name.toLowerCase() === network.toLowerCase());
      return data || appNetworksData[0];
    },
    chartData(): any {
      console.log(`this is inteval from store ${this.getInterval()}`)
      const balancesData = [...(this.portfolioBalanceData as any)].slice(0, this.getInterval()).reverse();
      const activeNetworkColor = this.activeNetworkData.color;

      return {
        chartData: {
          labels: balancesData.map((trx) => new Date(trx.date).toLocaleDateString()),
          datasets: [{
            label: false,
            data: balancesData.map((trx) => parseFloat(trx.closing_balance)),
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
      const intervalData = this.portfolioBalanceData?.slice(0, this.getInterval());
      const dataValues = intervalData.map((trx: any) => parseFloat(trx.closing_balance));

      const minValue = Math.min(...dataValues);
      const maxValue = Math.max(...dataValues);
      return {
        chartOptions: {
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
              },
              min: minValue,
              max: maxValue,
              ticks: {
                display: false,
              },
              border: {
                color: '#687386',
              },
              grid: {
                display: false,
              },
            },
            x: {
              border: {
                color: '#687386',
              },
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
                  label += `Portfolio value: $${value.toLocaleString()}`;
                  return label;
                },
                title(context: any) {
                  if (context.length > 0) {
                    const reversedData = [...intervalData].reverse();
                    const pointIndex = context[0].dataIndex;
                    const date = new Date(reversedData[pointIndex].date);
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
    getInterval() {
      const intervalMapping = {
      'day': 2,
      'week': 7,
      'month': 30,
      }
      const interval = this.getDashboardInterval;
      const sliceAmount = intervalMapping[interval.toLowerCase()] || this.portfolioBalanceData.length;
      return sliceAmount;
    },
    initChart() {
      if (this.$refs.myChart) {
        const canvas = this.$refs.myChart as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const { chartData } = this.chartData;
          const { chartOptions } = this.chartOptions;
          chartOptions.plugins = chartOptions.plugins || {};
          this.myChart = new Chart(ctx, {
            type: 'line',
            data: chartData as any,
            options: chartOptions as any,
            plugins: [originPointPlugin],
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
.insurance__chains-interval {
  min-height: 34px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.insurance__graphic-display {
  width: 100%;
  min-height: 250px;
}
.insurance__graphic{
  min-height: 250px;
  background-color: var(--color-8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 5px;
  padding-top: 20px;
  padding-bottom: 5px;
  padding-left: 30px;
  padding-right: 32px;
  border: 1px solid var(--color-8);
  width: 100%;
  box-sizing: border-box;
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}

.insurance__chain-data-container .selected {
  background: var(--color-4);
  cursor: default;
  [data-theme="dark"] & {
    background: var(--color-2);
  }
}
.insurance__chain-data-container {
  display: flex;
  flex-direction: row;
  vertical-align: center;
}

.insurance__chain-data-container > *:not(:last-child) {
  margin-right: 7px;
}

.insurance__chain-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 30px;
  border: 1px solid var(--color-6);
  background: var(--color-5);
  padding: 5px 10px;
  width: fit-content;
  transition: background 0.3s ease, border 0.3s ease;
}
.insurance__icon-chain-bottom {
  flex-shrink: 0
}

.insurance__chain-data-name {
  margin-left: 8px;
  font-weight: 500;
  font-size: 13px;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__chain-data:hover {
  cursor: pointer;
  border: 1px solid var(--color-7);
  background: var(--color-6);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
    background: var(--color-7);
  }
}

.selected:hover {
  cursor: default;
  border: 1px solid var(--color-7);
  background: var(--color-4);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
    background: var(--color-7);
  }
}
.insurance__graphic-data {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  flex-grow: 1;
}
.insurance__graphic-data-text {
  margin-left: 167px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.insurance__graphic-title {
  margin-left: 40px;
  color: var(--color-1);
  font-size: 15px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.insurance__graphic-value {
  color: var(--color-1);
  font-size: 20px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.insurance__graphic-date {
  color: var(--color-1);
  font-size: 12px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.insurance-cumulitives {
  display: flex;
  flex-direction: row;
  gap: 16px;
  p {
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}
.insurance__accumulator-data {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  align-items: center;
}

.insurance__accumulator-data :nth-child(1) {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-1);
  margin-bottom: 4px;
}

.insurance__accumulator-data :nth-child(2) {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-1);
}

.insurance__accumulator-data:not(:last-child) {
  margin-right: 16px;
}

.insurance__data-under-graphic {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  margin-top: 12px;
  margin-bottom: 6px;
  font-size: 15px;
  font-weight: 500;
}

.insurance__data-initial {
  margin-left: 26px;
  text-align: left;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.insurance__data-closing_balance-today {
  text-align: right;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.insurance__data-initial :nth-child(1),
.insurance__data-closing_balance-today :nth-child(1){
  margin-bottom: 4px;
}

@media (max-width: 1024px) {
  .insurance__graphic-display {
    width: 100%;
    min-height: 150px;
  }
.insurance__graphic{
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

  .insurance__graphic-data-text {
    margin-left: 50px;
  }
}

@media (max-width: 768px) {
  .insurance__graphic-value {
      font-size: 16px;
  }
  .insurance__graphic-title {
      font-size: 12px;
  }
  .insurance__graphics-buttons-interval > * {
      font-size: 10px;
  }
  .insurance__graphic-date {
        font-size: 10px;
  }
  .insurance__graphic{
      padding: 15px 30px;
  }
}
@media (max-width: 576px) {
  .insurance__graphic-value {
      font-size: 14px;
  }
  .insurance__graphic-title {
      font-size: 10px;
  }
  .insurance__graphics-buttons-interval > * {
      font-size: 8px;
  }
  .insurance__graphic-date {
        font-size: 8px;
  }
  .insurance__graphic{
      padding: 10px 20px;
  }
}
</style>
