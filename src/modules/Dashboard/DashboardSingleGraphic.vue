<template>
  <p class="dashboard__graphic-usd-plus-balance">
    {{ onlyUSD ? 'USD+ Balance' : 'AVERAGE TOKENS+ BALANCE' }}
    <span class="period">
      <span class="divider">| </span>{{ formattedPeriod() }}
    </span>
  </p>

  <div
    v-if="!isInitialValueZero"
    class="dashboard__graphic"
  >
    <div class="dashboard__graphic-display">
      <canvas
        ref="myChart"
        :key="'canvas-' + getDashboardInterval"
      />
    </div>
    <div class="dashboard__data-under-graphic">
      <div class="dashboard__data-initial">
        <p>{{getInitialValue()}}$</p>
        <p>{{getDate(true)}}</p>
      </div>
      <div class="dashboard__data-comp-today">
        <p>${{getLastValue()}}</p>
        <p> {{getDate(false)}} </p>
      </div>
    </div>
  </div>
  <div
    v-else
    class="no-graphic"
  >
    <NoGraphic
      :portfolioBalanceData="portfolioBalanceData"
      :graphicInterval="getDashboardInterval"
    /></div>
</template>

<script lang="ts">
import { Chart, registerables } from 'chart.js';
import { appNetworksData } from '@/utils/const.ts';
import NoGraphic from '@/modules/Dashboard/NoGraphic.vue';

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
  components: {
    NoGraphic,
  },
  props: {
    portfolioBalanceData: {
      type: Object,
      required: true,
    },
    onlyUSD: {
      type: Boolean,
      default: false,
    },
    portfolioPrices: {
      type: Object,
      default: () => ({}),
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
    getDashboardInterval(newInterval) {
      this.currentInterval = newInterval;
      this.$nextTick(() => {
        this.initChart();
      });
    },
  },
  computed: {
    isInitialValueZero() {
      return this.getInitialValue() === 0;
    },
    getDashboardInterval() {
      return this.$store.state.intervalDashboard.intervalDashboard;
    },
    activeNetworkData() {
      const network = this.$store.state.network.dashboardNetwork;
      const data = appNetworksData.find((_) => _.name.toLowerCase() === network.toLowerCase());
      return data || appNetworksData[0];
    },

    chartData(): any {
      const balancesData = this.processTransactions();

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
      const intervalData = this.processTransactions();
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
                  label += `Portfolio value: $${value.toFixed(4)}`;
                  return label;
                },
                title(context: any) {
                  if (context.length > 0) {
                    const reversedData = [...intervalData];
                    const pointIndex = context[0].dataIndex;
                    const date = new Date(reversedData[pointIndex].date);
                    const day = date.getUTCDate().toString().padStart(2, '0');
                    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                    const year = date.getUTCFullYear();
                    const hours = date.getUTCHours().toString().padStart(2, '0');
                    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                    const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes} UTC`;
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
    processTransactions() {
      const sortedTransactions = [...this.portfolioBalanceData as any]
        .filter((transaction) => transaction.type === 'PAYOUT')
        .sort((a, b) => (new Date(b.date) as any) - (new Date(a.date) as any));
      let balancesData;
      if (this.onlyUSD) {
        balancesData = [...(this.portfolioBalanceData as any)]
          .slice(0, this.getInterval()).reverse();
      } else {
        const groupedByDate = sortedTransactions.reduce((acc, trx) => {
          const dateOnly = trx.date.split('T')[0];
          const closingBalance = Number(trx.closing_balance);
          const newAcc = { ...acc };
          if (!newAcc[dateOnly]) {
            newAcc[dateOnly] = {
              date: dateOnly,
              closing_balance: closingBalance,
            };
          } else {
            newAcc[dateOnly].closing_balance += closingBalance;
          }

          return newAcc;
        }, {});

        const updatedGroup = Object.values(groupedByDate);

        balancesData = [...(updatedGroup as any)]
          .slice(0, this.getInterval()).reverse();
      }

      return balancesData;
    },
    getInitialValue() {
      const intervalData = this.processTransactions();
      const dataValues = intervalData.map((trx: any) => parseFloat(trx.closing_balance));
      const areAllZeros = dataValues.every((value) => value === 0);

      return areAllZeros ? 0 : dataValues[0].toFixed(4);
    },
    getLastValue() {
      const sortedTransactions = [...this.portfolioBalanceData as any]
        .filter((transaction) => transaction.type === 'PAYOUT')
        .sort((a, b) => (new Date(b.date) as any) - (new Date(a.date) as any));
      let intervalData;
      if (this.onlyUSD) {
        intervalData = this.portfolioBalanceData?.slice(0, this.getInterval());
      } else {
        const groupedByDate = sortedTransactions.reduce((acc, trx) => {
          const dateOnly = trx.date.split('T')[0];
          const closingBalance = Number(trx.closing_balance);
          const newAcc = { ...acc };
          if (!newAcc[dateOnly]) {
            newAcc[dateOnly] = {
              date: dateOnly,
              closing_balance: closingBalance,
            };
          } else {
            newAcc[dateOnly].closing_balance += closingBalance;
          }

          return newAcc;
        }, {});
        const updatedGroup = Object.values(groupedByDate);

        intervalData = updatedGroup?.slice(0, this.getInterval());
      }
      return (intervalData[0].closing_balance).toFixed(4);
    },
    getDate(initial: boolean) {
      let date = new Date();
      if (initial) {
        const intervalData = this.portfolioBalanceData?.slice(0, this.getInterval()).reverse();
        date = new Date(intervalData[0].date);
      } else {
        date = new Date(this.portfolioBalanceData[0]?.date);
      }
      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = date.getUTCFullYear();
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes} UTC`;
      return formattedDate;
    },
    formattedPeriod() {
      const today = new Date();
      let formattedDate = '';
      switch (this.getDashboardInterval.toLowerCase()) {
        case 'day': {
          formattedDate = today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }).replace(',', '').replace(/ /g, ' ');
          break;
        }
        case 'week': {
          const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
          formattedDate = weekAgo.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }).replace(',', '').replace(/ /g, ' ');
          break;
        }
        case 'month': {
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          formattedDate = monthAgo.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }).replace(',', '').replace(/ /g, ' ');
          break;
        }
        case 'all time':
          if (this.portfolioBalanceData && this.portfolioBalanceData.length > 0) {
            const earliestTransaction = this
              .portfolioBalanceData[this.portfolioBalanceData.length - 1];
            const earliestDate = new Date(earliestTransaction.date);
            formattedDate = earliestDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            }).replace(',', '').replace(/ /g, ' ');
          }
          break;
        default: {
          formattedDate = today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }).replace(',', '').replace(/ /g, ' ');
        }
      }

      const formattedDateParts = formattedDate.split(' ');
      if (formattedDateParts.length === 3) {
        formattedDate = `From ${formattedDateParts[0]} ${formattedDateParts[1]} ‘${formattedDateParts[2]}`;
      }

      return formattedDate || '';
    },
    getInterval() {
      const intervalMapping = {
        day: 2,
        week: 7,
        month: 30,
      };
      const interval = this.getDashboardInterval;
      const key = interval.toLowerCase();
      const sliceAmount = key in intervalMapping ? intervalMapping[key as keyof typeof
        intervalMapping] : this.portfolioBalanceData.length;

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
.dashboard__graphic-display {
  width: 100%;
  min-height: 250px;
}
.dashboard__graphic-usd-plus-balance {
  margin-bottom: 16px;
  font-size: 17px;
  font-weight: 500;
  color: var(--color-1);
  span.period {
    font-size: 15px;
    color: var(--color-2);
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
  span.divider {
    margin-left: 20px;
    margin-right: 20px;
  }
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.dashboard__graphic{
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

.dashboard__data-comp-today :nth-child(1) {
  margin-bottom: 4px;
}
.dashboard__data-comp-today p {
  [data-theme="dark"] & {
    color: var(--color-18);
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
.dashboard__graphic-data {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  flex-grow: 1;
}
.dashboard__graphic-data-text {
  margin-left: 167px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.dashboard__graphic-title {
  margin-left: 40px;
  color: var(--color-1);
  font-size: 15px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.dashboard__graphic-value {
  color: var(--color-1);
  font-size: 20px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.dashboard__graphic-date {
  color: var(--color-1);
  font-size: 12px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.dashboard__data-under-graphic {
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

.dashboard__data-initial {
  margin-left: 26px;
  text-align: left;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.dashboard__data-initial :nth-child(1){
  margin-bottom: 4px;
}

@media (max-width: 1024px) {
  .dashboard__graphic-display {
    width: 100%;
    min-height: 150px;
  }
.dashboard__graphic{
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

  .dashboard__graphic-data-text {
    margin-left: 50px;
  }
}

@media (max-width: 768px) {
  .dashboard__graphic-value {
    font-size: 16px;
  }
  .dashboard__graphic-title {
    font-size: 12px;
  }
  .dashboard__graphics-buttons-interval > * {
    font-size: 10px;
  }
  .dashboard__graphic-date {
    font-size: 10px;
  }
  .dashboard__graphic{
    padding: 15px 30px;
  }
}
@media (max-width: 576px) {
  .dashboard__graphic-value {
      font-size: 14px;
  }
  .dashboard__graphic-title {
      font-size: 10px;
  }
  .dashboard__graphics-buttons-interval > * {
      font-size: 8px;
  }
  .dashboard__graphic-date {
        font-size: 8px;
  }
  .dashboard__graphic{
      padding: 10px 20px;
  }
}
</style>
