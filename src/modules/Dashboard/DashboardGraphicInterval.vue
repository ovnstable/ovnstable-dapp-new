<template>
  <div
    v-for="interval in intervals"
    :key="interval"
    :class="{
      'interval-selected': interval === selectedInterval,
      'special-style-interval-all-time': selectedInterval === intervals[1] && interval === intervals[0],
      'special-style-interval-month': selectedInterval === intervals[2] && interval === intervals[1],
      'special-style-interval-week': selectedInterval === intervals[3] && interval === intervals[2],
    }"
    class="interval-option"
    @click="$emit('update:interval', interval)"
    @keydown.enter="$emit('update:interval', interval)"
    tabindex="0"
  >
    {{ interval }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboardGraphicInterval',
  props: {
    selectedInterval: {
      type: String,
      default: 'DAY',
    },
    intervals: {
      type: Array as () => string[],
      default: () => ['ALL TIME', 'MONTH', 'WEEK', 'DAY'],
    },
  },
};
</script>

<style lang="scss" scoped>

.interval-option {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 8px 26px;
  font-size: 14px;
  background-color: var(--color-5);
  color: var(--color-2);
  border: 1px solid var(--color-6);
  box-shadow: none;
  margin-right: -10px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  position: relative;
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}

.interval-selected {
  background-color: var(--color-6);
  color: var(--color-1);
  border-color: var(--color-1);
  border-radius: 30px;

  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.interval-option:nth-child(1):not(.interval-selected) {
  z-index: 4;
  border-radius: 30px;
}
.interval-option:nth-child(2):not(.interval-selected) {
  z-index: 3;
  border-radius: 0 30px 30px 0;
}
.interval-option:nth-child(3):not(.interval-selected) {
  z-index: 2;
  border-radius: 0 30px 30px 0;
}
.interval-option:nth-child(4):not(.interval-selected) {
  border-radius: 0 30px 30px 0;
  z-index: 1;
}

.interval-option:nth-child(3).interval-selected {
  border-radius: 30px;
  z-index: 4;
}

.interval-option:nth-child(2).interval-selected {
  border-radius: 30px;
  z-index: 5;
}
.interval-option:nth-child(1).interval-selected {
  border-radius: 30px;
  z-index: 5;
}
.interval-option:nth-child(4).interval-selected {
  border-left: none;
  border-radius: 0 30px 30px 0;
  z-index: 1;
}

.interval-option:nth-child(3).interval-selected + .interval-option:nth-child(4):not(.interval-selected) {
  border-radius: 0 30px 30px 0;
}

.special-style-interval-all-time {
  border-radius: 30px 0 0 30px !important;
}

.special-style-interval-month {
  border-radius: 0 !important;
}

.special-style-interval-week {
  border-right: 1px solid var(--color-1);
}
.interval-option:hover:not(.interval-selected) {
  background-color: var(--color-4);
  [data-theme="dark"] & {
    background-color: var(--color-4);
    color: var(--color-17);
  }
}

.interval-option:hover {
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-1);
  }
}

.interval-selected {
  color: var(--color-1);
  font-weight: 800;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
</style>
