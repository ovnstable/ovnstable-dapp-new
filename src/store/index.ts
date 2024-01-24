// import Vue from 'vue';
import Vuex from 'vuex';

// refactored +-
import theme from '@/store/theme/index.ts';

// Web3
import createPersistedState from 'vuex-persistedstate';
import network from '@/store/common/web3/network.ts';
import walletAction from '@/store/common/web3/action/wallet-action.ts';
import contractAction from '@/store/common/web3/action/contract-action.ts';
import web3 from '@/store/common/web3/web3.ts';
import tokenAction from '@/store/common/web3/action/token-action.ts';
import dappDataAction from '@/store/common/web3/action/dapp/dapp-data-action.ts';
import dappUIAction from '@/store/common/web3/action/dapp/dapp-ui-action.ts';

// Common
import gasPrice from '@/store/common/gas-price.ts';
import supplyData from '@/store/common/supply.ts';
import referral from '@/store/common/referral.ts';
import etsAction from '@/store/common/web3/action/ets-action.ts';

import accountUI from '@/store/views/account/ui.ts';
import accountData from '@/store/views/account/data.ts';
import insuranceData from '@/store/views/insurance/data.ts';
import wrapUI from '@/store/views/wrap/ui.ts';
import odosData from '@/store/odos/index.ts';
import tokenData from '@/store/views/market/tokenData.ts';
import portfolioData from '@/store/views/market/portfolioData.ts';


// modals
import errorModal from '@/store/modals/error-modal.ts';
import waitingModal from '@/store/modals/waiting-modal.ts';
import successModal from '@/store/modals/success-modal.ts';

export default new Vuex.Store({
  modules: {
    odosData,
    theme,
    errorModal,
    waitingModal,
    successModal,

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
    tokenData,
    portfolioData,
  },

  plugins: [
    createPersistedState({ paths: ['transaction'] }),
  ],
});
