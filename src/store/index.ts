// import Vue from 'vue';
import Vuex from 'vuex';

// refactored +-
import theme from '@/store/theme/index.ts';

// Web3
import createPersistedState from 'vuex-persistedstate';
import network from '@/store/web3/network.ts';
import walletAction from '@/store/web3/legacy/wallet-action.ts';
import contractAction from '@/store/web3/legacy/contract-action.ts';
import web3 from '@/store/web3/web3.ts';
import tokenAction from '@/store/web3/legacy/token-action.ts';

// Common
import gasPrice from '@/store/common/gas-price.ts';
import supplyData from '@/store/common/supply.ts';
import referral from '@/store/common/referral.ts';
import etsAction from '@/store/web3/legacy/ets-action.ts';

import accountUI from '@/store/views/account/ui.ts';
import accountData from '@/store/views/account/data.ts';
import insuranceData from '@/store/views/insurance/data.ts';
import wrapUI from '@/store/views/wrap/ui.ts';
import odosData from '@/store/odos/index.ts';
import tokenData from '@/store/views/market/tokenData.ts';
import portfolioData from '@/store/views/market/portfolioData.ts';
import collateralData from '@/store/views/market/collateralData.ts';
import payoutData from '@/store/views/market/payoutData.ts';
import mintRedeem from '@/store/mintRedeem/index.ts';

// modals
import errorModal from '@/store/modals/error-modal.ts';
import waitingModal from '@/store/modals/waiting-modal.ts';
import successModal from '@/store/modals/success-modal.ts';
import accTransaction from '@/store/views/account/transaction.ts';
import dappUIAction from '@/store/web3/legacy/dapp-ui-action.ts';
import dappDataAction from '@/store/web3/legacy/dapp-data-action.ts';

export default new Vuex.Store({
  modules: {
    odosData,
    mintRedeem,
    theme,
    errorModal,
    waitingModal,
    successModal,

    accountUI,
    accountData,
    accTransaction,
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
    collateralData,
    payoutData,
  },

  plugins: [
    createPersistedState({ paths: ['transaction'] }),
  ],
});
