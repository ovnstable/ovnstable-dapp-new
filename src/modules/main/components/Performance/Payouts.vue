<template>
  <div class="performance__payouts">
    <div class="performance__payouts-titles">
      <p>Payable date, UTC</p>
      <p>Daily profit, {{ collateralToken }} per {{ tokenName }}</p>
      <p>Annualized yield, % per year</p>
      <p>Explorer</p>
    </div>
    <!-- <div class="performance__payouts-divider" /> -->
    <div
      v-for="trx in transactionsData"
      :key="trx.id"
      class="performance__payouts-transactions"
    >
      <div class="performance__payouts-date-transaction">
        <p class="performance__payouts-date">{{ formatDate(trx.date)}}</p>
        <p>{{ formatTime(trx.date) }}</p>
      </div>
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
      tokenName: 'ETH+',
      collateralToken: 'WETH',
      transactionsData: [
        {
          id: '0xd0209d91c53f4c5e574948a07ef3659d8bf2ab5df5983d9f4bec39c1d883c44f',
          date: '1705487006275',
          sum: 100.0,
          apy: 5.0,
          tokenLink: 'https://basescan.org/tx/0xd0209d91c53f4c5e574948a07ef3659d8bf2ab5df5983d9f4bec39c1d883c44f',
        },
        {
          id: '0xe1d017bf21b1e85cecd20f51526cb0c1137c9f3149ef82ade69e5bbd15f99da2',
          date: '1705487006275',
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
    formatDate(dateStr: string): string {
      const date = new Date(Number(dateStr));
      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); 
      const year = date.getUTCFullYear();
      return `${day}.${month}.${year}`;
    },
    formatTime(dateStr: string): string {
      const date = new Date(Number(dateStr));
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
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
  background: var(--color-6);
  padding: 20px;
}
.performance__payouts-text {
  text-align: left;
  margin-bottom: 20px;
  color: var(--color-1);
  font-size: 17px;
  font-weight: 600;
}
.performance__payouts-titles {
  display: flex;
  justify-content: space-between;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 22px;
}
.performance__payouts-divider {
  border: 1px solid var(--color-17);
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

.performance__payouts-transactions p {
  color: var(--color-1);
  font-size: 15px;
  font-weight: 400;
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
  align-items: right;
  text-align: right;
}

.performance__payouts-id-link p {
  max-width: fit-content;
}

.performance__payouts-date-transaction {
  display: flex;
  flex-direction: row;
}

.performance__payouts-date {
  margin-right: 18px;
}
</style>
