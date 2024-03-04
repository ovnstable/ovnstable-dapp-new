<template>
  <div class="intervals_wrapper">
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
  </div>

</template>

<script lang="ts">
export default {
  name: 'GraphicInterval',
  props: {
    selectedInterval: {
      type: String,
      default: '1W',
    },
    intervals: {
      type: Array as () => string[],
      default: () => ['1W', '1M', '3M', '6M', '1Y', 'ALL TIME'],
    },
  },
};
</script>

<style lang="scss" scoped>
.interval-option {
  display: inline-block;
  padding: 2px 5px;
  margin: 0 2px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-2);
  [data-theme="dark"] & {
    color: var(--color-18);
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

@media (max-width: 400px) {
  .interval-option {
    margin: 0;
  }
  .intervals_wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
