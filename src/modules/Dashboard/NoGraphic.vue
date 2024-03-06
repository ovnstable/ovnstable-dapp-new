<template>
  <div class="dashboard__nographic">
    <div
      v-if="isEmptyPortfolio"
      class="dashboard__nographic-text"
    >
      <p>OOPS YOU DON'T HAVE ANY USD+ IN YOUR WALLET<br>
        <span>
          CHANGE CHAIN OR TOP UP YOUR USD+ BALANCE TO RECEIVE YIELD AND SEE YOUR PROFITS GROW
        </span> </p>
    </div>
    <div
      v-else
      class="dashboard__nographic-text"
    >
      OOPS YOU DON'T HAVE ANY USD+ IN YOUR WALLET FOR CURRENT INTERVAL<br>
      <span>
        CHANGE TIME INTERVAL
      </span>
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
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  [data-theme="dark"] & {
    background-color: var(--color-7);
    color: var(--color-6);
  }
}
.dashboard__nographic-text {
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  span {
    display: inline-block;
    margin-top: 10px;
  }
  [data-theme="dark"] & {
    color: var(--color-18);
  }
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
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}
</style>
