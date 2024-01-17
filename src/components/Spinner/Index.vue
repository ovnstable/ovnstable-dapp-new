<template>
  <div
    :class="$options.name"
    :style="style"
    class="sk-fading-circle"
  >
    <div
      v-for="i in 8"
      :key="i"
      :class="'sk-circle sk-circle' + i"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'spinner-fading-circle',
  inheritAttrs: false,

  props: {
    size: {
      type: Number,
      default: 48,
    },
  },

  computed: {
    style() {
      const size = this.size && `${this.size}px`;
      return {
        width: size,
        height: size,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@use "sass:math";

$circle-count: 8;
$animation-duration: 0.1s * $circle-count;
$spinkit-size: 36px;

.sk-fading-circle {
  position: relative;

  width: $spinkit-size;
  height: $spinkit-size;
  color: var(--color-1);

  &.white {
    color: #fff;
  }

  .sk-circle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .sk-circle::before {
    $width: round(0.2 * $spinkit-size);
    display: block;
    width: $width;
    height: $width;
    margin: 0 auto;
    background-color: currentColor;
    animation: sk-circleFadeDelay $animation-duration infinite ease-in-out both;
    content: "";
    overflow: hidden;
    border-radius: math.div($width, 2);
  }

  @for $i from 1 through $circle-count {
    .sk-circle#{$i} {
      transform: rotate(math.div(360deg, $circle-count) * ($i - 1));

      &::before {
        $a: -$animation-duration + ($i - 1) * math.div($animation-duration, $circle-count);
        animation-delay: $a;
      }
    }
  }
}

@keyframes sk-circleFadeDelay {
  0%,
  39%,
  100% {
    opacity: 0;
  }

  40% {
    opacity: 1;
  }
}
</style>
