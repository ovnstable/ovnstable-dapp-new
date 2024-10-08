<template>
  <div class="insurance__payouts">
    <div class="insurance__payouts-titles">
      <p>Payable date, UTC</p>
      <p v-if="!device.isMobile">Daily profit, OVN per 1 INS</p>
      <p v-else>Daily profit,<br>
        OVN per 1 INS
      </p>
      <p>Cumulative return</p>
      <p>Explorer</p>
    </div>
    <TransitionGroup
      name="list"
      tag="ul"
      class="insurance__payouts-transactions-ul"
    >
      <div
        v-for="trx in visibleTransactions"
        :key="trx.id"
        class="insurance__payouts-transactions"
      >
        <div class="insurance__payouts-transaction">
          <div class="insurance__payouts-date-transaction">
            <p>{{ formatDateTime(trx.date).date }}</p>
            <span
              v-if="device.isMobile"
              class="insurance__payouts-time"
            >
              {{ formatDateTime(trx.date).time }}
            </span>
          </div>

          <p>OVN {{ trx.dailyProfit }}</p>
          <p>{{ trx.comp }}%</p>
          <div
            class="insurance__payouts-id-link"
          >
            <a
              :href="`${networkScan}tx/${trx.hash}`"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Link for token"
              class="link-ovn"
            >
              <ButtonComponent class="insurance__button-payout">
                <BaseIcon
                  :name="device.isMobile != true ? 'PayoutArrow' : 'ArrowRight'"
                />
              </ButtonComponent>
            </a>
          </div>
        </div>
        <div
          class="insurance__payouts-divider"
        />
      </div>
    </TransitionGroup>

    <button
      class="insurance__payouts-button-show"
      @click="showMoreTransactions"
      v-if="hasMoreTransactions"
      type="button"
    >
      <BaseIcon
        name="ArrowDown"
      />
      <p class="insurance__payouts-button-show-text">SHOW MORE</p>
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
  name: 'InsurancePayouts',
  components: {
    BaseIcon,
    ButtonComponent,
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
      return this.$store.state.network.insuranceExplorerURL;
    },
    visibleTransactions() {
      if (!this.device.isMobile) {
        return this.payoutData.slice(0, this.visibleTransactionCount);
      }
      return this.payoutData;
    },
    hasMoreTransactions() {
      return this.payoutData.length > this.visibleTransactionCount;
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

.insurance__button-payout {
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
.insurance__button-payout:hover {
  background-color: var(--color-6);
  border-color: var(--color-3);
  svg {
    fill: var(--color-1)
  }
}
.insurance__payouts-horizontal-divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-6);
}

.insurance__payouts {
  display: flex;
  flex-direction: column;
  background: var(--color-8);
  padding: 20px;
  [data-theme="dark"] & {
    background: var(--color-6);
  }
}
.insurance__payouts-text {
  text-align: left;
  margin-bottom: 20px;
  color: var(--color-1);
  font-size: 17px;
  font-weight: 600;
}
.insurance__payouts-titles {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 22px;
  margin-top: 14px;
}
.insurance__payouts-divider {
  border: 1px solid var(--color-17);
  margin-top: 14px;
  margin-bottom: 12px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.insurance__payouts-transaction {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.insurance__payouts-titles {
  flex-direction: row;
  margin-bottom: 22px;
}
.insurance__payouts-titles p,
.insurance__payouts-transactions p {
  text-align: center;
  flex: 1;
}

.insurance__payouts-transactions p {
  font-size: 15px;
  font-weight: 400;
}
.insurance__payouts-transactions p:not(:last-child) {
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.insurance__payouts-titles p:first-child,
.insurance__payouts-transactions p:first-child {
  text-align: left;
}
.insurance__payouts-titles p:nth-child(1),
.insurance__payouts-transactions p:nth-child(1) {
  flex: 2;
}

.insurance__payouts-titles p:nth-child(2),
.insurance__payouts-transactions p:nth-child(2),
.insurance__payouts-titles p:nth-child(3),
.insurance__payouts-transactions p:nth-child(3) {
  flex: 3;
}

.insurance__payouts-titles p:nth-child(4),
.insurance__payouts-transactions .insurance__payouts-id-link {
  flex: 2;
  display: flex;
  justify-content: flex-end;
}

.insurance__payouts-id-link p {
  max-width: fit-content;
  font-size: 15px;
  font-weight: 400;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.insurance__payouts-id-link:hover p {
  cursor: pointer;
  [data-theme="dark"] & {
    color: var(--color-2);
  }
}
.insurance__payouts-date-transaction {
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

.insurance__payouts-time {
  white-space: nowrap;
}

.insurance__payouts-button-show {
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

.insurance__payouts-button-show:hover {
  cursor: pointer;
  border: 2px solid var(--color-1);
}

.insurance__payouts-button-show-text {
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
  .insurance__payouts-date-transaction {
    margin-right: 10px;
  }
}

@media (max-width: 768px) {
  .insurance__payouts-button-show {
    padding: 6px 225px;
    p {
      font-size: 14px;
    }
  }

  .insurance__payouts-button-show-text {
    white-space: nowrap;
  }

  .insurance__payouts-titles {
    display: grid;
    grid-template-columns: 1fr 1.3fr 1.3fr 1fr;
    text-align: center;
    font-size: 14px;
  }
  .insurance__payouts-transaction p {
    font-size: 13px;
  }
  .insurance__payouts-date-transaction {
    margin: 0;
    padding: 0;
  }
}

@media (max-width: 640px) {
   .insurance__payouts-transactions-ul {
    min-width: 500px;
    max-height: 320px;
    overflow-y: scroll;
  }
  .insurance__payouts-titles {
    min-width: 500px;
  }
  .insurance__payouts {
    overflow-x: scroll;
  }
  .insurance__payouts-button-show {
    display: none;
  }
  .insurance__button-payout {
    box-shadow: none !important;
    background: none !important;
    border: none !important;
  }
  .insurance__payouts-titles {
    grid-template-columns: 1fr 2.6fr 1.2fr 1fr;
  }
  .insurance__payouts-titles p:nth-child(3),
  .insurance__payouts-transaction p:nth-child(3) {
    text-align: right;
  }

  .insurance__payouts-transactions p[data-v-f33d99a8]:nth-child(3) {
    flex: 2.5;
  }
  .insurance__payouts-transactions p[data-v-f33d99a8]:nth-child(2) {
    flex: 4.5
  }
  .insurance__payouts-titles p {
    font-size: 12px;
  }
  .insurance__payouts-transactions p,
  .insurance__payouts-time {
    font-size: 14px;
  }
  .insurance__payouts-date-transaction {
    display: block;
  }
}
</style>
