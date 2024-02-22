<template>
  <div class="dashboard__pools">
    <p>MY POOLS</p>
  </div>
  <p class="dasboard__pools-transactions">{{ allTokens === true ? "TOKENS+" : "USD+" }} TRANSACTIONS</p>
</template>

<script lang="ts">

export default {
  name: 'DashboardPools',
  props: {
    allTokens: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard__pools {
  border: 1px solid var(--color-1);
  p {
    font-size: 17px;
    color: var(--color-1);
    font-weight: 500;
  }
}

.dasboard__pools-transactions {
  margin-top: 25px;
  font-size: 17px;
  color: var(--color-1);
  font-weight: 500;
}
</style>
