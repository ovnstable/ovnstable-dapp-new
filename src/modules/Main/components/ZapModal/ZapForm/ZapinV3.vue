<template>
  <div class="zapin-v3">
    <h2>
      Set price range
    </h2>

    <div class="zapin-v3__chart">
      <div class="zapin-v3__chart-head">
        <h3 v-if='pairSymbols'>
          Current Price:  {{ centerPrice }}  {{ pairSymbols[1] }} per {{ pairSymbols[0] }}
        </h3>

        <div
          class="zapin-v3__chart-zoom"
          v-if="isStablePool"
        >
          <span>
            Zoom
          </span>

          <div
            class="zapin-v3__chart-zoom__mark"
            @click="zoomInOut(true)"
            @keypress="zoomInOut(true)"
          >
            +
          </div>
          <div
            class="zapin-v3__chart-zoom__mark"
            @click="zoomInOut(false)"
            @keypress="zoomInOut(false)"
          >
            -
          </div>
        </div>
      </div>

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
        @selection="selectEvent"
      />
    </div>

    <div class="zapin-v3__row">
      <div class="zapin-v3__col-block">
        <h3>
          Min price
        </h3>
        <div class="zapin-v3__row-block">
          <div
            v-if="!isStablePool"
            class="zapin-v3__clicker"
            @click="decrPrice(true)"
            @keypress="decrPrice(true)"
          >
            -
          </div>
          <InputComponent
            :value="minPrice"
            :disabled="isStablePool"
            input-type="white"
            placeholder="0"
            full-width
            is-center
            input-size="lg"
            @input="setMinPrice"
          />
          <div
            v-if="!isStablePool"
            class="zapin-v3__clicker"
            @click="addPrice(true)"
            @keypress="addPrice(true)"
          >
            +
          </div>
        </div>
        <p v-if="pairSymbols">
          {{ pairSymbols[0] }} per {{ pairSymbols[1] }}
        </p>
      </div>
      <div class="zapin-v3__col-block">
        <h3>
          Max price
        </h3>
        <div class="zapin-v3__row-block">
          <div
            v-if="!isStablePool"
            class="zapin-v3__clicker"
            @click="decrPrice(false)"
            @keypress="decrPrice(false)"
          >
            -
          </div>
          <InputComponent
            :value="maxPrice"
            :disabled="isStablePool"
            input-type="white"
            placeholder="0"
            full-width
            is-center
            input-size="lg"
            @input="setMaxPrice"
          />
          <div
            v-if="!isStablePool"
            class="zapin-v3__clicker"
            @click="addPrice(false)"
            @keypress="addPrice(false)"
          >
            +
          </div>
        </div>
        <p v-if="pairSymbols">
          {{ pairSymbols[0] }} per {{ pairSymbols[1] }}
        </p>
      </div>
    </div>

    <div class="range-presets-wrap">
      <h2>
        Range presets {{ getPresetsName }}:
      </h2>
      <div class="range-presets">
        <div
          v-for="range in getPresetsData"
          :key="range.id"
          class="range-presets__item"
          :class="getRangeActive(range) ? 'range-presets__item--selected' : ''"
          @click="setRange(range.value)"
          @keydown="setRange(range.value)"
        >
          <div
            class="range-presets__plusmin"
            v-if="showPresetPlusMinus(range)"
          >
            <span>+</span>
            <span>-</span>
          </div>

          {{ range.value === 100 ? "FULL" : `${range.label}${getPresetSymbol}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import InputComponent from '@/components/Input/Index.vue';
// import ButtonComponent from '@/components/Button/Index.vue';
// import BaseIcon from '@/components/Icon/BaseIcon.vue';
import Spinner from '@/components/Spinner/Index.vue';
import BN from 'bignumber.js';
import debounce from 'lodash/debounce';
import { notify as notifyInst } from '@kyvg/vue3-notification';
import { getProportionTicks } from '@/store/views/main/zapin/helpers.ts';

export default {
  name: 'ZapinV3',
  components: {
    InputComponent,
    Spinner,
  },
  emits: ['set-range'],
  data() {
    return {
      zoomType: 0.1,
      dataToRender: [],
      isLoading: true,
      ticksAmount: '0',
      minPrice: '0',
      maxPrice: '0',
      centerPrice: '0',
      currentRange: 20,
      pairSymbols: [],
      rangePresets: [
        {
          id: 0, value: 10, label: '5',
        },
        {
          id: 1, value: 20, label: '10',
        },
        {
          id: 2, value: 40, label: '20',
        },
        {
          id: 3, value: 100, label: '100',
        },
      ],
      rangePresetsTicks: [
        {
          id: 0, value: 1, label: '1',
        },
        {
          id: 1, value: 2, label: '1',
        },
        {
          id: 2, value: 4, label: '2',
        },
        {
          id: 3, value: 6, label: '3',
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
            style: {
              colors: '#687386',
              fontSize: '14px',
            },
          } as any,
        },
        yaxis: {
          tickAmount: 2,
        },
      },
      isStablePool: true,
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
  computed: {
    getRangeActive() {
      return (range: any) => {
        if (this.isStablePool) {
          return !!(this.ticksAmount && this.ticksAmount === range.value.toString());
        }

        return !!(this.currentRange && this.currentRange === range.value);
      };
    },
    getPresetsName() {
      return this.isStablePool ? 'ticks' : 'percents';
    },
    getPresetsData() {
      return this.isStablePool ? this.rangePresetsTicks : this.rangePresets;
    },
    showPresetPlusMinus() {
      return (range: any) => {
        if (this.isStablePool) return range.id !== 0;
        if (!this.isStablePool && range?.value === 100) return false;
        return true;
      };
    },
    getPresetSymbol() {
      return this.isStablePool ? '' : '%';
    },
  },
  async mounted() {
    this.pairSymbols = this.zapPool.name.split('/');
    const currPrice = await this.zapContract.getCurrentPrice(this.zapPool.address);
    const center = new BN(currPrice).div(10 ** 6);

    let buildData: any = [];

    // if stablepool todo
    if (center.lt(1.1)) {
      this.ticksAmount = '1';
      buildData = Array.from({ length: 22 }).map((_, key) => [key / 10, 0]);
      this.optionsChart.series = [
        {
          data: buildData,
        },
      ];

      const minPrice = new BN(currPrice).times(0.9);
      const maxPrice = new BN(currPrice).times(1.1);
      this.centerPrice = center.toFixed(2);

      this.$emit('set-range', {
        range: [
          minPrice.toFixed(0),
          maxPrice.toFixed(0),
        ],
        ticks: this.ticksAmount,
        isStable: this.isStablePool,
      });

      let rangeData = [0, 0];

      try {
        rangeData = await getProportionTicks(this.zapPool, this.zapContract, {
          range: [
            new BN(this.minPrice).times(10 ** 6).toFixed(0),
            new BN(this.maxPrice).times(10 ** 6).toFixed(0),
          ],
          ticks: this.ticksAmount,
          isStable: this.isStablePool,
        });
      } catch (e) {
        console.log(e, 'rangeerr');
      }

      if (new BN(rangeData[0]).eq(0) || new BN(rangeData[1]).eq(0)) return;

      const minPriceSel = new BN(rangeData[0]).div(10 ** 6).toFixed(6);
      const maxPriceSel = new BN(rangeData[1]).div(10 ** 6).toFixed(6);
      this.minPrice = minPriceSel;
      this.maxPrice = maxPriceSel;

      this.optionsChart.chart.selection.xaxis = {
        min: Number(minPriceSel),
        max: Number(maxPriceSel),
      };

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
    } else {
      this.isStablePool = false;
      // building data before and after center
      buildData = buildData.concat(Array
        .from({ length: 4 })
        .map((_, key) => [Number((center.div(key + 1)).minus(center.div(5)).toFixed(0)), 0])
        .reverse());
      buildData = buildData.concat(Array
        .from({ length: 4 })
        .map((_, key) => [Number((center.div(key + 1)).plus(center).toFixed(0)), 0]).reverse());

      this.optionsChart.series = [
        {
          data: buildData,
        },
      ];

      const minPrice = new BN(currPrice).times(0.9);
      const maxPrice = new BN(currPrice).times(1.1);
      this.minPrice = minPrice.div(10 ** 6).toFixed(6);
      this.maxPrice = maxPrice.div(10 ** 6).toFixed(6);
      this.centerPrice = center.toFixed(2);

      this.$emit('set-range', {
        range: [
          minPrice.toFixed(0),
          maxPrice.toFixed(0),
        ],
        ticks: this.ticksAmount,
        isStable: this.isStablePool,
      });

      this.optionsChart.chart.selection.xaxis = {
        min: Number(this.minPrice),
        max: Number(this.maxPrice),
      };

      this.optionsChart.annotations = {
        xaxis: [
          {
            x: center.toFixed(0),
            borderColor: '#0497EC',
            borderWidth: 2,
            label: {
              borderColor: '#0497EC',
              orientation: 'horizontal',
            },
          },
        ],
      };
    }

    this.isLoading = false;
  },
  watch: {
    minPrice() {
      this.debouncePriceChange(this);
    },
    maxPrice() {
      this.debouncePriceChange(this);
    },
  },
  methods: {
    zoomInOut(scaleIn: boolean) {
      const data: any[] = (this.$refs?.zapinChart as any)?.series[0]?.data;
      const xStart = data[0][0];
      const xEnd = data[data.length - 1][0];
      console.log(this.$refs?.zapinChart, '__this.$refs?.zapinChart');
      console.log(xStart, xEnd, 'zoomIn');

      const zoomChange = this.isStablePool ? this.zoomType : this.zoomType * 10;

      const start = xStart + zoomChange;
      const finish = xEnd - zoomChange;
      const lengthArr = (finish - start + 1) * 10;

      let buildData = Array
        .from({ length: lengthArr }, (_, a) => [Number((a / 10 + start).toFixed(1)), 0]);
      if (this.isStablePool) buildData = buildData.filter((_) => (_[0] <= 2));
      if ((this.zoomType === 0.5 && scaleIn)
            || (new BN(this.zoomType).isLessThanOrEqualTo(0) && !scaleIn)) return;

      const zoomNum = 0.1;

      if (scaleIn) {
        this.zoomType = zoomNum + this.zoomType;
      } else {
        this.zoomType -= zoomNum;
      }

      console.log(this.zoomType, '__thiszoomType');
      if (buildData?.length === 0) return;

      Array
        .from({ length: this.zoomType * 10 }).forEach(() => buildData.pop());

      // (this.$refs?.zapinChart as any)?.zoomX(xStart, xEnd);
      (this.$refs?.zapinChart as any).updateSeries([{
        data: buildData,
      }], false, true);

      this.optionsChart.xaxis = {
        labels: {
          formatter(value: number) {
            if (value === 0) return '0';
            return +(value.toFixed(1)) % 0.1 === 0 ? value.toFixed(2) : '';
          },
          style: {
            colors: '#687386',
            fontSize: '14px',
          },
        },
      };
    },
    decrPrice(isMin: boolean) {
      if (isMin) {
        this.minPrice = new BN(this.minPrice).times(0.99).toFixed(0);
      } else {
        this.maxPrice = new BN(this.maxPrice).times(0.99).toFixed(0);
      }
    },
    addPrice(isMin: boolean) {
      if (isMin) {
        this.minPrice = new BN(this.minPrice).times(1.01).toFixed(0);
      } else {
        this.maxPrice = new BN(this.maxPrice).times(1.01).toFixed(0);
      }
    },
    selectEvent(e: any, o: any) {
      const minPrice = new BN(o.xaxis?.min).toFixed(this.isStablePool ? 6 : 0);
      const maxPrice = new BN(o.xaxis?.max).toFixed(this.isStablePool ? 6 : 0);

      if (new BN(maxPrice).lt(minPrice) || new BN(minPrice).gt(minPrice)) {
        notifyInst({
          title: 'Error',
          text: 'Max price or Min price is wrong',
          type: 'error',
        });
        return;
      }

      if (new BN(minPrice).eq(this.minPrice) && new BN(maxPrice).eq(this.maxPrice)) {
        return;
      }

      this.minPrice = minPrice;
      this.maxPrice = maxPrice;
      this.ticksAmount = '0';
      debounce(this.debounceSelectChange, 500);
    },
    debounceSelectChange() {
      this.$emit('set-range', {
        range: [
          new BN(this.minPrice).times(10 ** 6).toFixed(0),
          new BN(this.maxPrice).times(10 ** 6).toFixed(0),
        ],
        ticks: this.ticksAmount,
        isStable: this.isStablePool,
      });

      this.changeTrig();
    },
    debouncePriceChange: debounce(async (self: any) => {
      if (new BN(self.maxPrice).lt(self.minPrice) || !self.minPrice || !self.maxPrice) {
        notifyInst({
          title: 'Error',
          text: 'Max price can"t be less than min price',
          type: 'error',
        });
        return;
      }

      self.$emit('set-range', {
        range: [
          new BN(self.minPrice).times(10 ** 6).toFixed(0),
          new BN(self.maxPrice).times(10 ** 6).toFixed(0),
        ],
        ticks: self.ticksAmount,
        isStable: self.isStablePool,
      });

      if (self.isStablePool) return;

      (self.$refs?.zapinChart as any)?.updateOptions(
        {
          chart: {
            selection: {
              xaxis: {
                min: Number(self.minPrice),
                max: Number(self.maxPrice),
              },
            },
          },
        },
        false,
        true,
      );

      self.changeTrig();
    }, 200),
    changeTrig() {
      console.log('CHANGED');
    },
    setMinPrice(val: string) {
      this.minPrice = val;
    },
    setMaxPrice(val: string) {
      this.maxPrice = val;
    },
    async setRange(val: number) {
      if (this.isStablePool) {
        this.ticksAmount = val.toString();
        const rangeData = await getProportionTicks(this.zapPool, this.zapContract, {
          range: [
            new BN(this.minPrice).times(10 ** 6).toFixed(0),
            new BN(this.maxPrice).times(10 ** 6).toFixed(0),
          ],
          ticks: this.ticksAmount,
          isStable: this.isStablePool,
        });

        if (!rangeData) return;

        const minPrice = new BN(rangeData[0]).div(10 ** 6).toFixed(6);
        const maxPrice = new BN(rangeData[1]).div(10 ** 6).toFixed(6);
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;

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
        return;
      }

      const currPrice = await this.zapContract.getCurrentPrice(this.zapPool.address);
      const center = Number(new BN(currPrice).div(10 ** 6).toFixed(4));
      const minPrice = center * (1 - val / 2 / 100);
      const maxPrice = center * (1 + val / 2 / 100);

      this.minPrice = minPrice.toFixed(6);
      this.maxPrice = maxPrice.toFixed(6);
      this.centerPrice = new BN(currPrice).div(10 ** 6).toFixed(4);

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
    font-weight: 600;
    font-size: 15px;
  }

  p {
    color: var(--color-1);
    margin-top: 24px;
    text-align: center;
    font-weight: 600;
    font-size: 15px;
  }
}

.zapin-v3__clicker {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-3);
  border: 1px solid var(--color-3);
  min-width: 20px;
  max-width: 20px;
  min-height: 20px;
  max-height: 20px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
  transition: .2s ease background-color, color .2s ease;

  &:hover {
    background-color: var(--color-3);
    color: var(--color-4);
  }
}

.zapin-v3__row-block {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zapin-v3__col-block {
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

.range-presets-wrap {
  margin-top: 20px;
}

.range-presets__plusmin {
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    line-height: 4px;
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

.zapin-v3__chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.zapin-v3__chart-zoom {
  display: flex;
  align-items: center;
  gap: 20px;
}

.zapin-v3__chart-zoom__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-2);
  border: 1px solid var(--color-2);
  min-width: 20px;
  max-width: 20px;
  min-height: 20px;
  max-height: 20px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
  transition: .2s ease background-color, color .2s ease;

  &:hover {
    background-color: var(--color-3);
    color: var(--color-4);
  }
}
</style>
