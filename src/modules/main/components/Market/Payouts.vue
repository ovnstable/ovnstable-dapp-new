<template>
  <div class="performance__payouts">
    <div class="performance__payouts-titles">
      <p>Payable date, UTC</p>
      <p>Daily profit, {{ collateralToken }} per {{ tokenName }}</p>
      <p>Annualized yield, % per year</p>
      <p>Explorer</p>
    </div>
    <TransitionGroup
      name="list"
      tag="ul"
    >
      <div
        v-for="(trx, index) in visibleTransactions"
        :key="trx.id"
        class="performance__payouts-transactions"
      >
        <div class="performance__payouts-transaction">
          <div class="performance__payouts-date-transaction">
            <p class="performance__payouts-datetime">{{ formatDate(trx.date) }} <span class="date">{{ formatTime(trx.date)
            }} </span></p>
          </div>
          <p>{{ trx.sum }} {{ collateralToken }}</p>
          <p>{{ trx.apy }}%</p>
          <div class="performance__payouts-id-link">
            <a
              :href="trx.tokenLink"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Link for token"
              class="link-ovn"
            >
              <p>{{ formatTransactionID(trx.id) }}</p>
            </a>
          </div>
        </div>
        <div
          class="performance__payouts-divider"
          v-if="index !== visibleTransactions.length - 1"
        />
      </div>
    </TransitionGroup>

    <button
      class="performance__payouts-button-show"
      @click="showMoreTransactions"
      v-if="hasMoreTransactions"
      type="button"
    >
      <BaseIcon
        name="ArrowDown"
      />
      <p class="performance__payouts-button-show-text">SHOW MORE</p>
      <BaseIcon
        name="ArrowDown"
      />
    </button>

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
    const originalTransaction = {
      id: '0xd0209d91c53f4c5e574948a07ef3659d8bf2ab5df5983d9f4bec39c1d883c44f',
      date: '1705487006275',
      sum: 0.000123,
      apy: 0.444,
      tokenLink: 'https://basescan.org/tx/0xd0209d91c53f4c5e574948a07ef3659d8bf2ab5df5983d9f4bec39c1d883c44f',
    };
    const transactionsData = [];

    for (let i = 0; i < 21; i++) {
      transactionsData.push({ ...originalTransaction });
    }
    return {
      tokenName: 'ETH+',
      collateralToken: 'WETH',
      transactionsData,
      showMore: false,
      visibleTransactionCount: 6,
    };
  },
  computed: {
    visibleTransactions() {
      return this.transactionsData.slice(0, this.visibleTransactionCount);
    },
    hasMoreTransactions() {
      return this.transactionsData.length > this.visibleTransactionCount;
    },
  },
  methods: {
    formatTransactionID(id: string): string {
      return `${id.substring(0, 5)}...${id.substring(id.length - 4)}`;
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
    showMoreTransactions() {
      this.visibleTransactionCount += 14;
    },
  },

};
</script>

<style scoped>
.performance__payouts-horizontal-divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-6);
}

.performance__payouts {
  display: flex;
  flex-direction: column;
  background: var(--color-8);
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
  flex-direction: row;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 22px;
}
.performance__payouts-divider {
  border: 1px solid var(--color-17);
  margin-top: 17px;
  margin-bottom: 13px;
}

.performance__payouts-transaction {
  display: flex;
  flex-direction: row;
}

.performance__payouts-titles {
  flex-direction: row;
  margin-bottom: 22px;
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
}

.performance__payouts-id-link p {
  max-width: fit-content;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 400;
}

.performance__payouts-date-transaction {
  display: flex;
  flex-direction: row;
  flex: 2;
}

.date {
  margin-left: 18px;
}

.performance__payouts-button-show {
  display: flex;
  flex-direction: row;
  border-radius: 30px;
  border: 1px solid var(--color-6);
  padding: 10px 225px;
  justify-content: center;
  align-items: center;
  background: none;
  margin-top: 9px;
}

.performance__payouts-button-show:hover {
  cursor: pointer;
  border: 2px solid var(--color-1);
}

.performance__payouts-button-show-text {
  margin-left: 12px;
  margin-right: 12px;
  color: var(--color-7);
  font-size: 15px;
  font-weight: 600;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.7s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateZ(-30px);
}
</style>
