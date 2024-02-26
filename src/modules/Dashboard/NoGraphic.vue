<template>
  <div class="dashboard__nographic">
    <div
      v-if="isEmptyPortfolio"
      class="dashboard__nographic-text"
    >
      <p>OOPS YOU DON'T HAVE ANY USD+ IN YOUR WALLET<br>
        CHANGE CHAIN OR TOP UP YOUR USD+ BALANCE TO RECEIVE YIELD AND SEE YOUR PROFITS GROW </p>
    </div>
    <div
      v-else
      class="dashboard__nographic-text"
    >
      OOPS YOU DON'T HAVE ANY USD+ IN YOUR WALLET FOR CURRENT INTERVAL<br>
      CHANGE TIME INTERVAL
    </div>
    <div
      v-if="isEmptyPortfolio"
      class="dashboard__nographic-buttons"
    >
      <router-link
        to="/"
      >
        <ButtonComponent>
          MINT
        </ButtonComponent>

      </router-link>

      <router-link
        to="/"
      >
        <ButtonComponent>
          SWAP
        </ButtonComponent>

      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'NoGraphic',
  components: {
    ButtonComponent,
  },
  props: {
    portfolioBalanceData: {
      type: Object,
      required: true,
    },
    graphicInterval: {
      type: String,
      required: true,
    },
  },
  computed: {
    isEmptyPortfolio() {
      return Object.keys(this.portfolioBalanceData).length === 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard__nographic {
  width: 100%;
  padding: 21px 0px;
  background-color: var(--color-8);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dashboard__nographic-text {
  font-size: 15px;
  font-weight: 600;
  text-align: center;
}
.dashboard__nographic-buttons {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  gap: 20px;
  button {
    background-color: var(--color-5);
    border: 1px solid var(--color-2);
    border-radius: 30px;
    box-shadow: none;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-2);
  }
}
</style>
