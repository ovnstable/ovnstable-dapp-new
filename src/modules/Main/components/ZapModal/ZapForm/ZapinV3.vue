<template>
  <div class="zapin-v3">
    <h2>
      Set price range
    </h2>

    <div class="zapin-v3__chart">
      <h3 v-if='pairSymbols'>
        Current Price:  1.000  {{ pairSymbols[0] }} per {{ pairSymbols[1] }}
      </h3>

      <div
        class="zapin-v3__loader"
        v-if="isLoading"
      >
        <Spinner
          size="48px"
        />
      </div>
      <apexchart
        v-else
        ref="zapinChart"
        class="zapin-v3__chart-range"
        type="area"
        height="100%"
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
        <p v-if="pairSymbols">
          {{ pairSymbols[0] }} per {{ pairSymbols[1] }}
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
        <p v-if="pairSymbols">
          {{ pairSymbols[0] }} per {{ pairSymbols[1] }}
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
import Spinner from '@/components/Spinner/Index.vue';
import BN from 'bignumber.js';

export default {
  name: 'ZapinV3',
  components: {
    InputComponent,
    Spinner,
  },
  emits: ['set-range'],
  data() {
    return {
      dataToRender: [],
      isLoading: true,
      minPrice: '0',
      maxPrice: '0',
      currentRange: 20,
      pairSymbols: [],
      rangePresets: [
        {
          id: 0, value: 10,
        },
        {
          id: 1, value: 20,
        },
        {
          id: 2, value: 30,
        },
        {
          id: 3, value: 50,
        },
        {
          id: 4, value: 100,
        },
      ],
      optionsChart: {
        annotations: {
          xaxis: [
            {
              x: '9.5',
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
          width: '100%',
          height: '50px',
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
              min: 0,
              max: 0,
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
            data: [],
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
    zapContract: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    this.pairSymbols = this.zapPool.name.split('/');
    console.log(this.zapPool.address, '___this.zapPool.address');
    const currPrice = await this.zapContract.getCurrentPrice(this.zapPool.address);

    let buildData: any = [];

    // if stablepool todo
    if (true) {
      buildData = Array.from({ length: 22 }).map((_, key) => [key / 10, 0]);
      this.optionsChart.series = [
        {
          data: buildData,
        },
      ];

      console.log(currPrice.toString(), '___currPrice');

      const center = Number(new BN(currPrice).div(10 ** 6));

      const minPrice = new BN(currPrice).times(0.9);
      const maxPrice = new BN(currPrice).times(1.1);
      this.minPrice = minPrice.div(10 ** 6).toFixed(6);
      this.maxPrice = maxPrice.div(10 ** 6).toFixed(6);

      this.$emit('set-range', [minPrice.div(10 ** 12).toFixed(0), maxPrice.div(10 ** 12).toFixed(0)]);
      this.optionsChart.chart.selection.xaxis = {
        min: Number(this.minPrice),
        max: Number(this.maxPrice),
      };

      console.log(center, '___center');
      this.optionsChart.annotations = {
        xaxis: [
          {
            x: center.toString(),
            borderColor: '#0497EC',
            borderWidth: 2,
            label: {
              borderColor: '#0497EC',
              orientation: 'horizontal',
            },
          },
        ],
      };

      this.optionsChart.xaxis = {
        labels: {
          formatter(value: number) {
            if (value === 0) return '0';
            return +(value.toFixed(1)) % 0.5 === 0 ? value.toFixed(2) : '';
          },
          style: {
            colors: '#687386',
            fontSize: '14px',
          },
        },
      };
    }

    this.isLoading = false;
    console.log(currPrice.toString(), '___currPrice');
  },
  methods: {
    setMinPrice() {
      console.log('setMinPrice');
    },
    setMaxPrice() {
      console.log('setMaxPrice');
    },
    // chart2.updateOptions({
    //   chart: {
    //     events: {
    //       selection: (e, o) => {
    //         console.log(o);
    //       },
    //     },
    //   }
    // });s
    async setRange(val: number) {
      const currPrice = await this.zapContract.getCurrentPrice(this.zapPool.address);
      const center = Number(new BN(currPrice).div(10 ** 6).toFixed(4));

      const minPrice = center * (1 - val / 2 / 100);
      const maxPrice = center * (1 + val / 2 / 100);

      this.minPrice = minPrice.toFixed(6);
      this.maxPrice = maxPrice.toFixed(6);

      (this.$refs?.zapinChart as any)?.updateOptions(
        {
          chart: {
            selection: {
              xaxis: {
                min: minPrice,
                max: maxPrice,
              },
            },
          },
        },
        false,
        true,
      );

      (this.$refs?.zapinChart as any).updateSeries([{
        data: this.optionsChart.series[0].data,
      }], false, true);

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
  padding: 14px 14px 36px 14px;
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
}

.zapin-v3__chart-range {
  height: 200px;
}

.zapin-v3__loader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}
</style>
