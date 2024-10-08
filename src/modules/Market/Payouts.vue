<template>
  <div class="performance__payouts">
    <div class="performance__payouts-titles">
      <p>Payable date, UTC</p>
      <p v-if="!device.isMobile">Daily profit,
        {{ payoutData.collateralToken }} per {{ payoutData.tokenName }}</p>
      <p v-else>Daily profit,<br>
        {{ payoutData.collateralToken }} per {{ payoutData.tokenName }}
      </p>
      <p>Annualized yield, % per year</p>
      <p>Explorer</p>
    </div>
    <TransitionGroup
      name="list"
      tag="ul"
      class="performance__payouts-transactions-ul"
    >
      <div
        v-for="(trx, index) in visibleTransactions"
        :key="trx.id"
        class="performance__payouts-transactions"
      >
        <div class="performance__payouts-transaction">
          <div class="performance__payouts-date-transaction">
            <p>{{ formatDateTime(trx.payableDate).date }}</p>
            <span class="performance__payouts-time">{{ formatDateTime(trx.payableDate).time }}</span>
          </div>
          <p>{{ formatProfit(trx.dailyProfit, payoutData.collateralToken) }}</p>
          <p>{{ trx.annualizedYield }}%</p>
          <div class="performance__payouts-id-link">
            <a
              :href="`${networkScan}tx/${trx.transactionHash}`"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Link for token"
              class="link-ovn"
            >
              <template v-if="!device.isMobile">
                <p>{{ formatTransactionID(trx.transactionHash) }}</p>
              </template>
              <BaseIcon
                v-else
                name="ArrowRight"
              />
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
import { deviceType } from '@/utils/deviceType.ts';

export default {
  name: 'PortfolioPayouts',
  components: {
    BaseIcon,
  },
  props: {
    payoutData: {
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
    device() {
      return deviceType();
    },
    networkScan() {
      return this.$store.state.network.marketExplorerURL;
    },
    visibleTransactions() {
      if (!this.device.isMobile) {
        return this.payoutData.payouts.slice(0, this.visibleTransactionCount);
      }
      return this.payoutData.payouts;
    },
    hasMoreTransactions() {
      return this.payoutData.payouts.length > this.visibleTransactionCount;
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
  [data-theme="dark"] & {
    background: var(--color-6);
  }
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
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.performance__payouts-divider {
  border: 1px solid var(--color-17);
  margin-top: 17px;
  margin-bottom: 13px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
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
  font-size: 15px;
  font-weight: 400;
}
.performance__payouts-transactions p:not(:last-child) {
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
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
  font-size: 15px;
  font-weight: 400;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.performance__payouts-id-link:hover p {
  cursor: pointer;
  [data-theme="dark"] & {
    color: var(--color-2);
  }
}
.performance__payouts-date-transaction {
  display: flex;
  flex-direction: row;
  flex: 2;
  color: var(--color-1);
  font-size: 15px;
  font-weight: 400;
  max-width: 160px;
  justify-content: space-between;
  margin-right: 30px;
  padding-right: 30px;
}

.performance__payouts-time {
  white-space: nowrap;
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
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
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
  .performance__payouts-date-transaction {
    margin-right: 10px;
  }
}
@media (max-width: 768px) {
  .performance__payouts-titles p {
    font-size: 14px;
  }
  .performance__payouts-transaction p,
  .performance__payouts-time {
    font-size: 13px;
  }
  .performance__payouts-time {
    margin-left: 4px;
  }
  .performance__payouts-button-show {
    padding: 5px;
  }
  .performance__payouts-titles p:nth-child(2) {
    margin-right: 20px;
  }
  .performance__payouts-transaction p:nth-child(2) {
    text-align: left;
  }
  .performance__payouts-date-transaction {
    min-width: 136px;
  }
}

@media (max-width: 640px) {
  .performance__payouts-transactions-ul {
    min-width: 500px;
    max-height: 340px;
    overflow-y: scroll;
  }
  .performance__payouts-titles {
    min-width: 500px;
  }
  .performance__payouts {
    overflow-x: scroll;
  }
  .performance__payouts-date-transaction {
    display: inline-block;
    margin: 0;
    padding: 0;
    min-width: 60px;
    margin-right: 40px;
  }
  .performance__payouts-id-link {
    max-width: 76px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .performance__payouts-titles p:last-child {
    margin-left: 2px;
  }

  .performance__payouts-titles p {
    display: flex;
    align-items: center;
  }
  .performance__payouts-button-show {
    display: none;
  }

  .performance__payouts {
    padding: 20px;
  }
  .performance__payouts-titles p {
    font-size: 12px;
  }

  .performance__payouts-transaction p,
  .performance__payouts-time,
  .performance__payouts-button-show-text {
    font-size: 14px;
  }

  .performance__payouts-time,
  .performance__payouts-titles p:nth-child(2) {
    margin: 0;
  }

  .performance__payouts-titles p:nth-child(2) {
    margin-left: 30px;
    margin-right: 12px;
  }
}

</style>
