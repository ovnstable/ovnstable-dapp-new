<template>
  <GraphicInterval
    :selectedInterval="currentInterval"
    :intervals="['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL TIME']"
    @update:interval="updateInterval"
  />
  <div class="performance__graphic">
    <div class="performance__graphic-data">
      <p class="performance__graphic-title">
        {{ graphicData.type === 'APY' ? `Average ${graphicData.token} APY` : `${graphicData.token} TVL` }}
      </p>
      <div class="performance__graphic-data-text">
        <p class="performance__graphic-value">{{ graphicData.value }}</p>
        <p class="performance__graphic-date">{{ graphicData.date }}</p> <!-- I assume this should be graphicData.date -->
      </div>
    </div>
    <div class="performance__graphic-display">
      <canvas ref="myChart" />
    </div>
  </div>
</template>

<script lang="ts">
import GraphicInterval from '@/modules/Market/GraphicInterval.vue';
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
  },
  data() {
    return {
      currentInterval: '1D',
      myChart: null, // Store the chart instance
    };
  },
  methods: {
    updateInterval(newInterval) {
      this.currentInterval = newInterval;
      // Update the chart data here when the interval changes
      // You will need to fetch new data and update the chart accordingly
    },
    initChart() {
      const ctx = this.$refs.myChart.getContext('2d');
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          // You should update these values with your actual data
          labels: this.graphicData.labels,
          datasets: [{
            label: this.graphicData.label,
            data: this.graphicData.data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  mounted() {
    this.initChart();
  },
  watch: {
    graphicData: {
      handler(newData, oldData) {
        if (newData !== oldData) {
          this.myChart.data.labels = newData.labels;
          this.myChart.data.datasets.forEach((dataset) => {
            dataset.data = newData.data;
          });
          this.myChart.update();
        }
      },
      deep: true,
    },
    currentInterval(newInterval, oldInterval) {
      if (newInterval !== oldInterval) {
        // Logic to update chart based on new interval
        // e.g., fetch new data and update the chart
      }
    },
  },
};
</script>


<style lang="scss" scoped>
.performance__graphic{
  display: flex;
  flex-direction: column;
  padding: 22px 39px;
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
