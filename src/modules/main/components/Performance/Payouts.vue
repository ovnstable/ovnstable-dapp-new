<template>
  <div class="performance__payouts">
    <p class="performance__payouts-text">USD+ Payouts</p>
    <div class="performance__payouts-titles">
      <p>Payable date, UTC</p>
      <p>Daily profit, USDC per  USD+</p>
      <p>Annualized yield, % per year</p>
      <p>Explorer</p>
    </div>
    <div class="performance__payouts-divider"/>
    <div
      v-for="trx in transactionsData"
      :key="trx.id"
      class="performance__payouts-transactions"
    >
      <p>{{ trx.date }}</p>
      <p>{{ trx.sum }}</p>
      <p>{{ trx.apy }}</p>
      <div class="performance__payouts-id-link">
        <p>{{ formatTransactionID(trx.id) }}</p>
        <a
          :href=trx.tokenLink
          class="performance__payouts-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Link for token"
        >
          <BaseIcon
            name="tokenLink"
            path="assets/icons/common/LinkToken.vue"
            class=""
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'PortfolioPayouts',
  components: {
    BaseIcon,
  },
  data() {
    return {
      transactionsData: [
        {
          id: '0xd0209d91c53f4c5e574948a07ef3659d8bf2ab5df5983d9f4bec39c1d883c44f',
          date: '2022-01-01',
          sum: 100.0,
          apy: 5.0,
          tokenLink: 'https://basescan.org/tx/0xd0209d91c53f4c5e574948a07ef3659d8bf2ab5df5983d9f4bec39c1d883c44f',
        },
        {
          id: '0xe1d017bf21b1e85cecd20f51526cb0c1137c9f3149ef82ade69e5bbd15f99da2',
          date: '2022-01-02',
          sum: 150.0,
          apy: 6.0,
          tokenLink: 'https://basescan.org/tx/0xe1d017bf21b1e85cecd20f51526cb0c1137c9f3149ef82ade69e5bbd15f99da2',
        },
      ],
    };
  },
  methods: {
    formatTransactionID(id: string): string {
      return `${id.substring(0, 4)}...${id.substring(id.length - 4)}`;
    },
  },

};
</script>

<style scoped>
.performance__payouts-horizontal-divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-3);
}

.performance__payouts {
    display: flex;
    flex-direction: column;
    background: var(--color-5);
    width: calc(100% - 40px);
}
.performance__payouts-text {
    text-align: left;
    margin-bottom: 20px;
}
.performance__payouts-titles {
  display: flex;
  justify-content: space-between;
  color: var( --color-3);
  font-size: 14px;
  font-weight: 400;
}
.performance__payouts-divider {
  border: 1px solid var(--color-3);
}

.performance__payouts-titles,
.performance__payouts-transactions {
  display: flex;
  justify-content: space-between;
}

.performance__payouts-titles p,
.performance__payouts-transactions p {
  text-align: center;
  flex: 1;
}
.performance__payouts-titles p:first-child,
.performance__payouts-transactions p:first-child {
  text-align: left;
}
.performance__payouts-titles p:nth-child(1),
.performance__payouts-transactions p:nth-child(1) {
  flex: 2;
}

.performance__payouts-titles p:nth-child(2),
.performance__payouts-transactions p:nth-child(2),
.performance__payouts-titles p:nth-child(3),
.performance__payouts-transactions p:nth-child(3) {
  flex: 3;
}

.performance__payouts-titles p:nth-child(4),
.performance__payouts-transactions .performance__payouts-id-link {
  flex: 2;
  display: flex;
  justify-content: flex-end;
}

.performance__payouts-id-link p {
  max-width: fit-content;
  margin-right: 10px;
}
</style>
