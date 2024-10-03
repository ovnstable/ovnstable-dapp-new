// import Vue from 'vue';
import Vuex from 'vuex';

// refactored +-
import theme from '@/store/theme/index.ts';

// Web3
import createPersistedState from 'vuex-persistedstate';
import network from '@/store/web3/network.ts';
import walletAction from '@/store/web3/legacy/wallet-action.ts';
import web3 from '@/store/web3/web3.ts';

// Common
import gasPrice from '@/store/common/gas-price.ts';
import supplyData from '@/store/common/supply.ts';
import referral from '@/store/common/referral.ts';

// views
import accountData from '@/store/views/account/data.ts';
import insuranceData from '@/store/views/insurance/data.ts';
import tokenData from '@/store/views/market/tokenData.ts';
import portfolioData from '@/store/views/market/portfolioData.ts';
import collateralData from '@/store/views/market/collateralData.ts';
import payoutData from '@/store/views/market/payoutData.ts';
import insuranceTokenData from '@/store/views/insurance/insuranceTokenData.ts';
// import ovnTokenData from '@/store/views/ovn/ovnTokenData.ts';
import insurancePayouts from '@/store/views/insurance/InsurancePayouts.ts';
import insurancePremiums from '@/store/views/insurance/InsurancePremiums.ts';
import intervalDashboard from '@/store/views/dashboard/intervalDashboard.ts';
import porfolioBalanceData from '@/store/views/dashboard/porfolioBalanceData.ts';

// modals
import errorModal from '@/store/modals/error-modal.ts';
import waitingModal from '@/store/modals/waiting-modal.ts';
import successModal from '@/store/modals/success-modal.ts';
import dappDataAction from '@/store/web3/legacy/dapp-data-action.ts';
import mintRedeem from '@/store/views/main/mintRedeem/index.ts';
import odosData from '@/store/views/main/odos/index.ts';
import poolsData from '@/store/views/main/pools/index.ts';
import zapinData from '@/store/views/main/zapin/index.ts';

const store = new Vuex.Store({
  modules: {
    zapinData,
    odosData,
    mintRedeem,
    theme,
    errorModal,
    waitingModal,
    successModal,

    // views
    accountData,
    poolsData,
    insuranceData,

    // web3
    network,
    walletAction,
    web3,
    dappDataAction,

    // common
    gasPrice,
    supplyData,
    referral,
    tokenData,
    portfolioData,
    collateralData,
    payoutData,
    insuranceTokenData,
    // ovnTokenData,
    insurancePayouts,
    insurancePremiums,
    intervalDashboard,
    porfolioBalanceData,
  },

  plugins: [
    createPersistedState({ paths: ['transaction'] }),
  ],
});

export default store;
