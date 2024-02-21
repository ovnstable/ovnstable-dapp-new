<template>
  <div class="dashboard__transactions">
    <div class="dashboard__transactions-titles">
      <p>Payable date, UTS</p>
      <p>Opening balance</p>
      <p>Transaction type</p>
      <p>Balance change</p>
      <p>Fees</p>
      <p>Closing balance</p>
      <p>Explorer</p>
    </div>
    <TransitionGroup
      name="list"
      tag="ul"
    >
      <div
        v-for="(trx) in visibleTransactions"
        :key="trx.transaction_hash"
        class="dashboard__transactions-transactions"
      >
        <div class="dashboard__transactions-transaction">
          <div class="dashboard__transactions-date-transaction">
            <p>{{formatDateTime(trx.date)}}</p>
          </div>
          <p>${{ trx.opening_balance.toFixed(2) }}</p>
          <p>{{ trx.type.charAt(0).toUpperCase() + trx.type.slice(1).toLowerCase() }}</p>
          <p>${{ trx.change_balance.toFixed(2) }}</p>
          <p>{{ trx.fee !== null ? trx.fee : '0' }}</p>
          <p>${{ trx.closing_balance.toFixed(2) }}</p>
          <div class="dashboard__transactions-id-link">
            <a
              :href="`${networkScan}tx/${trx.transaction_hash}`"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Link for token"
              class="link-ovn"
            >
              <ButtonComponent class="dashboard__button-trx">
                <BaseIcon
                  name="PayoutArrow"
                />
              </ButtonComponent>
            </a>
          </div>
        </div>
        <div
          class="dashboard__transactions-divider"
        />
      </div>
    </TransitionGroup>

    <button
      class="dashboard__transactions-button-show"
      @click="showMoreTransactions"
      v-if="hasMoreTransactions"
      type="button"
    >
      <BaseIcon
        name="ArrowDown"
      />
      <p class="dashboard__transactions-button-show-text">SHOW MORE</p>
      <BaseIcon
        name="ArrowDown"
      />
    </button>

  </div>
</template>

<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'DashboardTransactions',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  props: {
    portfolioBalanceData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showMore: false,
      visibleTransactionCount: 6,
    };
  },
  computed: {
    networkScan() {
      return this.$store.state.network.dashboardExplorerURL;
    },
    visibleTransactions() {
      return this.portfolioBalanceData
        .filter((trx: any) => !(trx.opening_balance === 0 && trx
          .change_balance === 0 && trx.closing_balance === 0))
        .slice(0, this.visibleTransactionCount);
    },
    hasMoreTransactions() {
      return this.portfolioBalanceData.length > this.visibleTransactionCount;
    },
  },
  methods: {
    formatTransactionID(id: string): string {
      return `${id.substring(0, 5)}...${id.substring(id.length - 4)}`;
    },
    formatProfit(profit: any, token: string) {
      if (token !== 'WETH') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        }).format(profit);
      }
      return `${parseFloat(profit).toFixed(6)} WETH`;
    },
    formatDateTime(dateTimeStr: string) {
      const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' } as any;
      const date = new Date(dateTimeStr);
      const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date).replace(/\//g, '.');
      return formattedDate;
    },
    showMoreTransactions() {
      this.visibleTransactionCount += 14;
    },
  },

};
</script>

<style lang="scss" scoped>

.dashboard__button-trx {
  box-shadow: none;
  align-items: center;
  border: 2px solid var(--color-6);
  padding: 6px 12px;
  background-color: var(--color-5);
  border-radius: 30px;
  svg {
    fill: var(--color-2)
  }
  [data-theme="dark"] & {
    border-color: var(--color-3);
    svg {
      fill: var(--color-1)
    }
  }
}
.dashboard__transactions-horizontal-divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-6);
}

.dashboard__transactions {
  display: flex;
  flex-direction: column;
  background: var(--color-8);
  padding: 20px;
  [data-theme="dark"] & {
    background: var(--color-6);
  }
}
.dashboard__transactions-text {
  text-align: left;
  margin-bottom: 20px;
  color: var(--color-1);
  font-size: 17px;
  font-weight: 600;
}
.dashboard__transactions-titles {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 22px;
  margin-top: 14px;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.dashboard__transactions-divider {
  border: 1px solid var(--color-17);
  margin-top: 14px;
  margin-bottom: 12px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.dashboard__transactions-transaction {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.dashboard__transactions-titles {
  flex-direction: row;
  margin-bottom: 22px;
}

.dashboard__transactions-transactions p {
  font-size: 15px;
  font-weight: 400;
}
.dashboard__transactions-transactions p:not(:last-child) {
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.dashboard__transactions-titles,
.dashboard__transactions-transaction {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  text-align: center;
}

.dashboard__transactions-titles :nth-child(1) {
  text-align: left;
}

.dashboard__transactions-titles :last-child {
  text-align: right;
}

.dashboard__transactions-id-link {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.dashboard__transactions-date-transaction {
  display: flex;
  flex-direction: row;
  flex: 2;
  color: var(--color-1);
  font-size: 15px;
  font-weight: 400;
  max-width: 160px;
  justify-content: space-between;
}

.dashboard__transactions-time {
  white-space: nowrap;
}

.dashboard__transactions-button-show {
  display: flex;
  flex-direction: row;
  border-radius: 30px;
  border: 1px solid var(--color-7);
  padding: 10px 225px;
  justify-content: center;
  align-items: center;
  background: none;
  margin-top: 9px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.dashboard__transactions-button-show:hover {
  cursor: pointer;
  border: 2px solid var(--color-1);
}

.dashboard__transactions-button-show-text {
  margin-left: 12px;
  margin-right: 12px;
  color: var(--color-7);
  font-size: 15px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.list-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
@media (max-width: 1024px) {
  .dashboard__transactions-date-transaction {
    margin-right: 10px;
  }
}

</style>
