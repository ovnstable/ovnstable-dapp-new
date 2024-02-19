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

// views
import accountUI from '@/store/views/account/ui.ts';
import accountData from '@/store/views/account/data.ts';
import insuranceData from '@/store/views/insurance/data.ts';
import tokenData from '@/store/views/market/tokenData.ts';
import portfolioData from '@/store/views/market/portfolioData.ts';
import collateralData from '@/store/views/market/collateralData.ts';
import payoutData from '@/store/views/market/payoutData.ts';
import insuranceTokenData from '@/store/views/insurance/insuranceTokenData.ts';
import insurancePayouts from '@/store/views/insurance/InsurancePayouts.ts';
import insurancePremiums from '@/store/views/insurance/InsurancePremiums.ts';

// modals
import errorModal from '@/store/modals/error-modal.ts';
import waitingModal from '@/store/modals/waiting-modal.ts';
import successModal from '@/store/modals/success-modal.ts';
import accTransaction from '@/store/views/account/transaction.ts';
import dappDataAction from '@/store/web3/legacy/dapp-data-action.ts';
import mintRedeem from '@/store/views/main/mintRedeem/index.ts';
import odosData from '@/store/views/main/odos/index.ts';
import poolsData from '@/store/views/main/pools/index.ts';
import zapinData from '@/store/views/main/zapin/index.ts';

export default new Vuex.Store({
  modules: {
    zapinData,
    odosData,
    mintRedeem,
    theme,
    errorModal,
    waitingModal,
    successModal,

    // views
    accountUI,
    accountData,
    poolsData,
    accTransaction,
    insuranceData,

    // web3
    network,
    walletAction,
    contractAction,
    web3,
    tokenAction,
    dappDataAction,
    etsAction,

    // common
    gasPrice,
    supplyData,
    referral,
    tokenData,
    portfolioData,
    collateralData,
    payoutData,
    insuranceTokenData,
    insurancePayouts,
    insurancePremiums,
  },

  plugins: [
    createPersistedState({ paths: ['transaction'] }),
  ],
});
