<template>
  <div class="switchtabs-dashboard">
    <div class="switchtabs-dashboard__inner">
      <div
        v-for="interval in intervals"
        class="switchtabs-dashboard__inner-text"
        :class="{ active: interval === selectedInterval }"
        :key="interval"
        @click="$emit('update-interval', interval)"
        @keydown.enter="$emit('update-interval', interval)"
        tabindex="0"
      >
        <span>
          {{ interval }}
        </span>
      </div>
    </div>
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
.switchtabs-dashboard {
  display: flex;
}

.switchtabs-dashboard__inner {
  display: flex;
  color: var(--color-2);
  border: 1px solid var(--color-6);
  background: var(--color-5);
  border-radius: 30px;
  [data-theme="dark"] & {
    color: var(--color-18);
    background: var(--color-6);
  }
}

.switchtabs-dashboard__inner-text {
  position: relative;
  white-space: nowrap;
  border-radius: 30px;
  padding: 8px 20px;
  cursor: pointer;
  background: var(--color-5);
  z-index: 2;
  transition: opacity .2s ease, color .2s ease;
  [data-theme="dark"] & {
    background-color: var(--color-6);
  }
  &.large {
    padding: 9px 10px;
  }

  &::before {
    content: "";
    position: absolute;
    z-index: -5;
    width: 100%;
    height: 100%;
    background-color: var(--color-6);
    border: 1px solid var(--color-1);
    color: var(--color-1);
    border-radius: 30px;
    top: 0;
    left: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-7px);
    transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.87, -0.65, 0.09, 0.91) .1s, visibility 0.2s ease;
    [data-theme="dark"] & {
      border-color: var(--color-2);
    }
  }

  &:hover {
    color: var(--color-3);
    opacity: .7;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }

  &:last-child {
    &::before {
      transform: translateX(7px);
    }
  }

  @media (min-width: 1024px) {
    &.large {
      padding: 9px 20px;
    }
  }
}

.switchtabs-dashboard__inner-text.active {
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
  &::before {
    transform: translateX(0);
    visibility: visible;
    opacity: 1;
    z-index: -2;
    [data-theme="dark"] & {
      background-color: var(--color-7);
    }
  }
}
@media (max-width: 420px) {
  .switchtabs-dashboard__inner-text{
    padding: 2px 5px;
  }
}

@media (max-width: 400px) {
  .switchtabs-dashboard__inner {
    justify-content: space-between;
  }
  .switchtabs-dashboard__inner-text{
    padding: 4px 10px;
  }
}
</style>
