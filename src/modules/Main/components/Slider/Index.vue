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
          v-for="(slide, index) in sliderData"
          :ref="slideRef"
          :swiper-ref="swiperInstance"
          :key="index"
        >
          <div class="slider__info">
            <div class="slider__token-overview">
              <BaseIcon
                class="slider__token-image"
                :name="formatFirstTokenIconName(slide.tokenName)"
              />
              <p class="slider__token-title">{{ slide.tokenName }}</p>
              <p class="slider__overview-title">OVERVIEW</p>
            </div>
            <div class="slider__divider" />
            <div class="slider__data">
              <div class="slider__apy-info">
                <p class="slider__apy-title">Average APY:</p>
                <div class="slider__apy-numbers">
                  <p class="slider__data-total-number">{{ slide.apy }}<span class="slider__data-apy-percent">%</span></p>
                  <p class="slider__data-growth-number">+{{ slide.apyGrowth }}%</p>
                </div>
              </div>
              <div class="slider__tvl-info">
                <p class="slider__tvl-title">TVL:</p>
                <div class="slider__tvl-numbers">
                  <p class="slider__data-total-number">
                    {{ slide.tokenName === 'ETH+' ? slide.tvl : ((slide.tvl / 1e6).toFixed(2)) }}
                    <span
                      v-if="slide.tokenName !== 'ETH+'"
                      class="slider__data-tvl-millions"
                    >m</span>
                    <span
                      v-else
                      class="slider__data-tvl-millions"
                    >WETH</span>
                  </p>
                  <p class="slider__data-growth-number">+{{ slide.tvlGrowth }}%</p>
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
                <BaseIcon
                  class="slider__token-image"
                  :name="formatSecondTokenIconName(slide.tokenName)"
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
        name="ArrowRight"
        class="slider__arrow-icon"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from 'vue';

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperClass } from 'swiper/core';
import Spinner from '@/components/Spinner/Index.vue';
import 'swiper/swiper.min.css';

export default {
  name: 'MainSlider',
  components: {
    BaseIcon,
    Swiper,
    SwiperSlide,
    Spinner
  },
  data() {
    return {
      currentIndex: 0,
      slideRef: ref(null) as any,
      swiperInstance: null as any,
    };
  },
  props: {
    sliderData: {
      type: Object,
      default: () => ({}),
    },
    sliderLoaded: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onSwiper(swiper: SwiperClass) {
      this.swiperInstance = swiper;
    },
    nextSlide() {
      if (this.currentIndex < this.sliderData.length - 1 && this.swiperInstance) {
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

    formatFirstTokenIconName(tokenName: string) {
      return `${tokenName.slice(0, -1).toLowerCase()}Plus`;
    },
    formatSecondTokenIconName(tokenName: string) {
      const formattedName = tokenName.slice(0, -1);
      return `w${formattedName.charAt(0).toUpperCase()}${formattedName.slice(1).toLowerCase()}Plus`;
    },

  },
};
</script>

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
  svg {
    width: 40px;
    height: 40px;
  }
}

.slider__loader {
  position: absolute;
  left: 450px;
  top: 60px;
  margin: auto;
  height: 100%;
  width: 100%;
  min-height: 474px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 50vh;
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
