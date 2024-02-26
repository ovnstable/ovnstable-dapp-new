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

.interval-option:first-child {
  border-radius: 30px 0 0 30px;
}

.interval-option:last-child {
  border-radius: 0 30px 30px 0;
  margin-right: 0;
}

.interval-selected {
  background-color: var(--color-6);
  color: var(--color-1);
  border-color: var(--color-1);
  z-index: 1;
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.interval-option:hover:not(.interval-selected) {
  background-color: var(--color-hover);
  color: var(--color-text-hover);
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
