/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getUnixTsNow } from '@/utils/dates.ts';

const dDayjs = dayjs.extend(duration);

const state = {
  transactions: [],
};

const getters = {

  transactions(state: any) {
    return state.transactions;
  },
};

const actions = {

  async putTransaction({
    commit, dispatch, getters, rootState,
  }: any, tx: any) {
    tx.date = getUnixTsNow();
    tx.pending = true;
    tx.isError = false;
    tx.chain = rootState.network.networkId;

    getters.transactions.push(tx);
    commit('setTransactions', getters.transactions);
  },

  clearTransaction({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setTransactions', []);
  },

  deleteTxFromHistory({
    commit, dispatch, getters, rootState,
  }: any, hash: string) {
    const filteredTx = getters.transactions.filter((tx: any) => tx.hash !== hash);
    commit('setTransactions', filteredTx);
  },

  loadTransaction({
    commit, dispatch, getters, rootState,
  }: any) {
    console.log('Transaction: loadTransaction');

    for (let i = 0; i < getters.transactions.length; i++) {
      const transaction = getters.transactions[i];

      if (transaction == null || transaction.pending !== true) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const delay = (t: number) => new Promise((resolve) => { setTimeout(resolve, t); });

      const transactionReceiptRetry = () => rootState
        .web3.web3.eth.getTransactionReceipt(transaction.hash)
        .then((receipt: any) => {
          if (transaction.chain !== rootState.network.networkId) {
            return delay(1000).then(transactionReceiptRetry);
          }

          if (receipt != null) {
            receipt.cancel = false;
            return receipt;
          }
          const minutes = dDayjs.duration(getUnixTsNow().diff(dayjs(transaction.date))).asMinutes();

          if (minutes > 10) {
            receipt = { transactionHash: transaction.hash, cancel: true };
            return receipt;
          }
          return delay(1000).then(transactionReceiptRetry);
        });

      transactionReceiptRetry().then((receipt: any) => {
        const filteredTx = getters
          .transactions.find((tx: any) => tx.hash === receipt.transactionHash);
        filteredTx.pending = false;
        filteredTx.receipt = receipt;

        if (receipt && !receipt.cancel) {
          filteredTx.isError = !receipt.status;
          filteredTx.isCancelled = false;
        } else {
          filteredTx.isError = false;
          filteredTx.isCancelled = true;
        }

        commit('setTransactions', getters.transactions);
      });
    }
  },
};

const mutations = {
  setTransactions(state: any, transactions: any) {
    state.transactions = transactions;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
