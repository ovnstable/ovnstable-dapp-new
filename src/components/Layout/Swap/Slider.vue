<template>
  <div class="slider">
    <IconArrowLeft class="slider__arrow-icon arrow-left" />
    <div class="slider__info">
      <div class="slider__usd-plus-overview">
        <IconUsdPlus />
        <p class="slider__usd-plus-title">USD+</p>
        <p class="slider__overview-title">OVERVIEW</p>
      </div>
      <div class="slider__divider" />
      <div class="slider__data">
        <div class="slider__apy-info">
          <p>Average APY:</p>
          <div class="slider__apy-numbers">
            <p class="slider__data-total-number">10.4<span class="slider__data-apy-percent">%</span></p>
            <p class="slider__data-growth-number">+5%</p>
          </div>
        </div>
        <div class="slider__tvl-info">
          <p>TVL:</p>
          <div class="slider__tvl-numbers">
            <p class="slider__data-total-number">5.3 <span>m</span></p>
            <p class="slider__data-growth-number">+1%</p>
          </div>
        </div>
        <div class="slider__payout-info">
          <p>Last payout:</p>
          <div class="slider__payout-numbers">
            <p class="slider__data-total-number">05:02</p>
            <p class="slider__data-growth-number">hours ago</p>
          </div>
        </div>
      </div>
      <div class="slider__divider" />
      <div class="slider__wusd-plus-overview">
        <div class="slider__wusd-plus-title">
          <IconWusdPlus />
          <p class="slider__wusd-plus-title-text">WUSD+</p>
        </div>
        <p class="slider__wusd-plus-description">An index-adjusted wrapper for USD+. Your wUSD+ balance won't increase over time. When wUSD+ will unwrap you receive USD+ based on the latest index.</p>
      </div>
    </div>
    <IconArrowRight class="slider__arrow-icon arrow-right" />
  </div>
</template>
<script lang="ts">

import IconUsdPlus from '@/assets/icons/plusTokens/IconUsdPlus.vue';
import IconWusdPlus from '@/assets/icons/plusTokens/IconWusdPlus.vue';
import IconArrowLeft from '@/assets/icons/arrows/IconArrowLeft.vue';
import IconArrowRight from '@/assets/icons/arrows/IconArrowRight.vue';

export default {
  components: {
    IconUsdPlus,
    IconWusdPlus,
    IconArrowLeft,
    IconArrowRight,
  },
  name: 'SliDer',
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
    margin-top: 74px;
    background: white;
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
    margin-right: 95px;
    font-size: 20px;
}

.slider__usd-plus-title,
.slider__overview-title {
    color: var(--1, #0F172A);
    font-weight: 600;
}

.slider__overview-title {
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

</style>
