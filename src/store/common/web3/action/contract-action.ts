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
import { chainContractsMap, buildContract } from '@/utils/contractsMap.ts';

const contractsByChain: any = chainContractsMap;

const state = {};

const getters = {};

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
      contracts.usdcExchange,
      contracts.daiExchange,
      contracts.usdtExchange,
      contracts.wethExchange,

      // ovn
      contracts.govToken,
      contracts.governor,

      // pm
      contracts.pm,
      contracts.usdcPm,
      contracts.daiPm,
      contracts.usdtPm,
      contracts.wethPm,
      contracts.timelockController,

      // plus
      contracts.usdPlus,
      contracts.usdcPlus,
      contracts.daiPlus,
      contracts.usdtPlus,
      contracts.ethPlus,

      // m2m
      contracts.m2m,
      contracts.usdcM2m,
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
      contracts.usdcNative,
      contracts.weth,
      contracts.ovn,
    ] = await Promise.all([
      // Exchange
      buildContract(
        ABI_Exchange,
        web3,
        contractsByChain[network].usdPlus?.exchange ?? null,
      ),
      buildContract(
        ABI_Exchange,
        web3,
        contractsByChain[network].usdcPlus?.exchange ?? null,
      ),
      buildContract(
        ABI_Exchange,
        web3,
        contractsByChain[network].daiPlus?.exchange ?? null,
      ),
      buildContract(
        ABI_Exchange,
        web3,
        contractsByChain[network].usdtPlus?.exchange ?? null,
      ),
      buildContract(
        ABI_Exchange,
        web3,
        contractsByChain[network].ethPlus?.exchange ?? null,
      ),

      // ovn
      buildContract(ABI_Ovn, web3, contractsByChain[network]?.ovn ?? null),
      buildContract(
        ABI_OvnGovernor,
        web3,
        contractsByChain[network]?.ovnGovernor ?? null,
      ),

      // PM
      buildContract(
        ABI_PortfolioManager,
        web3,
        contractsByChain[network].usdPlus?.portfolioManager ?? null,
      ),
      buildContract(
        ABI_PortfolioManager,
        web3,
        contractsByChain[network].usdcPlus?.portfolioManager ?? null,
      ),
      buildContract(
        ABI_PortfolioManager,
        web3,
        contractsByChain[network].daiPlus?.portfolioManager ?? null,
      ),
      buildContract(
        ABI_PortfolioManager,
        web3,
        contractsByChain[network].usdtPlus?.portfolioManager ?? null,
      ),
      buildContract(
        ABI_PortfolioManager,
        web3,
        contractsByChain[network].ethPlus?.portfolioManager ?? null,
      ),
      buildContract(
        ABI_OvnTimelock,
        web3,
        contractsByChain[network]?.ovnTimelockController ?? null,
      ),

      // plus
      buildContract(
        ABI_PlusToken,
        web3,
        contractsByChain[network].usdPlus?.tokenPlus ?? null,
      ),
      buildContract(
        ABI_PlusToken,
        web3,
        contractsByChain[network].usdcPlus?.tokenPlus ?? null,
      ),
      buildContract(
        ABI_PlusToken,
        web3,
        contractsByChain[network].daiPlus?.tokenPlus ?? null,
      ),
      buildContract(
        ABI_PlusToken,
        web3,
        contractsByChain[network].usdtPlus?.tokenPlus ?? null,
      ),
      buildContract(
        ABI_PlusToken,
        web3,
        contractsByChain[network].ethPlus?.tokenPlus ?? null,
      ),

      // m2m
      buildContract(
        ABI_Mark2market,
        web3,
        contractsByChain[network].usdPlus?.mark2market ?? null,
      ),
      buildContract(
        ABI_Mark2market,
        web3,
        contractsByChain[network].usdcPlus?.mark2market ?? null,
      ),
      buildContract(
        ABI_Mark2market,
        web3,
        contractsByChain[network].daiPlus?.mark2market ?? null,
      ),
      buildContract(
        ABI_Mark2market,
        web3,
        contractsByChain[network].usdtPlus?.mark2market ?? null,
      ),
      buildContract(
        ABI_Mark2market,
        web3,
        contractsByChain[network].ethPlus?.mark2market ?? null,
      ),

      // market
      buildContract(ABI_Market, web3, contractsByChain[network]?.market ?? null),
      buildContract(ABI_Market, web3, contractsByChain[network]?.marketWeth ?? null),

      // wusd
      buildContract(
        ABI_WusdPlus,
        web3,
        contractsByChain[network].usdPlus?.wUsdPlus ?? null,
      ),
      buildContract(
        ABI_WusdPlus,
        web3,
        contractsByChain[network].wEthPlus?.tokenPlus ?? null,
      ),

      // assets
      buildContract(ERC20_ABI, web3, contractsByChain[network]?.usdc ?? null),
      buildContract(ERC20_ABI, web3, contractsByChain[network]?.wrapped ?? null),
      buildContract(ERC20_ABI, web3, contractsByChain[network]?.dai ?? null),
      buildContract(ERC20_ABI, web3, contractsByChain[network]?.usdt ?? null),
      buildContract(ERC20_ABI, web3, contractsByChain[network]?.usdcNative ?? null),
      buildContract(ERC20_ABI, web3, contractsByChain[network]?.wETH ?? null),
      buildContract(ERC20_ABI, web3, contractsByChain[network]?.ovn ?? null),
    ]);

    const insurances = [{ network: 'optimism' }, { network: 'arbitrum' }];

    for (let i = 0; i < insurances.length; i++) {
      if (network === insurances[i].network) {
        contracts.insurance = {};
        contracts.insurance[`${insurances[i].network}_exchanger`] = buildContract(
          EXCHANGER_INSURANCE_ABI,
          web3,
          contractsByChain[network]?.exchange_insurance ?? null,
        );
        contracts.insurance[`${insurances[i].network}_token`] = buildContract(
          INSURANCE_TOKEN_ABI,
          web3,
          contractsByChain[network]?.token_insurance ?? null,
        );
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
