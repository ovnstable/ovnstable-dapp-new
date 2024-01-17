<template>
  <div
    class="v-spinner"
    v-show="true"
  >
    <div
      class="v-moon v-moon1"
      :style="spinnerStyle"
    >
      <div
        class="v-moon v-moon2"
        :style="[spinnerMoonStyle, animationStyle2]"
      />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'SpinnerComponent',
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: '#E3F2FD',
    },
    size: {
      type: String,
      default: '60px',
    },
    margin: {
      type: String,
      default: '2px',
    },
    radius: {
      type: String,
      default: '100%',
    },
  },
  computed: {
    spinnerStyle() {
      return {
        height: this.size,
        width: this.size,
        borderRadius: this.radius,
      };
    },
    moonSize() {
      return parseFloat(this.size) / 10;
    },
    spinnerMoonStyle() {
      return {
        height: this.size,
        width: this.size,
        borderRadius: this.radius,
      };
    },
    animationStyle2() {
      return {
        top: `${parseFloat(this.size) / 2 - this.moonSize / 2}px`,
        border: `#0497EC solid ${this.moonSize}px`,
        borderBottom: `${this.moonSize}px solid ${this.color}`,
      };
    },
  },
};
</script>

<style>
.v-spinner .v-moon1 {
  -webkit-animation: v-moonStretchDelay 1s 0s infinite linear;
  animation: v-moonStretchDelay 1s 0s infinite linear;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  position: relative;
}

@-webkit-keyframes v-moonStretchDelay {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes v-moonStretchDelay {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
