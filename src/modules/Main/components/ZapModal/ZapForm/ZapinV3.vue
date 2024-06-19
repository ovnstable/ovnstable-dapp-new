<template>
  <div class="zapin-v3">
    <h2>
      Set price range
    </h2>
    <div class="zapin-v3__chart">
      <div class="zapin-v3__chart-head">
        <div class="zapin-v3__chart-head__col">
          <h2 v-if='pairSymbols'>
            Price:  {{ getCenterPrice }}  {{ getFirstSymbol }} per {{ getSecondSymbol }}
          </h2>
          <ButtonComponent
            @click="inversePrices"
            :btn-styles="!reversePrice ? 'primary' : 'secondary'"
          >
            Prices in {{ activeSymbolPrice }}
          </ButtonComponent>
        </div>

        <div
          class="zapin-v3__chart-zoom"
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
            class="zapin-v3__clicker"
            @click="decrPrice(true)"
            @keypress="decrPrice(true)"
          >
            -
          </div>
          <InputComponent
            :value="frontMinPrice"
            input-type="white"
            placeholder="0"
            full-width
            is-center
            input-size="lg"
            @input="setMinPrice"
          />
          <div
            class="zapin-v3__clicker"
            @click="addPrice(true)"
            @keypress="addPrice(true)"
          >
            +
          </div>
        </div>
        <p v-if="pairSymbols">
          {{ getFirstSymbol }} per {{ getSecondSymbol }}
        </p>
      </div>
      <div class="zapin-v3__col-block">
        <h3>
          Max price
        </h3>
        <div class="zapin-v3__row-block">
          <div
            class="zapin-v3__clicker"
            @click="decrPrice(false)"
            @keypress="decrPrice(false)"
          >
            -
          </div>
          <InputComponent
            :value="frontMaxPrice"
            input-type="white"
            placeholder="0"
            full-width
            is-center
            input-size="lg"
            @input="setMaxPrice"
          />
          <div
            class="zapin-v3__clicker"
            @click="addPrice(false)"
            @keypress="addPrice(false)"
          >
            +
          </div>
        </div>
        <p v-if="pairSymbols">
          {{ getFirstSymbol }} per {{ getSecondSymbol }}
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
            ±
            <!-- <span>+</span>
            <span>-</span> -->
          </div>

          {{ range.label === "100" ? "FULL" : `${range.label}${getPresetSymbol}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import InputComponent from '@/components/Input/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import Spinner from '@/components/Spinner/Index.vue';
import BN from 'bignumber.js';
import debounce from 'lodash/debounce';
import { getProportionTicks } from '@/store/views/main/zapin/helpers.ts';
import { awaitDelay } from '@/utils/const.ts';
import { checkIsEveryStable } from '@/store/views/main/pools/helpers.ts';

const createScaledArray = (start: number, end: number, maxItems = 10) => {
  const result = [];
  const step = (end - start) / (maxItems - 1); // Calculate the step size

  for (let i = 0; i < maxItems; i++) {
    // Push the current value rounded to four decimal places
    result.push([parseFloat((start + step * i).toFixed(4)), 0]);
  }

  return result;
};

export default {
  name: 'ZapinV3',
  components: {
    InputComponent,
    ButtonComponent,
    Spinner,
  },
  emits: ['set-range'],
  data() {
    return {
      zoomType: 1,
      dataToRender: [],
      isLoading: true,
      reversePrice: false,
      ticksAmount: '0',
      minPrice: '0',
      maxPrice: '0',
      centerPrice: '0',
      currentRange: 10,
      pairSymbols: [],
      rangePresets: [
        {
          id: 0, value: 2, label: '5',
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
        {
          id: 4, value: 887272, label: '100',
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
          type: 'bar',
          foreColor: '#ccc',
          parentHeightOffset: 50,
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
          padding: {
            top: 0, bottom: 20,
          },
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
      // < 2$
      lowPoolPrice: true,
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
    getFirstSymbol() {
      if (!this.reversePrice) return this.pairSymbols[0];

      return this.pairSymbols[1];
    },
    getSecondSymbol() {
      if (!this.reversePrice) return this.pairSymbols[1];

      return this.pairSymbols[0];
    },
    getCenterPrice() {
      if (!this.reversePrice) return this.centerPrice;

      return new BN(1).div(this.centerPrice).toFixed(8);
    },
    frontMinPrice() {
      if (!this.reversePrice) return this.minPrice;

      return new BN(1).div(this.maxPrice).toFixed(8);
    },
    frontMaxPrice() {
      if (!this.reversePrice) return this.maxPrice;

      return new BN(1).div(this.minPrice).toFixed(8);
    },
    activeSymbolPrice() {
      return this.reversePrice ? this.pairSymbols[1] : this.pairSymbols[0];
    },
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
    console.log(this.zapContract, '__thiszapContract');
    const currPrice = await this.zapContract.getCurrentPrice(this.zapPool.address);
    const center = new BN(currPrice).div(10 ** 6);

    console.log(center.toString(), '___centercenter');
    let buildData: any = [];
    this.isStablePool = checkIsEveryStable(this.zapPool);

    // if center price lower than 2$, doing higher zoom
    if (center.lt(2)) {
      buildData = Array.from({ length: 22 }).map((_, key) => [key / 10, 0]);
      this.optionsChart.series = [
        {
          data: buildData,
        },
      ];

      // some pools have low center price, ex arb/usd+ and its volatile
      if (!this.isStablePool) {
        console.log('VOLATILE__');
        this.selectVolatileData(currPrice, center);
        this.isLoading = false;
        this.maxZoom(1);
        return;
      }

      const minPrice = new BN(currPrice).times(0.9);
      const maxPrice = new BN(currPrice).times(1.1);
      this.centerPrice = center.toFixed(6);

      this.ticksAmount = '1';
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
      this.lowPoolPrice = false;
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

      this.selectVolatileData(currPrice, center);
    }

    this.isLoading = false;
    if (this.isStablePool) this.maxZoom();
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
    async inversePrices() {
      this.reversePrice = !this.reversePrice;
    },
    async maxZoom(num = 4) {
      await awaitDelay(100);
      this.zoomType = num;
      this.zoomInOut(true);
    },
    selectVolatileData(currPrice: string, center: BN) {
      const minPrice = new BN(currPrice).times(0.95);
      const maxPrice = new BN(currPrice).times(1.05);
      this.minPrice = minPrice.div(10 ** 6).toFixed(6);
      this.maxPrice = maxPrice.div(10 ** 6).toFixed(6);
      this.centerPrice = center.toFixed(6);

      console.log({
        range: [
          minPrice.toFixed(0),
          maxPrice.toFixed(0),
        ],
        ticks: this.ticksAmount,
        isStable: this.isStablePool,
      }, '___selectVolatileData');
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
            x: center.toFixed(this.lowPoolPrice ? 6 : 0),
            borderColor: '#0497EC',
            borderWidth: 2,
            label: {
              borderColor: '#0497EC',
              orientation: 'horizontal',
            },
          },
        ],
      };
    },
    initBuildData() {
      if (this.isStablePool || this.lowPoolPrice) {
        const buildData = Array.from({ length: 22 }).map((_, key) => [key / 10, 0]);

        (this.$refs?.zapinChart as any).updateSeries([{
          data: buildData,
        }], false, true);

        (this.$refs?.zapinChart as any)?.updateOptions(
          {
            xaxis: {
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
            },
          },
          false,
          true,
        );
      } else {
        let buildData: any = [];
        // building data before and after center
        buildData = buildData.concat(Array
          .from({ length: 4 })
          .map((_, key) => [Number((new BN(this.centerPrice)
            .div(key + 1))
            .minus(new BN(this.centerPrice).div(5)).toFixed(0)), 0])
          .reverse());
        buildData = buildData.concat(Array
          .from({ length: 4 })
          .map((_, key) => [Number((new BN(this.centerPrice)
            .div(key + 1))
            .plus(new BN(this.centerPrice)).toFixed(0)), 0]).reverse());

        this.optionsChart.series = [
          {
            data: buildData,
          },
        ];
      }
    },
    zoomInOut(scaleIn: boolean) {
      // const data: any[] = (this.$refs?.zapinChart as any)?.series[0]?.data;
      // const xStart = data[0][0];
      // const xEnd = data[data.length - 1][0];

      let minVal = '0';
      let maxVal = '0';

      const zoomNum = 1;
      let newZoomType = 0;

      if (scaleIn) newZoomType = Number((zoomNum + this.zoomType).toFixed(0));
      else newZoomType = Number((this.zoomType - zoomNum).toFixed(0));
      if ((new BN(newZoomType).gt(5) && scaleIn)
            || (new BN(newZoomType).lt(1) && !scaleIn)) return;

      this.zoomType = newZoomType;

      if (this.zoomType === 1) {
        this.initBuildData();
        return;
      }

      if (this.zoomType === 2) {
        const dec = this.lowPoolPrice ? 1 : 0;
        minVal = new BN(this.centerPrice).times(0.9).toFixed(dec);
        maxVal = new BN(this.centerPrice).times(1.1).toFixed(dec);
      }
      if (this.zoomType === 3) {
        const dec = this.lowPoolPrice ? 2 : 0;
        minVal = new BN(this.centerPrice).times(0.99).toFixed(dec);
        maxVal = new BN(this.centerPrice).times(1.01).toFixed(dec);
      }
      if (this.zoomType === 4) {
        const dec = this.lowPoolPrice ? 3 : 0;
        minVal = new BN(this.centerPrice).times(0.999).toFixed(dec);
        maxVal = new BN(this.centerPrice).times(1.001).toFixed(dec);
      }
      if (this.zoomType === 5) {
        const dec = this.lowPoolPrice ? 4 : 0;
        minVal = new BN(this.centerPrice).times(0.9995).toFixed(dec);
        maxVal = new BN(this.centerPrice).times(1.0005).toFixed(dec);
      }

      const buildData = createScaledArray(Number(minVal), Number(maxVal));

      if (buildData?.length === 0) return;
      (this.$refs?.zapinChart as any).updateSeries([{
        data: buildData,
      }], false, true);

      const self = this;

      (this.$refs?.zapinChart as any)?.updateOptions(
        {
          xaxis: {
            labels: {
              formatter(value: number) {
                if (value === 0) return '0';

                if (self.lowPoolPrice) {
                  const modulo = self.zoomType <= 5 ? 0.0002 : 0.5;
                  const num = new BN(value.toFixed(1)).times(10);
                  return num.modulo(modulo).toNumber() === 0 ? value.toFixed(modulo === 0.0002 ? 4 : 2) : '';
                }

                return value.toFixed(0);
              },
              style: {
                colors: '#687386',
                fontSize: '14px',
              },
            },
          },
        },
        false,
        true,
      );
    },
    decrPrice(isMin: boolean) {
      if (isMin) {
        this.minPrice = new BN(this.minPrice).times(0.99).toFixed(this.lowPoolPrice ? 6 : 0);
      } else {
        this.maxPrice = new BN(this.maxPrice).times(0.99).toFixed(this.lowPoolPrice ? 6 : 0);
      }
    },
    addPrice(isMin: boolean) {
      if (isMin) {
        this.minPrice = new BN(this.minPrice).times(1.01).toFixed(this.lowPoolPrice ? 6 : 0);
      } else {
        this.maxPrice = new BN(this.maxPrice).times(1.01).toFixed(this.lowPoolPrice ? 6 : 0);
      }
    },
    selectEvent(e: any, o: any) {
      const minPrice = new BN(o.xaxis?.min).toFixed(this.lowPoolPrice ? 6 : 0);
      const maxPrice = new BN(o.xaxis?.max).toFixed(this.lowPoolPrice ? 6 : 0);

      if (new BN(minPrice).eq(this.minPrice) && new BN(maxPrice).eq(this.maxPrice)) {
        return;
      }

      console.log('selectEvent__');
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
      console.log(val, 'SET_RANGE');
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
      const center = Number(new BN(currPrice).div(10 ** 6).toFixed(6));
      const minPrice = center * (1 - val / 2 / 100);
      const maxPrice = center * (1 + val / 2 / 100);

      this.minPrice = minPrice.toFixed(6);
      this.maxPrice = maxPrice.toFixed(6);
      this.centerPrice = new BN(currPrice).div(10 ** 6).toFixed(6);

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
      this.currentRange = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.zapin-v3 {
  // width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.zapin-v3__chart {
  padding: 14px 14px 36px 14px;
  border-radius: 10px;
  background-color: var(--color-5);
  flex-grow: 1;
  [data-theme="dark"] & {
    background-color: var(--color-7);
    color: var(--color-1);
  }

  h3 {
    margin-bottom: 16px;
  }
}

.zapin-v3__row {
  display: flex;
  gap: 8px;

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
  color: var(--color-1);
  margin-top: 12px;
  .input-component.is-disabled {
    opacity: 1;
  }
}

.zapin-v3__col-block {
  width: 100%;
  padding: 20px 14px;
  border-radius: 10px;
  background-color: var(--color-5);
  [data-theme="dark"] & {
    color: var(--color-4);
    background-color: var(--color-7);
  }
}

.range-presets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 10px;
  min-width: 300px;
  // margin-top: 12px;
}

.range-presets__item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  // margin-top: 14px;
}

.range-presets__plusmin {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(1.1);

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
  align-items: flex-start;
  justify-content: space-between;
}

.zapin-v3__chart-head__col {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
