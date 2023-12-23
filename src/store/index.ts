// import Vue from 'vue';
import Vuex from 'vuex';

// Web3
import createPersistedState from 'vuex-persistedstate';
import network from '@/store/modules/common/web3/network.ts';
import walletAction from '@/store/modules/common/web3/action/wallet-action.ts';
import contractAction from '@/store/modules/common/web3/action/contract-action.ts';
import web3 from '@/store/modules/common/web3/web3.ts';
import tokenAction from '@/store/modules/common/web3/action/token-action.ts';
import dappDataAction from '@/store/modules/common/web3/action/dapp/dapp-data-action.ts';
import dappUIAction from '@/store/modules/common/web3/action/dapp/dapp-ui-action.ts';

// Common
import gasPrice from '@/store/modules/common/gas-price.ts';
import supplyData from '@/store/modules/common/supply.ts';
import referral from '@/store/modules/common/referral.ts';
import etsAction from '@/store/modules/common/web3/action/ets-action.ts';

import accountUI from '@/store/modules/views/account/ui.ts';
import accountData from '@/store/modules/views/account/data.ts';
import insuranceData from '@/store/modules/views/insurance/data.ts';
import wrapUI from '@/store/modules/views/wrap/ui.ts';

export default new Vuex.Store({
  modules: {

    accountUI,
    accountData,
    insuranceData,

    // web3
    network,
    walletAction,
    contractAction,
    web3,
    tokenAction,
    dappDataAction,
    dappUIAction,
    etsAction,
    wrapUI,

    // common
    gasPrice,
    supplyData,
    referral,
  },

  plugins: [
    createPersistedState({ paths: ['transaction'] }),
  ],
});
