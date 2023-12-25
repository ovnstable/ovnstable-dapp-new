<template>
  <div class="slider">
    <IconArrowLeft class="slider__arrow-icon arrow-left" />
    <div class="slider__info">
      <div class="slider__usd-plus-overview">
        <BaseIcon
          name="usdPlus"
          path="assets/icons/currencies/UsdPlus.vue"
        />
        <p class="slider__usd-plus-title">USD+</p>
        <p class="slider__overview-title">OVERVIEW</p>
      </div>
      <div class="slider__divider" />
      <div class="slider__data">
        <div class="slider__apy-info">
          <p class="slider__apy-title">Average APY:</p>
          <div class="slider__apy-numbers">
            <p class="slider__data-total-number">10.4<span class="slider__data-apy-percent">%</span></p>
            <p class="slider__data-growth-number">+5%</p>
          </div>
        </div>
        <div class="slider__tvl-info">
          <p class="slider__tvl-title">TVL:</p>
          <div class="slider__tvl-numbers">
            <p class="slider__data-total-number">5.3 <span class="slider__data-tvl-millions">m</span></p>
            <p class="slider__data-growth-number">+1%</p>
          </div>
        </div>
        <div class="slider__payout-info">
          <p class="slider__payout-title">Last payout:</p>
          <div class="slider__payout-numbers">
            <p class="slider__data-total-number">05:02</p>
            <p class="slider__data-growth-number">hours ago</p>
          </div>
        </div>
      </div>
      <div class="slider__divider" />
      <div class="slider__wusd-plus-overview">
        <div class="slider__wusd-plus-title">
          <BaseIcon
            name="WusdPlus"
            path="assets/icons/currencies/WusdPlus.vue"
          />
          <p class="slider__wusd-plus-title-text">WUSD+</p>
        </div>
        <p class="slider__wusd-plus-description">An index-adjusted wrapper for USD+. Your wUSD+ balance won't increase over time. When wUSD+ will unwrap you receive USD+ based on the latest index.</p>
      </div>
    </div>
    <IconArrowRight class="slider__arrow-icon arrow-right" />
  </div>
</template>
<script lang="ts">

import IconArrowLeft from '@/assets/icons/arrows/IconArrowLeft.vue';
import IconArrowRight from '@/assets/icons/arrows/IconArrowRight.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  components: {
    BaseIcon,
    IconArrowLeft,
    IconArrowRight,
  },
  name: 'MainSlider',
};
</script>

<style scoped>

* {
    color: var(--2, #687386);
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

.slider__usd-plus-overview,
.slider__wusd-plus-title {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.slider__usd-plus-title,
.slider__wusd-plus-title-text {
    margin-left: 10px;
    font-size: 20px;
}

.slider__usd-plus-title,
.slider__overview-title {
    color: var(--1, #0F172A);
    font-weight: 600;
}

.slider__overview-title {
    margin-left: auto;
    font-size: 16px;
}

.slider__divider {
  margin-top: 16px;
  margin-bottom: 16px;
  border: 1px solid #687386;
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
    color: var(--1, #0F172A);
    font-size: 20px;
    font-weight: 600;
}

.slider__wusd-plus-description {
    margin-top: 10px;
    text-align: justify;
    font-weight: 400;
    line-height: 18px;
}

.slider__arrow-icon {
  transition: transform 0.15s ease;
  cursor: pointer;
}

.arrow-left:hover {
  transform: translateX(-5px);
}

.arrow-right:hover {
  transform: translateX(5px);
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

    .slider__usd-plus-title,
    .slider__wusd-plus-title-text{
        margin-left: 5px;
        font-size: 16px;
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

    .slider__usd-plus-title,
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
}

@media (max-width: 576px) {
    .slider__info {
       max-width:100px;
       margin-right: 10px;
       margin-left: 10px;
    }
    .slider__usd-plus-title{
        margin-right: 1px;
    }
    .slider__icon-plus,
    .slider__arrow-icon {
        transform: scale(0.5);
    }
    .slider__usd-plus-title,
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
}

</style>
