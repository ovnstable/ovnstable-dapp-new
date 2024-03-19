<template>
  <div class="account__modal-transactions">
    <div class="account__modal-trx-history">
      <p>TRANSACTION HISTORY</p>
      <div
        v-if="transactions.length != 0"
        class="account__modal-clear-trx"
      >
        <p>Clear history</p>
        <ButtonComponent
          @click="clearTransaction"
          @keypress="clearTransaction"
        >
          <BaseIcon name="DeleteHistory" />
        </ButtonComponent>

      </div>
    </div>
    <div
      v-if="transactions.length != 0"
      class="account__modal-list-trx"
      :class="{ 'ovn-trxs': isOvnTrxs }"
    >
      <div class="account__modal-list-trx-titles">
        <p>Token</p>
        <p>Amount</p>
        <p>Date</p>
        <p>Status</p>
      </div>
      <TransitionGroup
        name="list"
        tag="ul"
        class="account__modal-list-trx-container"
      >
        <div
          v-for="(trx, index) in transactions"
          :key="trx.hash"
          :class="{
            'account__modal-list-trx-transactions': true,
            'first-transaction': index === 0,
            'last-transaction': index === transactions.length - 1,
          }"
        >
          <div class="account__modal-list-trx-transaction">
            <p>token</p>
            <p>{{ trx.amount }}</p>
            <p>{{ formatDateTime(trx.date) }}</p>
            <p>{{ trx.pending }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <div
      v-else
      class="account__modal-list-no-trx"
      :class="{ 'ovn-trxs': isOvnTrxs }"
    >
      <p>YOU HAVEN'T ANY <span v-if="isOvnTrxs">OVN</span> TRANSACTIONS YET</p>
    </div>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AccountTransactions',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  props: {
    isOvnTrxs: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showMore: false,
    };
  },
  computed: {
    ...mapGetters('accTransaction', ['transactions']),
  },
  mounted() {
    this.loadTransaction();
  },
  methods: {
    ...mapActions('accTransaction', ['loadTransaction', 'clearTransaction']),
    formatDateTime(dateTimeStr: number) {
      const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' } as any;
      const optionsTime = { hour: '2-digit', minute: '2-digit' } as any;

      const date = new Date(dateTimeStr);
      const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date).replace(/\//g, '.');
      const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

      return `${formattedDate} ${formattedTime}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.account__modal-transactions {
  display: flex;
  flex-direction: column;
}
.account__modal-trx-history {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 14px;
  p {
    align-items: center;
    display: flex;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.account__modal-trx-history:first-child {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-1);
}

.account__modal-clear-trx {
  display: flex;
  flex-direction: row;
  p {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-2);
    margin-right: 12px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
  button {
    padding: 0;
    background: none;
    border: none;
    box-shadow: none;
  }
}

.account__modal-list-trx,
.account__modal-list-no-trx {
  display: flex;
  flex-direction: column;
  background: var(--color-8);
  padding: 20px;
  max-height: 320px;
  border-radius: 5px;
  overflow-y: scroll;
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}
.account__modal-list-no-trx {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 20px;
  p {
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}
.account__modal-list-trx::-webkit-scrollbar-track {
  background-color: var(--color-4);
  border-radius: 50px;
  border: 1px solid var(--color-5);
}

.account__modal-list-trx::-webkit-scrollbar-thumb {
  background-color: var(--color-6);
  border-radius: 50px;
  height: 12px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}
.account__modal-list-trx::-webkit-scrollbar {
  width: 12px;
}

.account__modal-list-trx-titles {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  color: var(--color-2);
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 20px;
  margin-top: 14px;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.account__modal-list-trx-divider {
  border: 1px solid var(--color-17);
  margin-top: 14px;
  margin-bottom: 12px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.account__modal-list-trx-transaction {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.account__modal-list-trx-titles {
  flex-direction: row;
  margin-bottom: 22px;
}

.account__modal-list-trx-transactions p {
  font-size: 15px;
  font-weight: 400;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.account__modal-list-trx-container {
  list-style: none;
  padding: 0;
}

.account__modal-list-trx-transactions {
  margin-top: 28px;
  margin-bottom: 28px;
}
.first-transaction {
  margin-top: 0;
}

.last-transaction {
  margin-bottom: 0;
}
.account__modal-list-trx-titles,
.account__modal-list-trx-transaction {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  text-align: center;
}

.account__modal-list-trx-titles :nth-child(1),
.account__modal-list-trx-transaction :nth-child(1) {
  text-align: left;
}

.account__modal-list-trx-titles :last-child,
.account__modal-list-trx-transaction :last-child {
  text-align: right;
}

.account__modal-list-trx-id-link {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.account__modal-list-trx-date-transaction {
  display: flex;
  flex-direction: row;
  flex: 2;
  color: var(--color-1);
  font-size: 15px;
  font-weight: 400;
  max-width: 160px;
  justify-content: space-between;
}

@media (max-width: 1024px) {
  .account__modal-list-trx-date-transaction {
    margin-right: 10px;
  }
}

@media (max-width: 400px) {
  .ovn-trxs {
    max-width: 360px;
  }
}
</style>
