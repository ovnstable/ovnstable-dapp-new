<template>
  <div
    v-if="!device.isMobile"
    class="dashboard__transactions"
  >
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
      class="dashboard__payouts-transactions-ul"
    >
      <div
        v-for="(trx) in visibleTransactions"
        :key="trx.transaction_hash"
        class="dashboard__transactions-transactions"
      >
        <div class="dashboard__transactions-transaction">
          <div class="dashboard__transactions-date-transaction">
            <p>{{formatDateTime(trx.date).date}}</p>
          </div>
          <p>${{ trx.opening_balance.toFixed(2) }}</p>
          <p>{{ trx.type.charAt(0).toUpperCase() + trx.type.slice(1).toLowerCase() }}</p>
          <p>{{ trx.change_balance < 0 ? '- ' : '' }}${{ Math.abs(trx.change_balance).toFixed(2) }}</p>
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
  <div
    v-else
    class="dashboard__transactions"
  >
    <div class="dashboard__transactions-titles">
      <p>Payable date, UTS</p>
      <p>Opening balance</p>
      <p>Transaction type</p>
      <p>More</p>
    </div>
    <TransitionGroup
      name="list"
      tag="ul"
      class="dashboard__transactions-ul"
    >
      <div
        v-for="(trx) in visibleTransactions"
        :key="trx.transaction_hash"
        class="dashboard__transactions-transactions"
      >
        <div class="dashboard__transactions-transaction">
          <div class="dashboard__transactions-date-transaction">
            <p>{{formatDateTime(trx.date).date}}</p>
            <p>{{formatDateTime(trx.date).time}}</p>
          </div>
          <p>${{ trx.opening_balance.toFixed(2) }}</p>
          <p>{{ trx.type.charAt(0).toUpperCase() + trx.type.slice(1).toLowerCase() }}</p>
          <div class="dashboard__transactions-id-link">
            <ButtonComponent
              class="dashboard__button-trx"
              :class="{ 'dashboard__arrow-dropdown-up': activeDropdown === trx.transaction_hash }"
              @click="toggleDropdown(trx.transaction_hash)"
            >
              <BaseIcon
                name="ArrowExitMobile"
              />
            </ButtonComponent>
          </div>
        </div>
        <div
          v-if="activeDropdown === trx.transaction_hash"
          class="dashboard__dropdown-menu-mobile"
        >
          <div class="dashboard__dropdown-menu-item-balance-mobile">
            <p>Balance change</p>
            <p>{{ trx.change_balance < 0 ? '- ' : '' }}${{ Math.abs(trx.change_balance).toFixed(2) }}</p>
          </div>
          <div class="dashboard__dropdown-menu-item-mobile">
            <p>Fees</p>
            <p>{{ trx.fee !== null ? trx.fee : '0' }}</p>
          </div>
          <div class="dashboard__dropdown-menu-item-mobile">
            <p>Closing balance</p>
            <p>${{ trx.closing_balance.toFixed(2) }}</p>
          </div>
          <div class="dashboard__dropdown-menu-item-mobile">
            <p>Explorer</p>
            <a
              :href="`${networkScan}tx/${trx.transaction_hash}`"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Link for token"
              class="link-ovn"
            >
              <ButtonComponent class="dashboard__button-explorer">
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
import { deviceType } from '@/utils/deviceType.ts';

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
      activeDropdown: null,
    };
  },
  computed: {
    device() {
      return deviceType();
    },
    networkScan() {
      return this.$store.state.network.dashboardExplorerURL;
    },
    visibleTransactions() {
      const sortedTransactions = [...this.portfolioBalanceData as any]
        .filter((trx) => !(trx.opening_balance === 0 && trx.change_balance === 0
          && trx.closing_balance === 0))
        .sort((a, b) => (new Date(b.date) as any) - (new Date(a.date) as any));
      if (!this.device.isMobile) {
        return sortedTransactions.slice(0, this.visibleTransactionCount);
      }
      return sortedTransactions;
    },

    hasMoreTransactions() {
      return this.portfolioBalanceData.length > this.visibleTransactionCount;
    },
  },
  methods: {
    formatTransactionID(id: string): string {
      return `${id.substring(0, 5)}...${id.substring(id.length - 4)}`;
    },
    toggleDropdown(transactionHash: any) {
      this.activeDropdown = this.activeDropdown === transactionHash ? null : transactionHash;
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
      const optionsTime = { hour: '2-digit', minute: '2-digit' } as any;

      const date = new Date(dateTimeStr);
      const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date).replace(/\//g, '.');
      const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

      return {
        date: formattedDate,
        time: formattedTime,
      };
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
  border: 1px solid var(--color-6);
  padding: 6px 12px;
  background-color: var(--color-5);
  border-radius: 30px;
  svg {
    fill: var(--color-2)
  }
  [data-theme="dark"] & {
    border-color: var(--color-2);
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
  svg {
    opacity: 0.5;
  }
}

.dashboard__transactions-button-show:hover {
  cursor: pointer;
  border: 1px solid var(--color-1);
}

.dashboard__transactions-button-show-text {
  margin-left: 12px;
  margin-right: 12px;
  color: var(--color-7);
  font-size: 15px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-2);
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
@media (max-width: 530px) {
  .dashboard__transactions-button-show {
    padding: 0;
  }
}

@media (max-width: 640px) {
  .dashboard__transactions-ul {
    max-height: 340px;
    overflow-y: scroll;
  }
  .dashboard__transactions-titles,
  .dashboard__transactions-transaction {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    text-align: center;
  }
  .dashboard__transactions-date-transaction {
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .dashboard__button-trx {
    background: none;
    border: none;
    svg {
      transform: rotate(270deg);
    }
  }
  .dashboard__dropdown-menu-mobile {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .dashboard__dropdown-menu-item-mobile,
  .dashboard__dropdown-menu-item-balance-mobile {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .dashboard__dropdown-menu-item-balance-mobile p:nth-child(1),
  .dashboard__dropdown-menu-item-mobile p:nth-child(1){
    color: var(--color-2);
  }

  .dashboard__dropdown-menu-item-balance-mobile p:nth-child(2),
  .dashboard__dropdown-menu-item-mobile p:nth-child(2){
    color: var(--color-1);
  }

  .dashboard__dropdown-menu-item-balance-mobile {
    margin-top: 18px;
  }
  .dashboard__button-explorer {
    box-shadow: none;
    align-items: center;
    border: 1px solid var(--color-6);
    padding: 6px 12px;
    background-color: var(--color-5);
    border-radius: 30px;
    svg {
      fill: var(--color-1)
    }
    [data-theme="dark"] & {
      border-color: var(--color-2);
      svg {
        fill: var(--color-1)
      }
    }
  }
  .dashboard__arrow-dropdown-up {
    svg {
      transform: rotate(90deg);
      fill: var(--color-3)
    }
  }
  .dashboard__transactions-button-show {
    display: none;
  }
  .dashboard__transactions-button-show-text {
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}
</style>
