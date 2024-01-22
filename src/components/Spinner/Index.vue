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
      default: '#0497EC',
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
        border: `${this.color} solid ${this.moonSize}px`,
        borderBottom: `${this.moonSize}px solid white`,
      };
    },
  },
};
</script>

<style>
.v-spinner .v-moon1 {
  animation: v-moonStretchDelay 1.6s 0s infinite cubic-bezier(0, 0, 0.49, 1.12);
  animation-fill-mode: forwards;
  position: relative;
}

@keyframes v-moonStretchDelay {
  100% {
    transform: rotate(1080deg);
  }
}
</style>
