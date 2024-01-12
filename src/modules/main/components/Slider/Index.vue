<template>
  <div class='slider'>
    <div
      :class="[
        'slider__arrow-wrapper',
        {
          'dark-theme-arrow-wrapper': isDarkTheme,
          'slider__arrow-disabled': currentIndex === 0,
        },
      ]"
      @click="currentIndex > 0 && prevSlide()"
      @keydown.enter="currentIndex > 0 && prevSlide()"
      tabindex="0"
    >
      <BaseIcon
        name="arrowLeft"
        path="assets/icons/common/ArrowLeft.vue"
        class="slider__arrow-icon"
        :fillColor="fillColorArrow"
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
          v-for="(slide, index) in slides"
          :key="index"
        >
          <div class="slider__info">
            <div class="slider__token-overview">
              <BaseIcon
                name={{slide.iconFirstToken}}
                :path="slide.iconPathFirstToken"
              />
              <p :class="['slider__token-title', { 'dark-theme-token-title': isDarkTheme }]">
                {{ slide.titleFirstToken }}
              </p>
              <p :class="['slider__overview-title', { 'dark-theme-overview-title': isDarkTheme }]">
                OVERVIEW
              </p>
            </div>
            <div class="slider__divider" />
            <div class="slider__data">
              <div class="slider__apy-info">
                <p :class="['slider__apy-title', { 'dark-theme-apy-title': isDarkTheme }]">
                  Average APY:
                </p>
                <div class="slider__apy-numbers">
                  <p :class="['slider__data-total-number', { 'dark-theme-data-total-number': isDarkTheme }]">
                    {{ slide.apyPercent }}
                    <span :class="['slider__data-apy-percent', { 'dark-theme-data-apy-percent': isDarkTheme }]">%</span>
                  </p>
                  <p :class="['slider__data-growth-number', { 'dark-theme-data-growth-number': isDarkTheme }]">+{{ slide.apyGrowth }}%</p>
                </div>
              </div>
              <div class="slider__tvl-info">
                <p :class="['slider__tvl-title', { 'dark-theme-tvl-title': isDarkTheme }]">TVL:</p>
                <div class="slider__tvl-numbers">
                  <p :class="['slider__data-total-number', { 'dark-theme-data-total-number': isDarkTheme }]">
                    {{ slide.tvlM }}
                    <span :class="['slider__data-tvl-millions', { 'dark-theme-data-tvl-millions': isDarkTheme }]">m</span>
                  </p>
                  <p :class="['slider__data-growth-number', { 'dark-theme-data-growth-number': isDarkTheme }]">+{{ slide.tvlGrowth }}%</p>
                </div>
              </div>
              <div class="slider__payout-info">
                <p :class="['slider__payout-title', { 'dark-theme-payout-title': isDarkTheme }]">Last payout:</p>
                <div class="slider__payout-numbers">
                  <p :class="['slider__data-total-number', { 'dark-theme-data-total-number': isDarkTheme }]">{{ slide.lastPayoutTime }}</p>
                  <p :class="['slider__data-growth-number', { 'dark-theme-data-growth-number': isDarkTheme }]">{{ slide.lastPayoutText }}</p>
                </div>
              </div>
            </div>
            <div class="slider__divider" />
            <div class="slider__second-token-overview">
              <div class="slider__second-token-title">
                <BaseIcon
                  name={{slide.iconSecondToken}}
                  :path="slide.iconPathSecondToken"
                />
                <p
                  :class="['slider__second-token-title-text', { 'dark-theme-second-token-title-text': isDarkTheme }]"
                >
                  {{ slide.titleSecond }}
                </p>
              </div>
              <p :class="['slider__second-token-description', { 'dark-theme-second-token-description': isDarkTheme }]">{{ slide.descriptionSecondToken }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div
      :class="[
        'slider__arrow-wrapper',
        {
          'dark-theme-arrow-wrapper': isDarkTheme,
          'slider__arrow-disabled': currentIndex === slides.length - 1,
        },
      ]"
      @click="currentIndex < slides.length - 1 && nextSlide()"
      @keydown.enter="currentIndex < slides.length - 1 && nextSlide()"
      tabindex="0"
    >
      <BaseIcon
        name="arrowRight"
        path="assets/icons/common/ArrowRight.vue"
        class="slider__arrow-icon"
        :fillColor="fillColorArrow"
      />
    </div>
  </div>
</template>
<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperClass } from 'swiper/core';
import { mapState } from 'vuex';
import 'swiper/swiper.min.css';

export default {
  components: {
    BaseIcon,
    Swiper,
    SwiperSlide,
  },
  computed: {
    ...mapState({
      isDarkTheme: (state: any) => state.accountUI.isDarkTheme,
    }),
    themeClass() {
      return {
        'dark-theme': this.isDarkTheme,
        'light-theme': !this.isDarkTheme,
      };
    },
    arrowLightThemeColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-2').trim();
    },
    arrowDarkThemeColor() {
      return getComputedStyle(document.body).getPropertyValue('--color-19').trim();
    },
    fillColorArrow(): string {
      return this.isDarkTheme ? this.arrowDarkThemeColor : this.arrowLightThemeColor;
    },
  },
  data() {
    return {
      currentIndex: 0,
      slides: [
        {
          iconFirstToken: 'usdPlus',
          iconPathFirstToken: 'assets/icons/currencies/UsdPlus.vue',
          titleFirstToken: 'USD+',
          apyPercent: '10.4',
          apyGrowth: '5',
          tvlM: '5.3',
          tvlGrowth: '1',
          lastPayoutTime: '05:02',
          lastPayoutText: 'hours ago',
          iconSecondToken: 'WusdPlus',
          iconPathSecondToken: 'assets/icons/currencies/WusdPlus.vue',
          titleSecond: 'WUSD+',
          descriptionSecondToken: 'An index-adjusted wrapper for USD+. Your wUSD+ balance won\'t increase over time. When wUSD+ will unwrap, you receive USD+ based on the latest index.',
        },
        {
          iconFirstToken: 'usdPlus',
          iconPathFirstToken: 'assets/icons/currencies/UsdPlus.vue',
          titleFirstToken: 'USD+_2',
          apyPercent: '30',
          apyGrowth: '57',
          tvlM: '5.73',
          tvlGrowth: '71',
          lastPayoutTime: '057:02',
          lastPayoutText: 'hours ago',
          iconSecondToken: 'WusdPlus',
          iconPathSecondToken: 'assets/icons/currencies/WusdPlus.vue',
          titleSecond: 'WUSD+_2',
          descriptionSecondToken: 'An index-adjusted wrapper for USD+. Your wUSD+ balance won\'t increase over time. When wUSD+ will unwrap, you receive USD+ based on the latest index.',
        },
        {
          iconFirstToken: 'usdPlus',
          iconPathFirstToken: 'assets/icons/currencies/UsdPlus.vue',
          titleFirstToken: 'USD+_3',
          apyPercent: '10',
          apyGrowth: '517',
          tvlM: '15.73',
          tvlGrowth: '1',
          lastPayoutTime: '0:02',
          lastPayoutText: 'hours ago',
          iconSecondToken: 'WusdPlus',
          iconPathSecondToken: 'assets/icons/currencies/WusdPlus.vue',
          titleSecond: 'WUSD+_3',
          descriptionSecondToken: 'An index-adjusted wrapper for USD+. Your wUSD+ balance won\'t increase over time. When wUSD+ will unwrap, you receive USD+ based on the latest index.',
        },
      ],
      swiperInstance: null as SwiperClass | null,
    };
  },
  methods: {
    onSwiper(swiper: SwiperClass) {
      this.swiperInstance = swiper;
    },
    nextSlide() {
      if (this.currentIndex < this.slides.length - 1 && this.swiperInstance) {
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

  },

  name: 'MainSlider',
};
</script>

<style scoped>

* {
    color: var(--color-2);
    font-weight: 500;
    font-size: 14px;
    transition: color 0.15s ease;
}

.slider {
    margin-right: 53px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.slider__info {
    max-width:283px;
    margin-left: 25px;
    margin-right: 25px;
    display: flex;
    flex-direction: column;
}

.swiper-container {
  max-width: 283px;
}

.slider__token-overview,
.slider__second-token-title {
    display: flex;
    flex-direction: row;
    align-items: center;
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
}

.slider__overview-title {
    margin-left: auto;
    font-size: 16px;
}

.slider__divider {
  margin-top: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--color-2);
}

.slider__apy-info,
.slider__tvl-info,
.slider__payout-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.slider__tvl-info {
    margin-top: 10px;
    margin-bottom: 10px;
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
}

.slider__second-token-description {
    margin-top: 10px;
    text-align: justify;
    font-weight: 400;
    line-height: 18px;
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
  transition: background-color 0.15s ease;
  background-color: #b2b8c6;
}
.arrow-wrapper {
  transition: background-color 0.15s ease;
}
.slider__arrow-disabled {
  opacity: 0.4;
  pointer-events: none;
  cursor: default;
}
.dark-theme-token-title,
.dark-theme-overview-title,
.dark-theme-second-token-title-text {
  color: var(--color-5);
  transition: color 0.15s ease;
}

.dark-theme-apy-title,
.dark-theme-data-apy-percent,
.dark-theme-data-total-number,
.dark-theme-data-growth-number,
.dark-theme-tvl-title,
.dark-theme-data-tvl-millions,
.data-growth-number,
.dark-theme-payout-title,
.dark-theme-second-token-description {
  color: var(--color-19);
  transition: color 0.15s ease;
}

.dark-theme-arrow-wrapper:hover {
  background-color: var(--color-21);
  transition: background-color 0.15s ease;
}
.dark-theme-arrow-wrapper {
  transition: background-color 0.15s ease;;
}
@media (max-width: 1024px) {
    .slider__info {
       max-width:200px;
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

@media (max-width: 768px) {
    .slider__info {
       max-width:150px;
       margin-right: 15px;
       margin-left: 15px;
    }
    .swiper-container {
  max-width: 150px;
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

@media (max-width: 576px) {
    .slider__info {
       max-width:100px;
       margin-right: 10px;
       margin-left: 10px;
    }
    .swiper-container {
      max-width: 100px;
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

</style>
