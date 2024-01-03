<template>
  <div class="performance__portfolio">
    <div class="performance__portfolio-tabs-row">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        :class="['performance__portfolio-tab', { 'performance__portfolio-tab--active': currentTab === tab.name }]"
        @click="currentTab = tab.name"
        @keydown.enter="currentTab = tab.name"
        tabindex="0"
      >
        {{ tab.title }}
      </div>
    </div>
    <div class="performance__portfolio-tab-content">
      <p>{{ currentTabData }}</p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PortfolioPerformance',
  data() {
    return {
      currentTab: 'portfolio',
      tabs: [
        { name: 'portfolio', title: 'PORTFOLIO', data: 'Portfolio Data Here' },
        { name: 'aboutStrategies', title: 'ABOUT STRATEGIES', data: 'Strategies Data Here' },
      ],
    };
  },
  computed: {
    currentTabData() {
      const tab = this.tabs.find((tabItem) => tabItem.name === this.currentTab);
      return tab ? tab.data : '';
    },
  },
};
</script>

<style scoped>
.performance__portfolio {
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    border: 1px solid var(--color-black);
    background: var(--color-white);
    box-shadow: 0 1px 0 0 var(--color-black);
    padding: 0;
    width: calc(100% - 40px);
}

.performance__portfolio-tabs-row {
    display: flex;
    justify-content: space-between;
}

.performance__portfolio-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid var(--color-black);
    background: var(--6, #A8D8FA);
    color: var(--color-black);
    font-size: 15px;
    font-weight: 400;
    border-radius: 20px 20px 0 0;
    padding-top: 14px;
    padding-bottom: 17px;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}
.performance__portfolio-tab:not(:last-child) {
    margin-right: -1px;
}

.performance__portfolio-tab--active {
    background-color: #ffffff;
    color: var(--color-black);
    font-weight: 600;
    position: relative;
    z-index: 1;
    border-bottom: none;
}
.performance__portfolio-tab:not(.performance__portfolio-tab--active) {
    border-bottom: 1px solid var(--color-black);
}
.performance__portfolio-tab:not(.performance__portfolio-tab--active):hover {
    color: var(--color-blue);
    transition: color 0.15s;
}
.performance__portfolio-tab-content {
    border: 1px solid var(--color-black);
    border-top: none;
    padding: 20px;
    border-radius: 0 0 20px 20px;
    background: var(--color-white);
    box-shadow: 0 1px 0 0 var(--color-black);
     transition: opacity 0.3s ease-in-out;
}

@media (max-width: 1024px) {
  .performance__portfolio-tab {
    padding-top: 10px;
    padding-bottom: 14px;
  }
}

@media (max-width: 768px) {
  .performance__portfolio-tab {
    padding-top: 5px;
    padding-bottom: 7px;
  }
}

</style>
