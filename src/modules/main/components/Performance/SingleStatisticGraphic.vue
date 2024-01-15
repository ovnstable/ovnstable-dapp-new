<template>
  <GraphicInterval
    :selectedInterval="currentInterval"
    :intervals="['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL TIME']"
    @update:interval="updateInterval"
  />
  <div class="performance__graphic">
    <div class="performance__graphic-data">
      <p class="performance__graphic-title">
        {{ graphicData.type === 'APY' ? `Average ${graphicData.token} APY` : `${graphicData.token} TVL` }}
      </p>
      <div class="performance__graphic-data-text">
        <p class="performance__graphic-value">{{ graphicData.value }}</p>
        <p class="performance__graphic-date">{{ graphicData.value }}</p>
      </div>
    </div>
    <div class="performance__graphic-display">
      <p>Graphic {{ currentInterval }}</p>
    </div>
  </div>
</template>

<script lang="ts">

import GraphicInterval from '@/modules/main/components/GraphicInterval.vue';

export default {
  name: 'GraphicComponent',
  components: {
    GraphicInterval,
  },
  props: {
    graphicData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentInterval: '1D',
    };
  },
  methods: {
    updateInterval(newInterval: string) {
      this.currentInterval = newInterval;
    },
  },
};
</script>

<style scoped>
.performance__graphic{
    display: flex;
    flex-direction: column;
    padding: 22px 39px;
    justify-content: space-between;
    align-items: flex-start;
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid var(--color-black);
    margin-top: 5px;
}

.performance__graphic-data {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    flex-grow: 1;
}
.performance__graphic-data-text {
    margin-left: 167px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.performance__graphic-title {
    color: var(--color-black);
    font-size: 15px;
    font-weight: 600;
}

.performance__graphic-value {
    color: var(--color-black);
    font-size: 20px;
    font-weight: 600;
}

.performance__graphic-date {
    color: var(--color-black);
    font-size: 12px;
    font-weight: 500;
}

@media (max-width: 1250px) {
  .performance__graphic-data-text {
    margin-left: 50px;
  }
}

@media (max-width: 768px) {
    .performance__graphic-value {
        font-size: 16px;
    }
    .performance__graphic-title {
        font-size: 12px;
    }
    .performance__graphics-buttons-interval > * {
        font-size: 10px;
    }
    .performance__graphic-date {
         font-size: 10px;
    }
    .performance__graphic{
        padding: 15px 30px;
    }
}
@media (max-width: 576px) {
    .performance__graphic-value {
        font-size: 14px;
    }
    .performance__graphic-title {
        font-size: 10px;
    }
    .performance__graphics-buttons-interval > * {
        font-size: 8px;
    }
    .performance__graphic-date {
         font-size: 8px;
    }
    .performance__graphic{
        padding: 10px 20px;
    }
}
</style>
