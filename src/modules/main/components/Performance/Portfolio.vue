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
    padding: 14px 20px;
    width: calc(100% - 40px);
}

.performance__portfolio-tabs-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.performance__portfolio-tab {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px 5px 0 0;
    border: 1px solid var(--color-black);
    background: var(--6, #A8D8FA);
    color: var(--color-black);
    font-size: 15px;
    font-weight: 400;
}

.performance__portfolio-tab--active {
    background-color: #ffffff;
    color: var(--color-black);
    font-size: 15px;
    font-weight: 600;
}

.tab-content {
    border: 1px solid var(--color-black);
    border-top: none;
    padding: 20px;
    border-radius: 0 0 20px 20px;
    margin-top: -1px;
}
</style>
