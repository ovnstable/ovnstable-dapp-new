<template>
  <div class="performance__payouts">
    <p class="performance__payouts-text">Payouts</p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PortfolioPayouts',
};
</script>

<style scoped>
.performance__payouts {
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    border: 1px solid var(--color-black);
    background: var(--color-white);
    box-shadow: 0 1px 0 0 var(--color-black);
    padding: 0;
    width: calc(100% - 40px);
}
.performance__payouts-text {
    text-align: center;
}

</style>
