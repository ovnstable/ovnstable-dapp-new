<template>
  <div class="performance__portfolio">
    <div
      v-for="tab in tabs"
      :key="tab.name"
      :class="['tab', { 'tab--active': currentTab === tab.name }]"
      @click="currentTab = tab.name"
      @keydown.enter="currentTab = tab.name"
      tabindex="0"
    >
      {{ tab.title }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      currentTab: 'PortfolioPerformance',
      tabs: [
        { name: 'portfolio', title: 'PORTFOLIO', data: 'Portfolio Data Here' },
        { name: 'aboutStrategies', title: 'ABOUT STRATEGIES', data: 'Strategies Data Here' },
      ],
    };
  },
};
</script>

<style scoped>
.performance__portfolio {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    border: 1px solid var(--color-black);
    background: var(--color-white);
    box-shadow: 0px 1px 0px 0px var(--color-black);
    padding: 14px 20px;
    width: calc(100% - 40px);
}

.tab {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px 5px 0px 0px;
    border: 1px solid var(--1, #0F172A);
    background: var(--6, #A8D8FA);
}

.tab--active {
    background-color: #ffffff;
    color: var(--color-black);
    border-color: #007bff;
}

.tab:focus {
    outline: none;
    /* Remove focus outline */
    /* Consider adding focus styles for accessibility */
}
</style>
