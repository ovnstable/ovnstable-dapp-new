<template>
  <div
    v-if="!device.isMobile"
    class="insurance__chains-interval"
  >
    <div>
      <GraphicInterval
        :selectedInterval="currentInterval"
        :intervals="['1W', '1M', '1Y', 'ALL TIME']"
        @update:interval="updateInterval"
      />
    </div>

    <div class="insurance__chain-data-container">
      <div
        v-for="chain in availableChains"
        :key="chain"
        @click="saveNetworkToLocalStore(chain)"
        @keydown.enter="saveNetworkToLocalStore(chain)"
        class="insurance__chain-data"
        :class="{ selected: (chain as any).toLowerCase() === networkName }"
      >
        <BaseIcon
          :name="chain.toLocaleLowerCase()"
          class="insurance__icon-chain-bottom"
        />
        <p class="insurance__chain-data-name">{{ chain }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="insurance__chain-data-container">
      <div
        v-for="chain in availableChains"
        :key="chain"
        @click="saveNetworkToLocalStore(chain)"
        @keydown.enter="saveNetworkToLocalStore(chain)"
        class="insurance__chain-data"
        :class="{ selected: (chain as any).toLowerCase() === networkName }"
      >
        <BaseIcon
          :name="chain.toLocaleLowerCase()"
          class="insurance__icon-chain-bottom"
        />
        <p class="insurance__chain-data-name">{{ chain }}</p>
      </div>
    </div>
    <p class="insurance-cumulitive-text">Cumulitive return</p>
    <div class="insurance-cumulitives">
      <div class="insurance__accumulator-data">
        <p>1 day</p>
        <p>{{ accumulatorDay }}%</p>
      </div>
      <div class="insurance__accumulator-data">
        <p>1 week</p>
        <p>{{ accumulatorWeek }}%</p>
      </div>
      <div class="insurance__accumulator-data">
        <p>1 month</p>
        <p>{{ accumulatorMonth }}%</p>
      </div>
      <div class="insurance__accumulator-data">
        <p>ALL</p>
        <p>{{ parseFloat(graphicData[0].comp) }}%</p>
      </div>
    </div>
    <div>
      <GraphicInterval
        :selectedInterval="currentInterval"
        :intervals="['1W', '1M', '1Y', 'ALL TIME']"
        @update:interval="updateInterval"
      />
    </div>
  </div>

  <div class="insurance__graphic">
    <div
      v-if="!device.isMobile"
      class="insurance__graphic-data"
    >
      <p class="insurance__graphic-title">Cumulative return</p>
      <div class="insurance-cumulitives">
        <div class="insurance__accumulator-data">
          <p>1 day</p>
          <p>{{ accumulatorDay }}%</p>
        </div>
        <div class="insurance__accumulator-data">
          <p>1 week</p>
          <p>{{ accumulatorWeek }}%</p>
        </div>
        <div class="insurance__accumulator-data">
          <p>1 month</p>
          <p>{{ accumulatorMonth }}%</p>
        </div>
        <div class="insurance__accumulator-data">
          <p>ALL</p>
          <p>{{ parseFloat(graphicData[0].comp) }}%</p>
        </div>
      </div>
    </div>

    <div class="insurance__graphic-display">
      <canvas
        ref="myChart"
        :key="'canvas-' + currentInterval"
      />
    </div>
    <div class="insurance__data-under-graphic">
      <div class="insurance__data-initial">
        <p>{{ getInitialValue() }}%</p>
        <p>{{ getInitialDate() }}</p>
      </div>
      <div class="insurance__data-comp-today">
        <p>{{ parseFloat(graphicData[0].comp).toFixed(3) }}%</p>
        <p> for today </p>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import GraphicInterval from '@/components/Graphic/GraphicInterval.vue';
import { Chart, registerables } from 'chart.js';
import { appNetworksData } from '@/utils/const.ts';
import { chainContractsMap } from '@/utils/contractsMap.ts';
import { deviceType } from '@/utils/deviceType.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

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
  name: 'GraphicComponent',
  components: {
    GraphicInterval,
    BaseIcon,
  },
  props: {
    graphicData: {
      type: Object,
      required: true,
    },
    accumulatorDay: {
      type: String,
      required: true,
    },
    accumulatorWeek: {
      type: String,
      required: true,
    },
    accumulatorMonth: {
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
    device() {
      return deviceType();
    },
    networkName() {
      return this.$store.state.network.insuranceNetwork;
    },
    networkScan() {
      return this.$store.state.network.insuranceExplorerURL;
    },
    availableChains() {
      const availableNetworks = Object.entries(chainContractsMap)
        .reduce((acc: string[], [network, contracts]: [string, any]) => {
          if (contracts.token_insurance) {
            acc.push(network.charAt(0).toUpperCase() + network.slice(1));
          }
          return acc;
        }, []);

      return availableNetworks.filter((_) => _ !== 'Optimism');
    },
    activeNetworkData() {
      const network = this.$store.state.network.insuranceNetwork;
      const data = appNetworksData.find((_) => _.name.toLowerCase() === network.toLowerCase());
      return data || appNetworksData[0];
    },
    chartData(): any {
      const payoutData = [...(this.graphicData as any)].slice(0, this.getInterval()).reverse();
      const activeNetworkColor = this.activeNetworkData.color;

      return {
        chartData: {
          labels: payoutData.map((payout) => new Date(payout.date).toLocaleDateString()),
          datasets: [{
            label: false,
            data: payoutData.map((payout) => parseFloat(payout.comp)),
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
      const intervalData = this.graphicData?.slice(0, this.getInterval());
      const dataValues = intervalData.map((payout: any) => parseFloat(payout.comp));

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
                  label += `Performance: ${value.toLocaleString()}%`;
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

  mounted() {
    this.initChart();
    this.saveNetworkToLocalStore('Arbitrum');
  },
  methods: {
    saveNetworkToLocalStore(chain:string) {
      this.$store.dispatch('network/changeInsuranceNetwork', chain.toLowerCase());
    },
    getInitialValue() {
      const intervalData = this.graphicData?.slice(0, this.getInterval());
      const dataValues = intervalData.map((payout: any) => parseFloat(payout.comp));
      const minValue = Math.min(...dataValues);
      return minValue.toFixed(2);
    },
    getInitialDate() {
      const intervalData = this.graphicData?.slice(0, this.getInterval()).reverse();
      const date = new Date(intervalData[0].date);
      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = date.getUTCFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      return formattedDate;
    },
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
          sliceEnd = this.graphicData.length;
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
  width: 97%;
  min-height: 150px;
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
    border: none;
  }
}

.insurance__chain-data-container .selected {
  background: var(--color-4);
  color: var(--color-3);
  border-color: var(--color-6);
  svg {
    opacity: 1;
    filter: unset;
  }
  [data-theme="dark"] & {
    p {
      color: var(--color-4);
    }
    border-color: var(--color-2);
    background: var(--color-17);
  }
}
.insurance__chain-data-container {
  display: flex;
  flex-direction: row;
  vertical-align: center;
  transition: background 0.3s ease, border 0.3s ease;
  svg {
    overflow: auto;
    width: 24px;
    height: 24px;
    filter: grayscale(10);
    opacity: .5;
  }
}

.insurance__chain-data-container > *:not(:last-child) {
  margin-right: 7px;
}

.insurance__chain-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 30px;
  border: 1px solid var(--color-5);
  padding: 5px 10px;
  width: fit-content;
  background-color: none;
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
   border-color: var(--color-7);
   background: var(--color-7);
  }
}
.insurance__icon-chain-bottom {
   overflow: visible;
  flex-shrink: 0
}

.insurance__chain-data-name {
  margin-left: 8px;
  font-weight: 500;
  font-size: 13px;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.insurance__chain-data:hover {
  cursor: pointer;
  border: 1px solid var(--color-7);
  background: var(--color-6);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
    background: var(--color-2);
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

.insurance__data-comp-today {
  text-align: right;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.insurance__data-initial :nth-child(1),
.insurance__data-comp-today :nth-child(1){
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
  .insurance__chain-data {
    padding: 2px 6px;
  }
  .insurance__graphic-title {
    font-size: 12px;
    margin-left: 10px;
    margin-right: 10px;
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
@media (max-width: 640px) {
  .insurance__chains-interval {
    flex-direction: column;
  }
  .insurance__chain-data {
    width: 36px;
    height: 36px;
  }
  .insurance__chain-data-container {
    margin: 0;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .insurance__chain-data-name {
    display: none;
  }
  .insurance-cumulitive-text {
    margin-bottom: 10px;
    color: var(--color-1);
    font-size: 14px;
    font-weight: 500;
  }
  .insurance-cumulitives {
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .insurance__accumulator-data p:first-child {
    font-size: 12px;
  }
  .insurance__accumulator-data p:last-child,
  .insurance__data-under-graphic p {
    font-size: 14px;
  }
  .insurance__graphic{
    padding: 20px 14px;
  }
  .insurance__graphic-display {
    width: 100%;
  }
  .insurance__data-under-graphic {
    margin-bottom: 0;
    margin-top: 6px;
  }
}

@media (max-width: 340px) {
  .insurance-cumulitives {
    flex-wrap: wrap;
  }
}

</style>
