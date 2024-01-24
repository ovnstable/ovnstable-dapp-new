/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import {
  ABI_Exchange,
  ABI_Mark2market,
  ABI_Market, ABI_Ovn,
  ABI_OvnGovernor,
  ABI_OvnTimelock,
  ABI_PlusToken,
  ABI_PortfolioManager,
  ABI_WusdPlus,
  ERC20_ABI,
  EXCHANGER_INSURANCE_ABI,
  INSURANCE_TOKEN_ABI,
} from '@/assets/abi/index.ts';
import { chainContractsMap } from '@/utils/contractsMap.ts';

const contractsByChain: any = chainContractsMap;

const state = {};

const getters = {};

function load(abi: any, web3: any, address: string) {
  if (address == null) {
    return null;
  }
  return new web3.eth.Contract(abi, address);
}

const actions = {
  async initContracts({
    commit, dispatch, getters, rootState,
  }: any) {
    const { web3 } = rootState.web3;
    const network = rootState.network.networkName;
    const contracts: any = {};

    [
      // exchange
      contracts.exchange,
      contracts.daiExchange,
      contracts.usdtExchange,
      contracts.wethExchange,

      // ovn
      contracts.govToken,
      contracts.governor,

      // pm
      contracts.pm,
      contracts.daiPm,
      contracts.usdtPm,
      contracts.wethPm,
      contracts.timelockController,

      // plus
      contracts.usdPlus,
      contracts.daiPlus,
      contracts.usdtPlus,
      contracts.ethPlus,

      // m2m
      contracts.m2m,
      contracts.daiM2m,
      contracts.usdtM2m,
      contracts.wethM2m,

      // market
      contracts.market,
      contracts.marketWeth,

      // wUsdPlus
      contracts.wUsdPlus,
      contracts.wEthPlus,

      // assets
      contracts.asset,
      contracts.asset_two,
      contracts.dai,
      contracts.usdt,
      contracts.weth,
      contracts.ovn,
    ] = await Promise.all([

      // Exchange
      load(ABI_Exchange, web3, contractsByChain[network].usdPlus?.exchange ?? null),
      load(ABI_Exchange, web3, contractsByChain[network].daiPlus?.exchange ?? null),
      load(ABI_Exchange, web3, contractsByChain[network].usdtPlus?.exchange ?? null),
      load(ABI_Exchange, web3, contractsByChain[network].ethPlus?.exchange ?? null),

      // ovn
      load(ABI_Ovn, web3, contractsByChain[network]?.ovn ?? null),
      load(ABI_OvnGovernor, web3, contractsByChain[network]?.ovnGovernor ?? null),

      // PM
      load(
        ABI_PortfolioManager,
        web3,

        contractsByChain[network].usdPlus?.portfolioManager ?? null,
      ),
      load(
        ABI_PortfolioManager,
        web3,

        contractsByChain[network].daiPlus?.portfolioManager ?? null,
      ),
      load(
        ABI_PortfolioManager,
        web3,

        contractsByChain[network].usdtPlus?.portfolioManager ?? null,
      ),
      load(
        ABI_PortfolioManager,
        web3,

        contractsByChain[network].ethPlus?.portfolioManager ?? null,
      ),
      load(ABI_OvnTimelock, web3, contractsByChain[network]?.ovnTimelockController ?? null),

      // plus
      load(ABI_PlusToken, web3, contractsByChain[network].usdPlus?.tokenPlus ?? null),
      load(ABI_PlusToken, web3, contractsByChain[network].daiPlus?.tokenPlus ?? null),
      load(ABI_PlusToken, web3, contractsByChain[network].usdtPlus?.tokenPlus ?? null),
      load(ABI_PlusToken, web3, contractsByChain[network].ethPlus?.tokenPlus ?? null),

      // m2m
      load(ABI_Mark2market, web3, contractsByChain[network].usdPlus?.mark2market ?? null),
      load(ABI_Mark2market, web3, contractsByChain[network].daiPlus?.mark2market ?? null),
      load(ABI_Mark2market, web3, contractsByChain[network].usdtPlus?.mark2market ?? null),
      load(ABI_Mark2market, web3, contractsByChain[network].ethPlus?.mark2market ?? null),

      // market
      load(ABI_Market, web3, contractsByChain[network]?.market ?? null),
      load(ABI_Market, web3, contractsByChain[network]?.marketWeth ?? null),

      // wusd
      load(ABI_WusdPlus, web3, contractsByChain[network].usdPlus?.wUsdPlus ?? null),
      load(ABI_WusdPlus, web3, contractsByChain[network].wEthPlus?.tokenPlus ?? null),

      // assets
      load(ERC20_ABI, web3, contractsByChain[network]?.usdc ?? null),
      load(ERC20_ABI, web3, contractsByChain[network]?.wrapped ?? null),
      load(ERC20_ABI, web3, contractsByChain[network]?.dai ?? null),
      load(ERC20_ABI, web3, contractsByChain[network]?.usdt ?? null),
      load(ERC20_ABI, web3, contractsByChain[network]?.wETH ?? null),
      load(ERC20_ABI, web3, contractsByChain[network]?.ovn ?? null),
    ]);

    const insurances = [
      { network: 'optimism' },
    ];

    for (let i = 0; i < insurances.length; i += 1) {
      if (network === insurances[i].network) {
        contracts.insurance = {};
        contracts.insurance[`${insurances[i].network}_exchanger`] = load(EXCHANGER_INSURANCE_ABI, web3, contractsByChain[network]?.exchange_insurance ?? null);
        contracts.insurance[`${insurances[i].network}_token`] = load(INSURANCE_TOKEN_ABI, web3, contractsByChain[network]?.token_insurance ?? null);
      }
    }
    commit('web3/setContracts', contracts, { root: true });
  },
};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
