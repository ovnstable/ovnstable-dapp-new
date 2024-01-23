<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div
    :class="tokenInfo.locked ? 'slider-locked' : ''"
    class="custom-slider"
  >
    <input
      :disabled="isTokenWithoutLineSlider"
      ref="slider"
      :value="sliderValue"
      @input="({ target }: any) => {
        if (tokenInfo.locked || isTokenWithoutLineSlider) return;
        if (target.value >= freeOutputTokensPercentage) {
          target.value = freeOutputTokensPercentage;
          return;
        }

        sliderValue = parseInt(target.value);
        updateSliderValueFunc(tokenInfo, sliderValue);
        updateSlider();
      }"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="slider"
    />

    <span class="value-percent">
      {{formatMoney(tokenInfo.value, 2)}}%
    </span>
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { formatMoney } from '@/utils/numbers.ts';

// define component props for the slider component
const {
  min,
  max,
  step,
  tokenInfo,
  updateSliderValueFunc,
  freeOutputTokensPercentage,
  isTokenWithoutLineSlider,
} = defineProps({
  updateSliderValueFunc: {
    type: Function,
    required: true,
  },
  tokenInfo: {
    type: Object,
    required: true,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  freeOutputTokensPercentage: {
    type: Number,
    default: 100,
  },
  isTokenWithoutLineSlider: {
    type: Boolean,
    default: false,
  },
});

// define emits for the slider component
// const emit = defineEmits(["update:modelValue"]);

// define refs for the slider component
const sliderValue = ref(tokenInfo.value);
const slider: any = ref(null);

// function to get the progress of the slider
const getProgress = (value: any, minVal: any, maxVal: any) => ((value - minVal)
/ (maxVal - minVal)) * 100;

// function to set the css variable for the progress
const setCSSProgress = (progress: any) => {
  if (!slider.value) return;
  if (tokenInfo.locked) return;

  console.log('setCSSProgress: ', progress);
  slider.value.style.setProperty('--ProgressPercent', `${progress}%`);
};

const updateSlider = () => {
  if (tokenInfo.locked) return;

  if (slider.value) {
    // emit the updated value to the parent component
    // emit("update:modelValue", sliderValue.value);

    // update the slider progress
    const progress = getProgress(
      sliderValue.value,
      slider.value.min,
      slider.value.max,
    );

    console.log('progress: ', progress);
    // define extrawidth to ensure that the end of progress is always under the slider thumb.
    let extraWidth = (100 - progress) / 10;
    extraWidth = 0; // not need

    // set the css variable
    setCSSProgress(progress + extraWidth);
  }
};

watchEffect(() => {
  updateSlider();
}, sliderValue.value);

watchEffect(() => {
  sliderValue.value = tokenInfo.value;
}, tokenInfo);

</script>
<style scoped>

.custom-slider {
    --trackHeight: 0.5rem;
    --thumbRadius: 1.3rem;
}

/* style the input element with type "range" */
.custom-slider input[type="range"] {
    position: relative;
    appearance: none;
    /* pointer-events: none; */
    border-radius: 999px;
    z-index: 0;
    height: 100%;
    width: 80%;
}

/* ::before element to replace the slider track */
.custom-slider input[type="range"]::before {
    content: "";
    position: absolute;
    width: var(--ProgressPercent, 100%);
    height: 100%;
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    /* z-index: -1; */
    pointer-events: none;
    border-radius: 999px;
}

/* `::-webkit-slider-runnable-track` targets the track (background) of a range slider in chrome and safari browsers. */
.custom-slider input[type="range"]::-webkit-slider-runnable-track {
    appearance: none;
    background: var(--main-slider-background);
    height: var(--trackHeight);
    border-radius: 999px;
}

/* `::-moz-range-track` targets the track (background) of a range slider in Mozilla Firefox. */
.custom-slider input[type="range"]::-moz-range-track {
    appearance: none;
    background: var(--main-slider-background);
    height: var(--trackHeight);
    border-radius: 999px;
}

.custom-slider input[type="range"]::-webkit-slider-thumb {
    position: relative;
    /* top: 50%;
    transform: translate(0, -50%);
    */
    width: var(--thumbRadius);
    height: var(--thumbRadius);
    margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2);
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    border-radius: 999px;
    pointer-events: all;
    appearance: none;
    z-index: 1;
}

.slider-locked input[type="range"]::-webkit-slider-thumb {
    background: var(--secondary-border);
    cursor: not-allowed;
}

.slider-locked input[type="range"]::before {
    background: var(--secondary-border);
    cursor: not-allowed;
}

.slider-locked input[type="range"]::-webkit-slider-runnable-track {
    cursor: not-allowed;
}

.slider-locked input[type="range"]::-moz-range-track {
    cursor: not-allowed;
}

.slider-locked {
    cursor: not-allowed;
    --thumbRadius: 0;
}

.slider-locked {

}

.value-percent {
    padding-left: 5px;
    color: var(--main-gray-text);
}
</style>
