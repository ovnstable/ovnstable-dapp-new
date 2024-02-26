<template>
  <div
    v-for="interval in intervals"
    :key="interval"
    :class="{ 'interval-selected': interval === selectedInterval }"
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
  z-index: 0;
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}

.interval-option:nth-child(1) {
  border-radius: 30px 0 0 30px;
}
.interval-option:nth-child(2) {
  border-radius: 30px 0 0 30px;
}
.interval-option:nth-child(3) {
  border-radius: 30px 30px 30px 30px;
}

.interval-option:nth-child(4) {
  border-radius: 0 30px 30px 0;
  margin-right: 0;
}

.interval-selected {
  background-color: var(--color-6);
  color: var(--color-1);
  border-color: var(--color-1);
  border-radius: 30px;
  z-index: 1;
  &:nth-child(2) {
    border-radius: 30px 30px 30px 30px;
    z-index: 3;
  }
  &:nth-child(1) {
    border-radius: 30px;
    z-index: 4;
  }
  &:nth-child(4) {
    border-radius: 0px 30px 30px 0px;
  }
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.interval-option:nth-child(2).interval-selected + .interval-option:nth-child(3),
.interval-option:nth-child(2):not(.interval-selected) + .interval-option:nth-child(3) {
  border-radius: 0 30px 30px 0px;
  z-index: 2;
}

.interval-option:nth-child(1).interval-selected + .interval-option:nth-child(2) {
  border-radius: 0 30px 30px 0px;
  z-index: 3;
}

.interval-option:nth-child(3).interval-selected {
  border-radius: 30px !important;
}

.interval-option:nth-child(2):not(.interval-selected) {
  z-index: 3;
  border-radius: 0px 30px 30px 0px;
}
.interval-option:nth-child(1):not(.interval-selected) {
  z-index: 4;
  border-radius: 30px;
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
