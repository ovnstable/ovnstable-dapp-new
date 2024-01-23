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
  name: 'GraphicInterval',
  props: {
    selectedInterval: {
      type: String,
      default: '1D',
    },
    intervals: {
      type: Array as () => string[],
      default: () => ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL TIME'],
    },
  },
};
</script>

<style scoped>
.interval-option {
    display: inline-block;
    padding: 2px 5px;
    margin: 0 2px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    color: var(--color-2);
}

.interval-option:hover {
    color: var(--color-1);
}

.interval-selected {
    color: var(--color-1);
    font-weight: 800;
}
</style>
