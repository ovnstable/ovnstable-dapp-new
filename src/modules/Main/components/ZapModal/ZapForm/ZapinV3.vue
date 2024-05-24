<template>
  <div class="zapin-v3">
    <h2>
      Set price range
    </h2>

    <div class="zapin-v3__chart">
      <h3>
        Current Price:  1.000  USDC per USD+
      </h3>
      <apexchart
        width="500"
        type="area"
        :options="optionsChart"
        :series="optionsChart.series"
      />
    </div>

    <div class="zapin-v3__row">
      <div class="zapin-v3__row-block">
        <h3>
          Min price
        </h3>
        <InputComponent
          :value="minPrice"
          input-type="white"
          placeholder="0"
          full-width
          is-center
          @input="setMaxPrice"
        />
        <p>
          USDC per USD+
        </p>
      </div>
      <div class="zapin-v3__row-block">
        <h3>
          Max price
        </h3>
        <InputComponent
          :value="maxPrice"
          input-type="white"
          placeholder="0"
          full-width
          is-center
          @input="setMinPrice"
        />
        <p>
          USDC per USD+
        </p>
      </div>
    </div>

    <div>
      <h2>
        Range pre-sets:
      </h2>
      <div class="range-presets">
        <div
          v-for="range in rangePresets"
          :key="range.id"
          class="range-presets__item"
          :class="currentRange && currentRange === range.value ? 'range-presets__item--selected' : ''"
          @click="setRange(range.value)"
          @keydown="setRange(range.value)"
        >
          {{ range.value === 100 ? "FULL" : `${range.value}%` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import InputComponent from '@/components/Input/Index.vue';
// import ButtonComponent from '@/components/Button/Index.vue';
// import BaseIcon from '@/components/Icon/BaseIcon.vue';

const dataRender = [
  [9, 0],
  [9.1, 0],
  [9.2, 0],
  [9.3, 2],
  [9.5, 4],
  [9.6, 2],
  [9.7, 0],
  [9.8, 0],
  [9.9, 0],
  [10, 0],
];

console.log(dataRender, '___dataRender');

export default {
  name: 'ZapinV3',
  components: {
    InputComponent,
  },
  data() {
    return {
      minPrice: '0',
      maxPrice: '0',
      currentRange: null as null | number,
      rangePresets: [
        {
          id: 0, value: 0.1,
        },
        {
          id: 1, value: 0.5,
        },
        {
          id: 2, value: 1,
        },
        {
          id: 3, value: 2,
        },
        {
          id: 4, value: 4,
        },
        {
          id: 5, value: 100,
        },
      ],
      optionsChart: {
        annotations: {
          xaxis: [
            {
              x: 9.5,
              borderColor: '#0497EC',
              borderWidth: 2,
              label: {
                borderColor: '#0497EC',
                orientation: 'horizontal',
              },
            },
          ],
        },
        chart: {
          id: 'chart1',
          height: 130,
          type: 'bar',
          foreColor: '#ccc',
          brush: {
            target: 'chart2',
            enabled: true,
          },
          fill: {
            opacity: 0.2,
          },
          selection: {
            enabled: true,
            fill: {
              color: '#fff',
              opacity: 0.4,
            },
            stroke: {
              width: 3,
              color: '#0497EC',
              opacity: 1,
            },
            xaxis: {
              min: 9.4,
              max: 9.6,
            },
          },
        },
        fill: {
          opacity: 0.9,
          type: 'solid',
        },
        colors: ['#FF008044'],
        series: [
          {
            data: dataRender,
          },
        ],
        stroke: {
          width: 2,
        },
        grid: {
          borderColor: '#E3F2FD',
          show: false,
        },
        markers: {
          size: 0,
        },
        xaxis: {
          labels: {
            formatter(value: number) {
              return (value / 10).toFixed(2);
            },
            style: {
              colors: '#687386',
              fontSize: '14px',
            },
          },
        },
        yaxis: {
          tickAmount: 2,
        },
      },
    };
  },
  props: {
    zapPool: {
      type: Object,
      required: true,
    },
  },
  methods: {
    setMinPrice() {
      console.log('setMinPrice');
    },
    setMaxPrice() {
      console.log('setMaxPrice');
    },
    setRange(val: number) {
      // const context = document.querySelector('#graph').getContext('2d');
      // const chart = new Chart(context).Line(data);

      // $('#btn1').on('click', () => {
      //   chart.data.datasets[0].data = [140, 100, 50];
      //   chart.update();
      // });

      this.currentRange = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.zapin-v3 {
  width: 100%;

  h2 {
    margin-top: 14px;
  }
}

.zapin-v3__chart {
  padding: 14px;
  border-radius: 10px;
  background-color: var(--color-5);
  margin-top: 8px;

  h3 {
    margin-bottom: 16px;
  }
}

.zapin-v3__row {
  display: flex;
  gap: 8px;
  margin-top: 8px;

  h3 {
    color: var(--color-1);
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    margin-top: 24px;
    text-align: center;
  }
}

.zapin-v3__row-block {
  width: 100%;
  padding: 20px 14px;
  border-radius: 10px;
  background-color: var(--color-5);
}

.range-presets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 10px;
  min-width: 300px;
  margin-top: 12px;
}

.range-presets__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  min-width: 80px;
  color: var(--color-2);
  background-color: var(--color-5);
  border-radius: 30px;
  cursor: pointer;
  transition: background-color .2s ease,
  color .2s ease,
  box-shadow .1s ease,
  opacity .2s ease,
  transform .3s ease;

  [data-theme="dark"] & {
    color: var(--color-4);
    background-color: var(--color-7);
  }

  &:hover {
    background-color: var(--color-6);
    color: var(--color-1);
    [data-theme="dark"] & {
      background-color: var(--color-4);
      color: var(--color-17);
      svg {
        fill: var(--color-17);
      }
    }
  }
}

.range-presets__item--selected {
  box-shadow: 0 0 0px 2px var(--color-3);
}

#chart-bar {
  position: relative;
  margin-top: -38px;
}
</style>
