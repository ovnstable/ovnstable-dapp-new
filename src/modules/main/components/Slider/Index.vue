<template>
  <div class="slider">
    <div
      v-if="currentIndex > 0"
      class="slider__arrow-wrapper"
      @click="prevSlide"
      @keydown.enter="prevSlide"
      tabindex="0"
    >
      <BaseIcon
        name="arrowLeft"
        path="assets/icons/arrows/IconArrowLeft.vue"
        class="slider__arrow-icon"
      />
    </div>
    <swiper
      :slides-per-view="1"
      :space-between="0"
    >
      <swiper-slide
        v-for="(slide, index) in [slides[currentIndex]]"
        :key="index"
      >
        <div class="slider__info">
          <div class="slider__token-plus-overview">
            <BaseIcon
              name={{slide.iconFirstToken}}
              :path="slide.iconPathFirstToken"
            />
            <p class="slider__token-plus-title">{{ slide.titleFirstToken }}</p>
            <p class="slider__overview-title">OVERVIEW</p>
          </div>
          <div class="slider__divider" />
          <div class="slider__data">
            <div class="slider__apy-info">
              <p class="slider__apy-title">Average APY:</p>
              <div class="slider__apy-numbers">
                <p class="slider__data-total-number">{{slide.apyPercent }}<span class="slider__data-apy-percent">%</span></p>
                <p class="slider__data-growth-number">+{{slide.apyGrowth }}%</p>
              </div>
            </div>
            <div class="slider__tvl-info">
              <p class="slider__tvl-title">TVL:</p>
              <div class="slider__tvl-numbers">
                <p class="slider__data-total-number">{{slide.tvlM }} <span class="slider__data-tvl-millions">m</span></p>
                <p class="slider__data-growth-number">+{{slide.tvlGrowth }}%</p>
              </div>
            </div>
            <div class="slider__payout-info">
              <p class="slider__payout-title">Last payout:</p>
              <div class="slider__payout-numbers">
                <p class="slider__data-total-number">{{slide.lastPayoutTime }}</p>
                <p class="slider__data-growth-number">{{slide.lastPayoutText }}</p>
              </div>
            </div>
          </div>
          <div class="slider__divider" />
          <div class="slider__wusd-plus-overview">
            <div class="slider__wusd-plus-title">
              <BaseIcon
                name={{slide.iconSecondToken}}
                :path="slide.iconPathSecondToken"
              />
              <p class="slider__wusd-plus-title-text">{{slide.titleSecond }}</p>
            </div>
            <p class="slider__wusd-plus-description">{{ slide.descriptionSecondToken }}</p>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div
      v-if="currentIndex < slides.length - 1"
      class="slider__arrow-wrapper"
      @click="nextSlide"
      @keydown.enter="nextSlide"
      tabindex="0"
    >
      <BaseIcon
        name="arrowRight"
        path="assets/icons/arrows/IconArrowRight.vue"
        class="slider__arrow-icon"
      />
    </div>
  </div>
</template>
<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper.min.css';

export default {
  components: {
    BaseIcon,
    Swiper,
    SwiperSlide,
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
          lastPayoutText: '3 hours ago',
          iconSecondToken: 'WusdPlus',
          iconPathSecondToken: 'assets/icons/currencies/WusdPlus.vue',
          titleSecond: 'WUSD+_2',
          descriptionSecondToken: 'Just text _ 2',
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
          lastPayoutText: '0 hours ago',
          iconSecondToken: 'WusdPlus',
          iconPathSecondToken: 'assets/icons/currencies/WusdPlus.vue',
          titleSecond: 'WUSD+_3',
          descriptionSecondToken: 'Just another text _ 3',
        },
      ],
    };
  },
  methods: {
    nextSlide() {
      if (this.currentIndex < this.slides.length - 1) {
        this.currentIndex += 1;
      }
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
      }
    },
  },

  name: 'MainSlider',
};
</script>

<style scoped>

* {
    color: var(--color-dark-grey);
    font-weight: 500;
    font-size: 14px
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

.slider__token-plus-overview,
.slider__wusd-plus-title {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.slider__token-plus-title,
.slider__wusd-plus-title-text {
    margin-left: 10px;
    font-size: 20px;
}

.slider__token-plus-title,
.slider__overview-title {
    color: var(--color-black);
    font-weight: 600;
}

.slider__overview-title {
    margin-left: auto;
    font-size: 16px;
}

.slider__divider {
  margin-top: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--color-dark-grey);
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

.slider__wusd-plus-overview {
    display: flex;
    flex-direction: column;
}

.slider__wusd-plus-title-text {
    margin-left:10px;
    color: var(--color-black);
    font-size: 20px;
    font-weight: 600;
}

.slider__wusd-plus-description {
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
  background-color: #b2b8c6;
}

@media (max-width: 1024px) {
    .slider__info {
       max-width:200px;
       margin-right: 20px;
       margin-left: 20px;
    }
    .slider__icon-plus,
    .slider__arrow-icon {
        transform: scale(0.8);
    }

    .slider__token-plus-title,
    .slider__wusd-plus-title-text{
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
    .slider__icon-plus,
    .slider__arrow-icon {
        transform: scale(0.6);
    }

    .slider__token-plus-title,
    .slider__wusd-plus-title-text{
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
      width: 20px;
      height: 20px;
    }
}

@media (max-width: 576px) {
    .slider__info {
       max-width:100px;
       margin-right: 10px;
       margin-left: 10px;
    }
    .slider__token-plus-title{
        margin-right: 1px;
    }
    .slider__icon-plus,
    .slider__arrow-icon {
        transform: scale(0.5);
    }
    .slider__token-plus-title,
    .slider__wusd-plus-title-text{
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
