<template>
  <div
    v-if="!sliderLoaded"
    class="slider__loader"
  >
    <Spinner />
  </div>
  <div
    v-else
    class="swap-slider"
  >
    <div
      class="slider__arrow-wrapper"
      :class="{ 'slider__arrow-disabled': currentIndex === 0 }"
      @click="currentIndex > 0 && prevSlide()"
      @keydown.enter="currentIndex > 0 && prevSlide()"
      tabindex="0"
    >
      <BaseIcon
        v-if="!deviceSize.isMobile"
        class="slider__arrow-icon"
        name="ArrowLeft"
      />
    </div>

    <div class="swiper-container">
      <swiper
        :slides-per-view="1"
        :space-between="0"
        @swiper="onSwiper"
        @transitionEnd="handleSlideChange"
        ref="mySwiper"
      >
        <swiper-slide
          :ref="slideRef"
          :swiper-ref="swiperInstance"
          v-if="networkName === 'blast'"
        >
          <div class="slider-info-blast">
            <div
              class="slider-info-blast-points"
            >
              <p>BLAST POINTS:
                <span
                  v-if="!jackpotDataLoaded"
                  class="spinner-container"
                >
                  <Spinner />
                </span>
                <span v-else>
                  {{ jackpotData }}
                </span>
              </p>
            </div>
            <div class="slider-info-blast-lootbox">
              <p>BLAST LOOTBOX AIRDROP <br>
                Do daily tasks and win lootbox!</p>
              <div class="slider-info-blast-lootbox-start">
                <img
                  alt="SlothBlastQuest"
                  :src="getImageUrl(`assets/blastQuest/SlothBlastQuest.png`)"
                />
                <router-link
                  to="/blastquest"
                >
                  <ButtonComponent>
                    START
                  </ButtonComponent>

                </router-link>
              </div>

            </div>
          </div>
        </swiper-slide>
        <swiper-slide
          v-for="(slide, index) in sliderData"
          :ref="slideRef"
          :swiper-ref="swiperInstance"
          :key="index"
        >
          <div class="slider__info">
            <div class="slider__token-overview">
              <img
                class="slider__token-image"
                :src="getImageSrc(slide.tokenName, 1)"
                :alt="formatSecondTokenIconName(slide.tokenName)"
              />
              <p class="slider__token-title">{{ slide.tokenName }}</p>
              <p class="slider__overview-title">OVERVIEW</p>
            </div>
            <div
              class="slider__divider"
              :class="{ 'mobile-divider': deviceSize.isMobile }"
            />
            <div class="slider__data">
              <div class="slider__apy-info">
                <p class="slider__apy-title">Average APY:</p>
                <div class="slider__apy-numbers">
                  <p class="slider__data-total-number">{{ slide.apy }}<span class="slider__data-apy-percent">%</span></p>
                </div>
              </div>
              <div class="slider__tvl-info">
                <p class="slider__tvl-title">TVL:</p>
                <div class="slider__tvl-numbers">
                  <p class="slider__data-total-number">
                    {{ slide.tokenName === 'ETH+' ? slide.tvl : ((Number(slide.tvl) / 1e6).toFixed(2)) }}
                    <span
                      v-if="slide.tokenName !== 'ETH+'"
                      class="slider__data-tvl-millions"
                    >m</span>
                    <span
                      v-else
                      class="slider__data-tvl-millions"
                    >WETH</span>
                  </p>
                </div>
              </div>
              <div class="slider__payout-info">
                <p class="slider__payout-title">Last payout:</p>
                <div class="slider__payout-numbers">
                  <p class="slider__data-total-number">{{ slide.payoutAgoTime }}</p>
                  <p class="slider__data-growth-number">{{ slide.payoutAgoText }}</p>
                </div>
              </div>
            </div>
            <div class="slider__divider" />
            <div class="slider__second-token-overview">
              <div class="slider__second-token-title">
                <img
                  class="slider__token-image"
                  :src="getImageSrc(slide.tokenName, 2)"
                  :alt="formatSecondTokenIconName(slide.tokenName)"
                />
                <p class="slider__second-token-title-text">{{ slide.tokenWrappedName }}</p>
              </div>
              <p class="slider__second-token-description">{{ slide.description }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div
      class="slider__arrow-wrapper"
      :class="{ 'slider__arrow-disabled': currentIndex === sliderData.length - 1 }"
      @click="currentIndex < sliderData.length - 1 && nextSlide()"
      @keydown.enter="currentIndex < sliderData.length - 1 && nextSlide()"
      tabindex="0"
    >
      <BaseIcon
        v-if="!deviceSize.isMobile"
        name="ArrowRight"
        class="slider__arrow-icon"
      />
    </div>
  </div>
  <div class="slider__pagination">
    <div
      class="slider__dot"
      v-for="index in sliderData.length"
      :key="index"
      :class="{ 'slider__dot--active': currentIndex === index - 1 }"
      @click="goToSlide(index - 1)"
      @keydown.enter="goToSlide(index - 1)"
      tabindex="0"
    />
  </div>
</template>
<script lang="ts">
import { ref } from 'vue';

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperClass } from 'swiper/core';
import { deviceType } from '@/utils/deviceType.ts';
import { mapGetters } from 'vuex';
import Spinner from '@/components/Spinner/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import SliderApiService from '@/services/slider-api-service.ts';
import 'swiper/swiper.min.css';
import { getImageUrl } from '@/utils/const.ts';

interface SlideData {
  tokenName: string;
  tokenWrappedName: string;
  apy: string;
  apyGrowth?: string;
  tvl: string;
  tvlGrowth?: string;
  payoutAgoTime: string;
  payoutAgoText: string;
  description: string;
}
const sliderDescriptionForWrapped = (tokenName: string) => `An index-adjusted wrapper for ${tokenName}
. Your w${tokenName} balance won't increase over time
. When w${tokenName} will unwrap, you receive ${tokenName} based on the latest index.`;

export default {
  name: 'MainSlider',
  components: {
    BaseIcon,
    Swiper,
    SwiperSlide,
    Spinner,
    ButtonComponent,
  },
  data() {
    return {
      currentIndex: 0,
      slideRef: ref(null) as any,
      swiperInstance: null as any,
      sliderData: [] as SlideData[],
      sliderLoaded: false,
    };
  },
  async mounted() {
    this.sliderLoaded = false;
    await this.loadDataSlider();
    this.sliderLoaded = true;
  },
  computed: {
    ...mapGetters('network', ['networkName']),
    ...mapGetters('jackpotData', ['jackpotData', 'jackpotDataLoaded']),
    deviceSize() {
      return deviceType();
    },
  },
  methods: {
    getImageUrl,
    async loadDataSlider() {
      try {
        const nameApyData = await SliderApiService.loadApyName();
        const tvlData = await SliderApiService.loadTVL();

        const products = Object.keys(nameApyData).filter((key) => key.endsWith('PlusProduct'));
        const sliderDataFromLoad = products.map((productKey): SlideData | null => {
          if (nameApyData[productKey]) {
            const productType = nameApyData[productKey].productType.replace('_PLUS', '+');
            const apy = nameApyData[productKey].value;
            const lastPayout = nameApyData.lastPayoutDate;

            const lastPayoutDatetime = new Date(lastPayout);
            const now = new Date();
            const diff = now.getTime() - lastPayoutDatetime.getTime();
            const hoursAgo = diff / 3600000;
            const minutesAgo = (diff % 3600000) / 60000;

            let payoutAgoText = '';
            let payoutAgoTime = '';

            if (hoursAgo < 1) {
              payoutAgoTime = `${Math.floor(minutesAgo)}:00`;
              payoutAgoText = 'minute(s) ago';
            } else if (hoursAgo === 1) {
              payoutAgoTime = '1:00';
              payoutAgoText = 'hour ago';
            } else {
              payoutAgoTime = `${Math.floor(hoursAgo)}:${Math.floor(minutesAgo).toString().padStart(2, '0')}`;
              payoutAgoText = 'hours ago';
            }

            let totalTvl = 0;
            tvlData.forEach((chain: any) => {
              const valueObj = chain.values.find((v: any) => v.name === productType);
              if (valueObj) {
                totalTvl += valueObj.value;
              }
            });
            const description = sliderDescriptionForWrapped(productType);
            return {
              tokenName: productType,
              tokenWrappedName: `W${productType}`,
              apy: apy.toFixed(1),
              tvl: totalTvl.toFixed(2),
              payoutAgoTime,
              payoutAgoText,
              description,
            };
          }
          return null;
        }).filter(Boolean) as SlideData[];
        this.sliderData = sliderDataFromLoad;
      } catch (error) {
        console.error('Failed to fetch slider data:', error);
      }
    },
    onSwiper(swiper: SwiperClass) {
      this.swiperInstance = swiper;
    },
    nextSlide() {
      if (this.currentIndex < Object.keys(this.sliderData).length - 1 && this.swiperInstance) {
        this.currentIndex += 1;
        this.swiperInstance.slideTo(this.currentIndex);
      }
    },
    prevSlide() {
      if (this.currentIndex > 0 && this.swiperInstance) {
        this.currentIndex -= 1;
        this.swiperInstance.slideTo(this.currentIndex);
      }
    },

    handleSlideChange() {
      if (this.swiperInstance) {
        this.currentIndex = this.swiperInstance.realIndex;
      }
    },
    goToSlide(index: any) {
      if (this.swiperInstance) {
        this.currentIndex = index;
        this.swiperInstance.slideTo(index);
      }
    },

    formatFirstTokenIconName(tokenName: string) {
      return `${tokenName.slice(0, -1).toLowerCase()}Plus`;
    },
    formatSecondTokenIconName(tokenName: string) {
      const formattedName = tokenName.slice(0, -1);
      return `w${formattedName.charAt(0).toUpperCase()}${formattedName.slice(1).toLowerCase()}Plus`;
    },
    getImageSrc(tokenName: string, numberOfToken: number) {
      const iconName = numberOfToken === 1 ? this
        .formatFirstTokenIconName(tokenName) : this.formatSecondTokenIconName(tokenName);
      return getImageUrl(`assets/icons/currencies/main/${iconName}.svg`);
    },
    getImageUrlSlider(addr: string) {
      return getImageUrl(addr);
    },
  },
};
</script>

<style>
.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style lang='scss' scoped>

* {
  color: var(--color-2);
  font-weight: 500;
  font-size: 14px;
  [data-theme="dark"] & {
    color: var(--color-4)
  }
}

.swap-slider {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 50px 40px 50px auto;
  @media (max-width: 1200px) {
    width: 30%;
    margin: 20px 10px 20px auto;
  }
  @media (max-width: 1024px) {
    width: 30%;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 30px auto;
    padding: 30px 20px;
    background-color: var(--color-8);
    border-radius: 30px;
    [data-theme="dark"] & {
      background-color: var(--color-6);
    }
  }
}

.slider__info {
  margin-left: 25px;
  margin-right: 25px;
  display: flex;
  flex-direction: column;
  @media (min-width: 1024px) and (max-width: 1100px) {
    max-width: 180px;
  }
}

.swiper-container {
  max-width: 280px;
}

.slider__token-overview,
.slider__second-token-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  @media (min-width: 1024px) and (max-width: 1100px)  {
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
}

.slider__token-title,
.slider__second-token-title-text {
  margin-left: 10px;
  font-size: 20px;
}

.slider__token-title,
.slider__overview-title {
  color: var(--color-1);
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.slider__overview-title {
  margin-left: auto;
  font-size: 16px;
}

.slider__divider {
  margin-top: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--color-2);
  [data-theme="dark"] & {
    border-color: var(--color-2)
  }
}

.slider__data p,
.slider__data-apy-percent,
.slider__data-tvl-millions {
  [data-theme="dark"] & {
    color: var(--color-18)
  }
}

.slider__apy-info,
.slider__tvl-info,
.slider__payout-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.slider__apy-info {
  margin-top: 4px;
  margin-bottom: 20px;
}
.slider__payout-info {
  margin-bottom: 4px;
}

.slider__tvl-info {
  margin-top: 10px;
  margin-bottom: 20px;
}

.slider__apy-numbers,
.slider__tvl-numbers,
.slider__payout-numbers {
  display: flex;
  flex-direction: column;
}

.slider__data-total-number {
  font-size: 20px;
  text-align: right;
}

.slider__data-apy-percent {
  font-weight: 700;
}

.slider__data-growth-number {
  margin-left: auto;
}

.slider__second-token-overview {
  display: flex;
  flex-direction: column;
}

.slider__second-token-title-text {
  margin-left:10px;
  color: var(--color-1);
  font-size: 20px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.slider__second-token-description {
  margin-top: 10px;
  text-align: justify;
  font-weight: 400;
  line-height: 18px;
  [data-theme="dark"] & {
    color: var(--color-18)
  }
}

.slider__arrow-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.slider__arrow-wrapper:hover {
  background-color: #b2b8c6;
}
.slider__arrow-disabled {
  opacity: 0.4;
  pointer-events: none;
  cursor: default;
}
.slider__token-image {
  width: 40px;
  height: 40px;
  svg {
    width: 40px;
    height: 40px;
  }
}

.slider__loader {
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    margin: 40px 0;
  }
}

.slider-info-blast {
  width: 100%;
  height: 100%;
}
.slider-info-blast-points {
  background-image: url('src/assets/blastQuest/blastPointsSlider.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 20px 18px;
  border-radius: 10px;
  margin-bottom: 10px;
  max-height: 55px;
  p,span {
    font-size: 15px;
    color: var(--color-4);
  }
  p {
    display: flex;
    justify-content: space-between;
  }
}
.spinner-container {
  display: flex;
  transform: scale(0.5);
  margin-top: -24px;
  margin-right: -20px;
}

.slider-info-blast-lootbox {
  background-image: url('src/assets/blastQuest/blastLootboxSlider.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 10px;
  padding: 12px 4px;
  padding-bottom: 0;
  p {
    color: var(--color-4);
  }
}

.slider-info-blast-lootbox p:first-child {
  margin-bottom: 18px;
  line-height: 20px;
  margin-left: 12px;
}

.slider-info-blast-lootbox {
  display: flex;
  flex-direction: column;
}
.slider-info-blast-lootbox-start {
  margin-top: auto;
  display: flex;
  flex-direction: row;
  align-items: end;
  button {
    font-size: 15px;
    padding: 4px 17px;
    box-shadow: none;
    border: none;
    background-color: var(--color-1);
    margin-bottom: 14px;
    margin-right: 18px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  img {
    object-fit: contain;
    overflow: hidden;
  }
}

@media (max-width: 1024px) {
  .slider__info {
    margin-right: 20px;
    margin-left: 20px;
  }
  .swiper-container {
    max-width: 200px;
  }
  .slider__icon-plus,
  .slider__arrow-icon {
    transform: scale(0.8);
  }

  .slider__token-title,
  .slider__second-token-title-text {
    margin-left: 5px;
    font-size: 16px;
  }

  .slider__arrow-wrapper {
    width: 26px;
    height: 26px;
  }
}

@media (max-width: 1024px) {
  .slider__info {
    width: 100%;
    margin-right: 15px;
    margin-left: 15px;
  }
  .swiper-container {
    max-width: 300px;
  }
  .slider__icon-plus,
  .slider__arrow-icon {
    transform: scale(0.6);
  }

  .slider__token-title,
  .slider__second-token-title-text {
    margin-left: 0px;
    font-size: 13px;
  }

  .slider__overview-title,
  .slider__wusd-plus-description {
    font-size: 12px;
  }

  .slider__divider {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .slider__apy-title,
  .slider__tvl-title,
  .slider__payout-title,
  .slider__data-growth-number {
    font-size: 11px;
  }

  .slider__data-total-number {
    font-size: 14px;
  }

  .slider__data-apy-percent {
    font-size: 10px;
  }

  .slider__data-tvl-millions {
    font-size: 12px;
  }
  .slider__arrow-wrapper {
    width: 26px;
    height: 26px;
  }
}

@media (max-width: 640px) {
  .slider__info {
    margin-right: 10px;
    margin-left: 10px;
  }
  .swiper-container {
    max-width: 100%;
    margin: 0 20px;
}
  .slider__token-title{
    margin-right: 1px;
  }
  .slider__icon-plus,
  .slider__arrow-icon {
    transform: scale(0.5);
  }
  .slider__token-title,
  .slider__second-token-title-text {
    margin-left: 0px;
    font-size: 10px;
  }

  .slider__wusd-plus-description {
    font-size: 10px;
  }
  .slider__overview-title {
    font-size: 6px;
  }
  .slider__divider {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .slider__apy-title,
  .slider__tvl-title,
  .slider__payout-title,
  .slider__data-growth-number {
    font-size: 8px;
  }

  .slider__data-total-number {
    font-size: 12px;
  }

  .slider__data-apy-percent {
    font-size: 8px;
  }

  .slider__data-tvl-millions {
    font-size: 10px;
  }

  .slider__arrow-wrapper {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 640px) {
  .swap-slider {
    margin-bottom: 0;
    padding: 22px 10px;
  }
  .swiper-container {
    margin: 0;
  }
  .slider__token-title,
  .slider__overview-title,
  .slider__second-token-title-text {
    font-size: 16px;
  }
  .slider__data p {
    font-size: 14px;
  }

  .slider__token-overview {
    margin-bottom: 6px;
  }
  .slider__second-token-description {
    font-size: 12px;
  }
  .slider__token-title,
  .slider__second-token-title-text {
    margin-left: 10px;
  }
  .slider__divider {
    border-color: var(--color-2);
    margin: 16px 0;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
  .mobile-divider {
    display: none;
  }
  .slider__token-image {
    width: 30px;
    height: 30px;
  }
  .slider__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .slider__dot {
    width: 6px;
    height: 6px;
    margin: 0 10px;
    background-color: var(--color-6);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .slider__dot--active {
    background-color: var(--color-3);
  }
}

</style>
