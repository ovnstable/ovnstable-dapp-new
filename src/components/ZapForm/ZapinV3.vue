<template>
  <div class="zapin-v3">
    <h2>
      Set price range
    </h2>
    <div class="zapin-v3__chart">
      <div class="zapin-v3__chart-head">
        <div class="zapin-v3__chart-head__col">
          <div class="zapin-v3__chart-head__row">
            <h2 v-if="pairSymbols">
              View prices in:
            </h2>
            <ButtonComponent
              :btn-styles="!reversePrice ? 'grey' : 'primary'"
              @click="inversePrices"
            >
              <BaseIcon
                class="row-icon"
                name="SwapIconV3"
              />
              {{ activeSymbolPrice }}
            </ButtonComponent>
          </div>
          <h2 v-if="pairSymbols">
            Price in:  {{ getCenterPrice }} {{ getSecondSymbol }} per {{ getFirstSymbol }}
          </h2>
        </div>

        <div
          v-if="isInteractive"
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
        v-if="initialLoading"
        class="zapin-v3__loader"
      >
        <Spinner
          size="48px"
        />
      </div>
      <div
        v-else
        class="zapin-v3__chart-range"
      >
        <apexchart
          ref="zapinChart"
          class="zapin-v3__chart-range__apex"
          type="area"
          height="100%"
          :options="optionsChart"
          :series="optionsChart.series"
          @selection="selectEvent"
        />
        <div
          v-if="!isInteractive && !initialLoading"
          class="zapin-v3__blocker"
        />
      </div>
    </div>

    <div class="zapin-v3__row">
      <div class="zapin-v3__col-block">
        <h3>
          Min price
        </h3>
        <div class="zapin-v3__row-block">
          <div
            v-if="isInteractive"
            class="zapin-v3__clicker"
            :class="{ 'zapin-v3__clicker--dis': reversePrice }"
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
            :disabled="!isInteractive || reversePrice"
            @input="setMinPrice"
          />
          <div
            v-if="isInteractive"
            class="zapin-v3__clicker"
            :class="{ 'zapin-v3__clicker--dis': reversePrice }"
            @click="reversePrice ? handleRightTick(true) : handleLeftTick(false)"
            @keypress="reversePrice ? handleRightTick(true) : handleLeftTick(false)"
          >
            +
          </div>
        </div>
        <p v-if="pairSymbols">
          {{ getSecondSymbol }} per {{ getFirstSymbol }}
        </p>
      </div>
      <div class="zapin-v3__col-block">
        <h3>
          Max price
        </h3>
        <div class="zapin-v3__row-block">
          <div
            v-if="isInteractive"
            class="zapin-v3__clicker"
            :class="{ 'zapin-v3__clicker--dis': reversePrice }"
            @click="reversePrice ? handleLeftTick(false) : handleRightTick(true)"
            @keypress="reversePrice ? handleLeftTick(false) : handleRightTick(true)"
          >
            -
          </div>
          <InputComponent
            :value="currentRange === 887272 ? '∞' : frontMaxPrice"
            input-type="white"
            placeholder="0"
            full-width
            is-center
            input-size="lg"
            :disabled="!isInteractive || reversePrice"
            @input="setMaxPrice"
          />
          <div
            v-if="isInteractive"
            class="zapin-v3__clicker"
            :class="{ 'zapin-v3__clicker--dis': reversePrice }"
            @click="reversePrice ? handleLeftTick(true) : handleRightTick(false)"
            @keypress="reversePrice ? handleLeftTick(true) : handleRightTick(false)"
          >
            +
          </div>
        </div>
        <p v-if="pairSymbols">
          {{ getSecondSymbol }} per {{ getFirstSymbol }}
        </p>
      </div>
    </div>

    <div
      v-if="isInteractive"
      class="range-presets-wrap"
    >
      <h2>
        {{ isStablePool ? "Tick" : "Percent" }} presets:
      </h2>
      <div class="range-presets">
        <div
          v-for="range in getPresetsData"
          :key="range.id"
          class="range-presets__item"
          :class="getRangeActive(range) ? 'range-presets__item--selected' : ''"
          @click="setRange(range.value, range.tick)"
          @keydown="setRange(range.value, range.tick)"
        >
          <div
            v-if="showPresetPlusMinus(range)"
            class="range-presets__plusmin"
          >
            +-
          </div>

          {{ range.label }}

          <div
            v-if="showPresetPlusMinus(range)"
            class="range-presets__plusmin"
          >
            {{ range.tick ? "" : "%" }}
          </div>
        </div>
      </div>
    </div>
    <Transition name="slide-fade">
      <div
        v-if="isLoading"
        class="zapin-v3__loader-tx"
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
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import Spinner from '@/components/Spinner/Index.vue';
import BN from 'bignumber.js';
import debounce from 'lodash/debounce';
import { awaitDelay } from '@/utils/const.ts';
import { checkIsEveryStable } from '@/store/views/main/pools/helpers.ts';
import getZapinChartConfig from '@/services/Web3Service/utils/chart.ts';
import { createScaledArray } from '@/services/Web3Service/utils/index.ts';
import { fixedByPriceChart } from '@/utils/numbers.ts';

export default {
  name: 'ZapinV3',
  components: {
    InputComponent,
    ButtonComponent,
    BaseIcon,
    Spinner,
  },
  props: {
    ticksInit: {
      type: Array,
      required: false,
      default: () => [],
    },
    zapPool: {
      type: Object,
      required: true,
    },
    zapContract: {
      type: Object,
      required: true,
    },
    tokensData: {
      type: Array,
      required: true,
    },
    isInteractive: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ['set-range'],
  data() {
    return {
      zoomType: 1,
      initialLoading: true,
      isLoading: false,
      reversePrice: false,
      pricesLoading: false,
      reverseTriggered: false,
      closestTicks: ['0', '0'],
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
      pairTokensData: [] as any[],
      rangePresetsTicks: [
        {
          id: 0, value: 1, label: '1', tick: true,
        },
        {
          id: 1, value: 2, label: '1', tick: true,
        },
        {
          id: 2, value: 4, label: '2', tick: true,
        },
        {
          id: 3, value: 6, label: '3', tick: true,
        },
        {
          id: 4, value: 887272, label: 'FULL', tick: true,
        },
      ],
      rangePresetsPercents: [
        {
          id: 5, value: 4, label: '2', tick: false,
        },
        {
          id: 6, value: 6, label: '3', tick: false,
        },
        {
          id: 7, value: 10, label: '5', tick: false,
        },
        {
          id: 8, value: 20, label: '10', tick: false,
        },
        {
          id: 4, value: 887272, label: 'FULL', tick: true,
        },
      ],
      optionsChart: getZapinChartConfig(),
      // < 2$
      lowPoolPrice: true,
      isStablePool: true,
    };
  },
  computed: {
    getFirstDecimal() {
      if (!this.reversePrice) return this.pairTokensData[1].decimals;

      return this.pairTokensData[0].decimals;
    },
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

      const dec = this.lowPoolPrice ? 8 : 6;
      console.log(this.centerPrice, dec, '___DEC');
      return new BN(1).div(this.centerPrice).toFixed(dec);
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
    getPresetsData() {
      if (!this.isStablePool) return this.rangePresetsPercents;
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
  watch: {
    async reversePrice(val) {
      const self = this;
      let buildData: any[] = (this.$refs?.zapinChart as any)?.series[0]?.data;
      this.isLoading = true;
      this.reverseTriggered = true;
      const center = new BN(this.getCenterPrice);

      console.log(this.getCenterPrice, val, '__val');
      if (center.lt(0.1)) {
        buildData = buildData.concat(Array
          .from({ length: 4 })
          .map((_, key) => [(+(center.div(key + 1)).minus(center.div(5)).toFixed(8)), '0'])
          .filter((_) => (!_[0].toString().includes('e')))
          .reverse());
        buildData = buildData.concat(Array
          .from({ length: 4 })
          .map((_, key) => [(+(center.div(key + 1)).plus(center).toFixed(8)), '0']).reverse());
      } else {
        buildData = Array.from({ length: 22 }).map((_, key) => [key / 10, 0]);
      }

      if (val && this?.$refs?.zapinChart) {
        (this.$refs?.zapinChart as any)!.updateSeries([{
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
        const closestTicks = await this.zapContract
          .closestTicksForCurrentTick(this.zapPool.address);
        this.tickLeft = closestTicks[0]?.toString();
        this.tickRight = closestTicks[1]?.toString();

        const minPrice = new BN(await this.zapContract
          .tickToPrice(this.zapPool.address, this.tickLeft));
        const maxPrice = new BN(await this.zapContract
          .tickToPrice(this.zapPool.address, this.tickRight));
        const currPrice = await this.zapContract.getCurrentPrice(this.zapPool.address);
        this.selectVolatileData(new BN(currPrice)
          .div(10 ** this.pairTokensData[1].decimals), minPrice, maxPrice, true);
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
  async mounted() {
    this.pairSymbols = this.zapPool.name.split('/');
    this.pairTokensData = this.tokensData.map((_: any) => _.selectedToken);

    const tickSpace = await this.zapContract.getTickSpacing(this.zapPool.address);
    const currPrice = await this.zapContract.getCurrentPrice(this.zapPool.address);
    const centerTick = await this.zapContract.getCurrentPoolTick(this.zapPool.address);
    const center = new BN(currPrice).div(10 ** this.pairTokensData[1].decimals);
    const closestTicks = await this.zapContract.closestTicksForCurrentTick(this.zapPool.address);
    this.initTicks(tickSpace);

    this.closestTicks = [closestTicks[0]?.toString(), closestTicks[1]?.toString()];
    this.tickSpace = tickSpace.toString();

    // in rebalance ticks range already preloaded
    this.tickLeft = this.ticksInit?.length > 0 ? this.ticksInit[0]?.toString()
      : closestTicks[0]?.toString();
    this.tickRight = this.ticksInit?.length > 0 ? this.ticksInit[1]?.toString()
      : closestTicks[1]?.toString();
    this.ticksAmount = tickSpace.toString();
    this.centerTick = centerTick.toString();

    console.log(centerTick.toString(), '___this.center');
    console.log(this.tickSpace, '___this.tickSpace');
    console.log(this.tickLeft, '___this.tickLeft');
    console.log(this.tickRight, '___this.tickRight');
    const minPrice = new BN(await this.zapContract
      .tickToPrice(this.zapPool.address, this.tickLeft));
    const maxPrice = new BN(await this.zapContract
      .tickToPrice(this.zapPool.address, this.tickRight));

    console.log(+minPrice, '___this.tickLeft');
    console.log(+maxPrice, '___this.tickRight');
    console.log(currPrice.toString(), '___currPrice')
    let buildData: any = [];
    this.isStablePool = checkIsEveryStable(this.zapPool);

    console.log(checkIsEveryStable(this.zapPool), '__checkIsEveryStable(this.zapPool);');
    this.$emit('set-range', {
      ticks: [this.tickLeft?.toString(), this.tickRight?.toString()],
    });

    if (this.ticksInit?.length > 0) this.ticksAmount = '0';

    // if center price lower than 2$, doing higher zoom
    if (center.lt(10)) {
      if (center.lt(0.1)) {
        buildData = buildData.concat(Array
          .from({ length: 4 })
          .map((_, key) => [(+(center.div(key + 1)).minus(center.div(5)).toFixed(8)), '0'])
          .reverse());
        buildData = buildData.concat(Array
          .from({ length: 4 })
          .map((_, key) => [(+(center.div(key + 1)).plus(center).toFixed(8)), '0']).reverse());
      } else {
        buildData = Array.from({ length: 22 }).map((_, key) => [key / 10, 0]);
      }

      console.log(buildData, '___buildData2');
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

      this.centerPrice = center.toFixed(8);

      this.minPrice = minPrice.div(10 ** this.pairTokensData[1].decimals).toFixed(6);
      this.maxPrice = maxPrice.div(10 ** this.pairTokensData[1].decimals).toFixed(6);

      this.optionsChart.chart.selection.xaxis = {
        min: Number(this.minPrice),
        max: Number(this.maxPrice),
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

      console.log("_LOWFALSE")
      this.lowPoolPrice = false;
      // building data before and after center
      buildData = buildData.concat(Array
        .from({ length: 4 })
        .map((_, key) => [(+(center.div(key + 1)).minus(center.div(5)).toFixed(8)), '0'])
        .reverse());
      buildData = buildData.concat(Array
        .from({ length: 4 })
        .map((_, key) => [(+(center.div(key + 1)).plus(center).toFixed(8)), '0']).reverse());

      this.optionsChart.series = [
        {
          data: buildData,
        },
      ];

      this.selectVolatileData(center, minPrice, maxPrice);
    }

    this.initialLoading = false;
    this.maxZoom();
  },
  methods: {
    initTicks(tSpace: string) {
      this.rangePresetsTicks = this.rangePresetsTicks.map((item, key) => {
        if (item.label === 'FULL') return item;

        return {
          id: key,
          value: new BN(item.value).times(tSpace).toNumber(),
          label: new BN(item.label).toFixed(),
          tick: item.tick,
        };
      });
    },
    async inversePrices() {
      this.reversePrice = !this.reversePrice;

      if (this.reversePrice) this.pairTokensData = this.pairTokensData.reverse();
      if (!this.reversePrice) {
        this.pairTokensData = this.tokensData
          .map((_: any) => _.selectedToken);
      }
      this.maxZoom();
    },
    async maxZoom(num = 4) {
      await awaitDelay(1000);
      this.zoomType = num;
      this.zoomInOut(true);
    },
    selectVolatileData(
      center: BN,
      minPrice: BN,
      maxPrice: BN,
      updateData?: boolean,
    ) {
      const dec = this.lowPoolPrice ? 8 : 0;
      this.minPrice = minPrice.div(10 ** this.pairTokensData[1].decimals).toFixed(dec);
      this.maxPrice = maxPrice.div(10 ** this.pairTokensData[1].decimals).toFixed(dec);
      this.centerPrice = center.toFixed(8);

      this.$emit('set-range', {
        ticks: [this.tickLeft?.toString(), this.tickRight?.toString()],
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

      if (this.ticksInit?.length === 0) this.setRange(this.getPresetsData[0].value, false);
    },
    initBuildData() {
      if (this.reversePrice) return;
      if (this.isStablePool || this.lowPoolPrice) {
        const center = new BN(this.getCenterPrice);
        let buildData = [] as any[];

        if (center.lt(0.1)) {
          buildData = buildData.concat(Array
            .from({ length: 4 })
            .map((_, key) => [(+(center.div(key + 1)).minus(center.div(5)).toFixed(8)), '0'])
            .reverse());
          buildData = buildData.concat(Array
            .from({ length: 4 })
            .map((_, key) => [(+(center.div(key + 1)).plus(center).toFixed(8)), '0']).reverse());
        } else {
          buildData = Array.from({ length: 22 }).map((_, key) => [key / 10, 0]);
        }

        console.log(buildData, '___buildData23');
        const dec = fixedByPriceChart(+this.getCenterPrice, this.zoomType);
        (this.$refs?.zapinChart as any)!.updateSeries([{
          data: buildData,
        }], false, true);

        (this.$refs?.zapinChart as any)?.updateOptions(
          {
            xaxis: {
              labels: {
                formatter(value: number) {
                  if (value === 0) return '0';
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
      } else {
        let buildData: any = [];
        const center = new BN(this.getCenterPrice);
        // building data before and after center
        buildData = buildData.concat(Array
          .from({ length: 4 })
          .map((_, key) => [(+(center.div(key + 1)).minus(center.div(5)).toFixed(8)), '0'])
          .reverse());
        buildData = buildData.concat(Array
          .from({ length: 4 })
          .map((_, key) => [(+(center.div(key + 1)).plus(center).toFixed(8)), '0']).reverse());

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
      const dec = fixedByPriceChart(+this.getCenterPrice, this.zoomType);

      if (this.zoomType === 1) {
        this.initBuildData();
        return;
      }

      if (this.zoomType === 2) {
        minVal = new BN(this.getCenterPrice).times(0.8).toFixed(dec);
        maxVal = new BN(this.getCenterPrice).times(1.2).toFixed(dec);
      }
      if (this.zoomType === 3) {
        minVal = new BN(this.getCenterPrice).times(0.99).toFixed(dec);
        maxVal = new BN(this.getCenterPrice).times(1.01).toFixed(dec);
      }
      if (this.zoomType === 4) {
        minVal = new BN(this.getCenterPrice).times(0.999).toFixed(dec);
        maxVal = new BN(this.getCenterPrice).times(1.001).toFixed(dec);
      }
      if (this.zoomType === 5) {
        minVal = new BN(this.getCenterPrice).times(0.9995).toFixed(dec);
        maxVal = new BN(this.getCenterPrice).times(1.0005).toFixed(dec);
      }

      // console.log(dec, '__this.lowPoolPrice');
      // console.log(this.getCenterPrice, '__this.this.getCenterPrice');
      // console.log(minVal, maxVal, this.zoomType, '__ARGS');
      const buildData = createScaledArray(Number(minVal), Number(maxVal), dec);

      if (buildData?.length === 0) return;

      (this.$refs?.zapinChart as any)!.updateSeries([{
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
                  return num.modulo(modulo).toNumber() === 0 ? value.toFixed(modulo === 0.0002 ? dec : 2) : '';
                }

                return value.toFixed(dec);
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
        this.minPrice = new BN(tickNum)
          .div(10 ** this.pairTokensData[1].decimals).toFixed(this.lowPoolPrice ? 6 : 0);
      } else {
        this.tickLeft = new BN(this.tickLeft).plus(this.tickSpace).toFixed();
        const tickNum = await this.zapContract.tickToPrice(this.zapPool.address, this.tickLeft);
        this.minPrice = new BN(tickNum)
          .div(10 ** this.pairTokensData[1].decimals).toFixed(this.lowPoolPrice ? 6 : 0);
      }

      this.debouncePriceChange(this, this.minPrice, this.maxPrice, true);
    },
    async handleRightTick(isMinus: boolean) {
      this.ticksAmount = '0';

      if (isMinus) {
        this.tickRight = new BN(this.tickRight).minus(this.tickSpace).toFixed();
        const tickNum = await this.zapContract.tickToPrice(this.zapPool.address, this.tickRight);
        this.maxPrice = new BN(tickNum.toString())
          .div(10 ** this.pairTokensData[1].decimals).toFixed(this.lowPoolPrice ? 6 : 0);
      } else {
        this.tickRight = new BN(this.tickRight).plus(this.tickSpace).toFixed();
        const tickNum = await this.zapContract.tickToPrice(this.zapPool.address, this.tickRight);
        this.maxPrice = new BN(tickNum.toString())
          .div(10 ** this.pairTokensData[1].decimals).toFixed(this.lowPoolPrice ? 6 : 0);
      }

      this.debouncePriceChange(this, this.minPrice, this.maxPrice, true);
    },
    selectEvent(e: any, o: any) {
      if (this.reverseTriggered || this.pricesLoading) return;
      const decimals = this.reversePrice ? 6 : 2;
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
    debouncePriceChange: debounce(async (
      self: any,
      minPriceVal: string,
      maxPriceVal: string,
      skipLoading?: boolean,
    ) => {
      const minPrice = new BN(minPriceVal).times(10 ** self.pairTokensData[1].decimals).toFixed(0);
      const maxPrice = new BN(maxPriceVal).times(10 ** self.pairTokensData[1].decimals).toFixed(0);

      // loading need, when we converting front price to real contract ticks
      if (!skipLoading) {
        self.isLoading = true;

        const [leftTick, rightTick] = await self.zapContract
          .priceToClosestTick(self.zapPool.address, [minPrice, maxPrice]);

        const minPriceTickPrice = await self.zapContract
          .tickToPrice(self.zapPool.address, leftTick);
        const maxPriceTickPrice = await self.zapContract
          .tickToPrice(self.zapPool.address, rightTick);

        const decimals = self.lowPoolPrice ? 6 : 0;

        console.log(minPriceTickPrice, maxPriceTickPrice, '__minPrice');
        console.log(self.pairTokensData, '__minPrice');
        self.tickLeft = leftTick;
        self.tickRight = rightTick;
        self.minPrice = new BN(minPriceTickPrice?.toString())
          .div(10 ** self.pairTokensData[1].decimals).toFixed(decimals);
        self.maxPrice = new BN(maxPriceTickPrice?.toString())
          .div(10 ** self.pairTokensData[1].decimals).toFixed(decimals);
        self.isLoading = false;
        console.log('__minPrice');
      }

      self.$emit('set-range', {
        ticks: [self.tickLeft?.toString(), self.tickRight?.toString()],
      });

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
    setMinPrice(val: string) {
      this.minPrice = val;
      this.debouncePriceChange(this, val, this.maxPrice, true);
    },
    setMaxPrice(val: string) {
      this.maxPrice = val;
      this.debouncePriceChange(this, this.minPrice, val, true);
    },
    async setRange(val: number, isTick: boolean) {
      let tickVal = isTick ? val : 0;
      this.pricesLoading = true;

      try {
        if (!isTick) {
          const percentMinPrice = new BN(this.centerPrice)
            .times((100 + val) / 100)
            .times(10 ** this.getFirstDecimal).toFixed(0);
          const percentMaxPrice = new BN(this.centerPrice)
            .times((100 - val) / 100)
            .times(10 ** this.getFirstDecimal).toFixed(0);

          const ticks = await this.zapContract
            .priceToClosestTick(this.zapPool.address, [percentMinPrice, percentMaxPrice]);

          tickVal = Number(new BN(this.centerTick).minus(ticks[1]).toFixed(0));
          tickVal = Number(new BN(tickVal).div(this.tickSpace).toFixed(0)) * Number(this.tickSpace);
        }

        if (tickVal === 1 && isTick) {
          this.tickLeft = this.closestTicks[0]?.toString();
          this.tickRight = this.closestTicks[1]?.toString();
        } else {
          const leftTick = new BN(this.centerTick).minus(tickVal / 2).toFixed(0);
          const rightTick = new BN(this.centerTick).plus(tickVal / 2).toFixed(0);

          this.tickLeft = new BN(
            Math.round(new BN(leftTick).div(this.tickSpace).toNumber()),
          ).times(this.tickSpace).toString();

          this.tickRight = new BN(
            Math.round(new BN(rightTick).div(this.tickSpace).toNumber()),
          ).times(this.tickSpace).toString();
        }

        const tickNumL = await this.zapContract.tickToPrice(this.zapPool.address, this.tickLeft);
        this.minPrice = new BN(tickNumL.toString())
          .div(10 ** this.getFirstDecimal).toFixed(this.lowPoolPrice ? 8 : 0);
        const tickNumR = await this.zapContract.tickToPrice(this.zapPool.address, this.tickRight);
        this.maxPrice = new BN(tickNumR.toString())
          .div(10 ** this.getFirstDecimal).toFixed(this.lowPoolPrice ? 8 : 0);
        this.ticksAmount = val.toString();

        console.log(this.tickLeft, '__this.tickLeft');
        console.log(this.tickRight, '__this.tickRight');
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

        this.$emit('set-range', {
          ticks: [this.tickLeft?.toString(), this.tickRight?.toString()],
        });

        this.pricesLoading = false;
      } catch (e) {
        this.pricesLoading = false;
      }
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
  max-height: 300px;
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

.zapin-v3__clicker--dis {
  opacity: .5;
  pointer-events: none;
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
  position: relative;
  height: 100%;
}

.zapin-v3__chart-range__apex {
  min-height: 250px;
}

.zapin-v3__loader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}

.zapin-v3__blocker {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
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

.zapin-v3__chart-head__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.row-icon {
  margin-right: 8px;
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
