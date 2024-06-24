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
        v-if="initialLoading"
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
            @click="reversePrice ? handleRightTick(false) : handleLeftTick(true)"
            @keypress="reversePrice ? handleRightTick(false) : handleLeftTick(true)"
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
            @click="reversePrice ? handleRightTick(true) : handleLeftTick(false)"
            @keypress="reversePrice ? handleRightTick(true) : handleLeftTick(false)"
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
            @click="reversePrice ? handleLeftTick(false) : handleRightTick(true)"
            @keypress="reversePrice ? handleLeftTick(false) : handleRightTick(true)"
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
            @click="reversePrice ? handleLeftTick(true) : handleRightTick(false)"
            @keypress="reversePrice ? handleLeftTick(true) : handleRightTick(false)"
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
        Range presets {{ getPresetsName }}: {{ currentRange }}
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
          </div>

          {{ range.label }}
        </div>
      </div>
    </div>
    <Transition name="slide-fade">
      <div
        class="zapin-v3__loader-tx"
        v-if="isLoading"
      >
        <Spinner
          size="48px"
        />
      </div>
    </Transition>
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
import { createScaledArray } from './helpers.ts';

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
      initialLoading: true,
      isLoading: false,
      reversePrice: false,
      reverseTriggered: false,
      ticksAmount: '0',
      tickLeft: '0',
      tickRight: '0',
      tickSpace: '0',
      centerTick: '0',
      minPrice: '0',
      maxPrice: '0',
      centerPrice: '0',
      currentRange: 10,
      pairSymbols: [],
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
          id: 4, value: 887272, label: 'FULL',
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
      return (range: any) => !!(this.ticksAmount && this.ticksAmount === range.value.toString());
    },
    getPresetsName() {
      return this.isStablePool ? 'ticks' : 'percents';
    },
    getPresetsData() {
      return this.rangePresetsTicks;
    },
    showPresetPlusMinus() {
      return (range: any) => {
        if (range.id === 0) return false;
        if (range?.label === 'FULL') return false;
        return true;
      };
    },
  },
  async mounted() {
    this.pairSymbols = this.zapPool.name.split('/');
    const currPrice = await this.zapContract.getCurrentPrice(this.zapPool.address);
    const tickSpace = await this.zapContract.getTickSpacing(this.zapPool.address);
    const centerTick = await this.zapContract.getCurrentPoolTick(this.zapPool.address);
    const center = new BN(currPrice).div(10 ** 6);
    this.initTicks(tickSpace);

    console.log(centerTick.toString(), '__closestTick');
    this.tickSpace = tickSpace.toString();
    this.tickLeft = new BN(centerTick.toString()).minus(tickSpace.toString()).toFixed();
    this.tickRight = new BN(centerTick.toString()).plus(tickSpace.toString()).toFixed();
    this.ticksAmount = tickSpace.toString();
    this.centerTick = centerTick.toString();

    const minPrice = new BN(await this.zapContract
      .tickToPrice(this.zapPool.address, this.tickLeft));
    const maxPrice = new BN(await this.zapContract
      .tickToPrice(this.zapPool.address, this.tickRight));

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
        this.selectVolatileData(center, minPrice, maxPrice);
        this.initialLoading = false;
        this.maxZoom(1);
        return;
      }

      this.centerPrice = center.toFixed(6);

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

      this.selectVolatileData(center, minPrice, maxPrice);
    }

    this.initialLoading = false;
    if (this.isStablePool) this.maxZoom();
  },
  watch: {
    async reversePrice(val) {
      const self = this;
      let buildData: any[] = (this.$refs?.zapinChart as any)?.series[0]?.data;
      this.isLoading = true;
      this.reverseTriggered = true;

      if (val) {
        buildData = buildData
          .slice(2, buildData.length)
          .map((_) => [Number(new BN(1).div(_[0]).toFixed(6)), _[1]]);
      }

      if (val) {
        (this.$refs?.zapinChart as any).updateSeries([{
          data: buildData,
        }], false, true);

        (this.$refs?.zapinChart as any)?.updateOptions(
          {
            chart: {
              selection: {
                xaxis: {
                  min: Number(this.frontMinPrice),
                  max: Number(this.frontMaxPrice),
                },
              },
            },
            annotations: {
              xaxis: [
                {
                  x: this.getCenterPrice,
                  borderColor: '#0497EC',
                  borderWidth: 2,
                  label: {
                    borderColor: '#0497EC',
                    orientation: 'horizontal',
                  },
                },
              ],
            },
          },
          false,
          true,
        );
      } else {
        this.tickLeft = new BN(
          this.centerTick.toString(),
        ).minus(this.tickSpace.toString()).toFixed();
        this.tickRight = new BN(
          this.centerTick.toString(),
        ).plus(this.tickSpace.toString()).toFixed();

        const minPrice = new BN(await this.zapContract
          .tickToPrice(this.zapPool.address, this.tickLeft));
        const maxPrice = new BN(await this.zapContract
          .tickToPrice(this.zapPool.address, this.tickRight));
        const currPrice = await this.zapContract.getCurrentPrice(this.zapPool.address);
        this.selectVolatileData(new BN(currPrice).div(10 ** 6), minPrice, maxPrice, true);
        this.initBuildData();
        (this.$refs?.zapinChart as any)?.updateOptions(
          {
            chart: {
              selection: {
                xaxis: {
                  min: Number(this.frontMinPrice),
                  max: Number(this.frontMaxPrice),
                },
              },
            },
            annotations: {
              xaxis: [
                {
                  x: this.getCenterPrice,
                  borderColor: '#0497EC',
                  borderWidth: 2,
                  label: {
                    borderColor: '#0497EC',
                    orientation: 'horizontal',
                  },
                },
              ],
            },
            xaxis: {
              labels: {
                formatter(value: number) {
                  const dec = self.lowPoolPrice ? 2 : 0;
                  return value.toFixed(dec);
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
      }

      await this.maxZoom();
      this.isLoading = false;
      this.reverseTriggered = false;
    },
  },
  methods: {
    initTicks(tSpace: string) {
      this.rangePresetsTicks = this.rangePresetsTicks.map((item, key) => {
        if (item.label === 'FULL') return item;

        return {
          id: key,
          value: new BN(item.value).times(tSpace).toNumber(),
          label: new BN(item.label).times(tSpace).toFixed(),
        };
      });
    },
    async inversePrices() {
      this.reversePrice = !this.reversePrice;
      this.maxZoom();
    },
    async maxZoom(num = 4) {
      await awaitDelay(100);
      this.zoomType = num;
      this.zoomInOut(true);
    },
    selectVolatileData(
      center: BN,
      minPrice: BN,
      maxPrice: BN,
      updateData?: boolean,
    ) {
      const dec = this.lowPoolPrice ? 6 : 0;
      this.minPrice = minPrice.div(10 ** 6).toFixed(dec);
      this.maxPrice = maxPrice.div(10 ** 6).toFixed(dec);
      this.centerPrice = center.toFixed(6);

      this.$emit('set-range', {
        range: [
          minPrice.toFixed(0),
          maxPrice.toFixed(0),
        ],
        ticks: this.ticksAmount,
        isStable: this.isStablePool,
      });

      if (updateData) return;

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
      if (this.reversePrice) return;
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
        const highPricePool = this.reversePrice ? 6 : 0;
        const dec = this.lowPoolPrice ? 1 : highPricePool;
        minVal = new BN(this.getCenterPrice).times(0.8).toFixed(dec);
        maxVal = new BN(this.getCenterPrice).times(1.2).toFixed(dec);
      }
      if (this.zoomType === 3) {
        const highPricePool = this.reversePrice ? 6 : 0;
        const dec = this.lowPoolPrice ? 2 : highPricePool;
        minVal = new BN(this.getCenterPrice).times(0.99).toFixed(dec);
        maxVal = new BN(this.getCenterPrice).times(1.01).toFixed(dec);
      }
      if (this.zoomType === 4) {
        const highPricePool = this.reversePrice ? 6 : 0;
        const dec = this.lowPoolPrice ? 3 : highPricePool;
        minVal = new BN(this.getCenterPrice).times(0.999).toFixed(dec);
        maxVal = new BN(this.getCenterPrice).times(1.001).toFixed(dec);
      }
      if (this.zoomType === 5) {
        const highPricePool = this.reversePrice ? 6 : 0;
        const dec = this.lowPoolPrice ? 4 : highPricePool;
        minVal = new BN(this.getCenterPrice).times(0.9995).toFixed(dec);
        maxVal = new BN(this.getCenterPrice).times(1.0005).toFixed(dec);
      }

      const dataDec = this.reversePrice ? 6 : 4;
      const buildData = createScaledArray(Number(minVal), Number(maxVal), dataDec);

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
                if (self.reversePrice && !self.lowPoolPrice) {
                  return value.toFixed(5);
                }

                if (value === 0) return '0';

                if (self.lowPoolPrice) {
                  const modulo = self.zoomType <= 5 ? 0.0002 : 0.5;
                  const num = new BN(value.toFixed(1)).times(10);
                  return num.modulo(modulo).toNumber() === 0 ? value.toFixed(modulo === 0.0002 ? 4 : 2) : '';
                }

                return value.toFixed(0);
              },
            },
          },
        },
        false,
        true,
      );
    },
    async handleLeftTick(isMinus: boolean) {
      this.ticksAmount = '0';

      if (isMinus) {
        this.tickLeft = new BN(this.tickLeft).minus(this.tickSpace).toFixed();
        const tickNum = await this.zapContract.tickToPrice(this.zapPool.address, this.tickLeft);
        this.minPrice = new BN(tickNum).div(10 ** 6).toFixed(this.lowPoolPrice ? 6 : 0);
      } else {
        this.tickLeft = new BN(this.tickLeft).plus(this.tickSpace).toFixed();
        const tickNum = await this.zapContract.tickToPrice(this.zapPool.address, this.tickLeft);
        this.minPrice = new BN(tickNum).div(10 ** 6).toFixed(this.lowPoolPrice ? 6 : 0);
      }

      this.debouncePriceChange(this, this.minPrice, this.maxPrice, true);
    },
    async handleRightTick(isMinus: boolean) {
      this.ticksAmount = '0';

      if (isMinus) {
        this.tickRight = new BN(this.tickRight).minus(this.tickSpace).toFixed();
        const tickNum = await this.zapContract.tickToPrice(this.zapPool.address, this.tickRight);
        this.maxPrice = new BN(tickNum.toString()).div(10 ** 6).toFixed(this.lowPoolPrice ? 6 : 0);
      } else {
        this.tickRight = new BN(this.tickRight).plus(this.tickSpace).toFixed();
        const tickNum = await this.zapContract.tickToPrice(this.zapPool.address, this.tickRight);
        this.maxPrice = new BN(tickNum.toString()).div(10 ** 6).toFixed(this.lowPoolPrice ? 6 : 0);
      }

      this.debouncePriceChange(this, this.minPrice, this.maxPrice, true);
    },
    selectEvent(e: any, o: any) {
      if (this.reverseTriggered) return;
      const decimals = this.reversePrice ? 6 : 0;
      const minPrice = new BN(o.xaxis?.min).toFixed(this.lowPoolPrice ? 6 : decimals);
      const maxPrice = new BN(o.xaxis?.max).toFixed(this.lowPoolPrice ? 6 : decimals);

      const prevMinPrice = new BN(this.frontMinPrice).toFixed(this.lowPoolPrice ? 6 : decimals);
      const prevMaxPrice = new BN(this.frontMaxPrice).toFixed(this.lowPoolPrice ? 6 : decimals);

      if (new BN(minPrice).eq(prevMinPrice) && new BN(maxPrice).eq(prevMaxPrice)) {
        return;
      }

      if (new BN(minPrice).eq(0) || new BN(maxPrice).eq(0)) return;

      this.ticksAmount = '0';

      const mainMinP = this.reversePrice ? new BN(1).div(maxPrice).toFixed(decimals) : minPrice;
      const mainMaxP = this.reversePrice ? new BN(1).div(minPrice).toFixed(decimals) : maxPrice;

      this.debouncePriceChange(this, mainMinP, mainMaxP);
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
    },
    debouncePriceChange: debounce(async (
      self: any,
      minPriceVal: string,
      maxPriceVal: string,
      skipLoading?: boolean,
    ) => {
      self.changeTrig();
      const minPrice = new BN(minPriceVal).times(10 ** 6).toFixed(0);
      const maxPrice = new BN(maxPriceVal).times(10 ** 6).toFixed(0);

      self.$emit('set-range', {
        range: [minPrice, maxPrice],
        ticks: self.ticksAmount,
        isStable: self.isStablePool,
      });

      // loading need, when we converting front price to real contract ticks
      if (!skipLoading) {
        self.isLoading = true;

        const minPriceTick = await self.zapContract
          .priceToClosestTick(self.zapPool.address, minPrice);
        const maxPriceTick = await self.zapContract
          .priceToClosestTick(self.zapPool.address, maxPrice);

        const minPriceTickPrice = await self.zapContract
          .tickToPrice(self.zapPool.address, minPriceTick);
        const maxPriceTickPrice = await self.zapContract
          .tickToPrice(self.zapPool.address, maxPriceTick);

        const decimals = self.lowPoolPrice ? 6 : 0;
        self.minPrice = new BN(minPriceTickPrice).div(10 ** 6).toFixed(decimals);
        self.maxPrice = new BN(maxPriceTickPrice).div(10 ** 6).toFixed(decimals);
        self.isLoading = false;
      }

      console.log(self.frontMinPrice, '__selffrontMinPrice');
      (self.$refs?.zapinChart as any)?.updateOptions(
        {
          chart: {
            selection: {
              xaxis: {
                min: Number(self.frontMinPrice),
                max: Number(self.frontMaxPrice),
              },
            },
          },
        },
        false,
        true,
      );
    }, 500),
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
      const tickChange = val;

      this.tickLeft = new BN(this.centerTick).minus(tickChange).toFixed();
      const tickNumL = await this.zapContract.tickToPrice(this.zapPool.address, this.tickLeft);
      this.minPrice = new BN(tickNumL.toString()).div(10 ** 6).toFixed(this.lowPoolPrice ? 6 : 0);

      this.tickRight = new BN(this.centerTick).plus(tickChange).toFixed();
      const tickNumR = await this.zapContract.tickToPrice(this.zapPool.address, this.tickRight);
      this.maxPrice = new BN(tickNumR.toString()).div(10 ** 6).toFixed(this.lowPoolPrice ? 6 : 0);

      this.ticksAmount = val.toString();
      (this.$refs?.zapinChart as any)?.updateOptions(
        {
          chart: {
            selection: {
              xaxis: {
                min: this.frontMinPrice,
                max: this.frontMaxPrice,
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
  position: relative;
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

.zapin-v3__loader-tx {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
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
