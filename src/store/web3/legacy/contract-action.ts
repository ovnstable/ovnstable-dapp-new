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
import { chainContractsMap, buildEvmContractForChain } from '@/utils/contractsMap.ts';

const contractsByChain: any = chainContractsMap;

const state = {};

const getters = {};

const actions = {
  async initContracts({
    commit, dispatch, getters, rootState,
  }: any, evmSigner: any) {
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
      contracts.usdcBridged,
      contracts.weth,
      contracts.ovn,
      // for blast
      contracts.usdb,
    ] = await Promise.all([
      // Exchange
      buildEvmContractForChain(
        ABI_Exchange,
        evmSigner,
        contractsByChain[network].usdPlus?.exchange ?? null,
      ),
      buildEvmContractForChain(
        ABI_Exchange,
        evmSigner,
        contractsByChain[network].usdcPlus?.exchange ?? null,
      ),
      buildEvmContractForChain(
        ABI_Exchange,
        evmSigner,
        contractsByChain[network].daiPlus?.exchange ?? null,
      ),
      buildEvmContractForChain(
        ABI_Exchange,
        evmSigner,
        contractsByChain[network].usdtPlus?.exchange ?? null,
      ),
      buildEvmContractForChain(
        ABI_Exchange,
        evmSigner,
        contractsByChain[network].ethPlus?.exchange ?? null,
      ),

      // ovn
      buildEvmContractForChain(ABI_Ovn, evmSigner, contractsByChain[network]?.ovn ?? null),
      buildEvmContractForChain(
        ABI_OvnGovernor,
        evmSigner,
        contractsByChain[network]?.ovnGovernor ?? null,
      ),

      // PM
      buildEvmContractForChain(
        ABI_PortfolioManager,
        evmSigner,
        contractsByChain[network].usdPlus?.portfolioManager ?? null,
      ),
      buildEvmContractForChain(
        ABI_PortfolioManager,
        evmSigner,
        contractsByChain[network].usdcPlus?.portfolioManager ?? null,
      ),
      buildEvmContractForChain(
        ABI_PortfolioManager,
        evmSigner,
        contractsByChain[network].daiPlus?.portfolioManager ?? null,
      ),
      buildEvmContractForChain(
        ABI_PortfolioManager,
        evmSigner,
        contractsByChain[network].usdtPlus?.portfolioManager ?? null,
      ),
      buildEvmContractForChain(
        ABI_PortfolioManager,
        evmSigner,
        contractsByChain[network].ethPlus?.portfolioManager ?? null,
      ),
      buildEvmContractForChain(
        ABI_OvnTimelock,
        evmSigner,
        contractsByChain[network]?.ovnTimelockController ?? null,
      ),

      // plus
      buildEvmContractForChain(
        ABI_PlusToken,
        evmSigner,
        contractsByChain[network].usdPlus?.tokenPlus ?? null,
      ),
      buildEvmContractForChain(
        ABI_PlusToken,
        evmSigner,
        contractsByChain[network].usdcPlus?.tokenPlus ?? null,
      ),
      buildEvmContractForChain(
        ABI_PlusToken,
        evmSigner,
        contractsByChain[network].daiPlus?.tokenPlus ?? null,
      ),
      buildEvmContractForChain(
        ABI_PlusToken,
        evmSigner,
        contractsByChain[network].usdtPlus?.tokenPlus ?? null,
      ),
      buildEvmContractForChain(
        ABI_PlusToken,
        evmSigner,
        contractsByChain[network].ethPlus?.tokenPlus ?? null,
      ),

      // m2m
      buildEvmContractForChain(
        ABI_Mark2market,
        evmSigner,
        contractsByChain[network].usdPlus?.mark2market ?? null,
      ),
      buildEvmContractForChain(
        ABI_Mark2market,
        evmSigner,
        contractsByChain[network].usdcPlus?.mark2market ?? null,
      ),
      buildEvmContractForChain(
        ABI_Mark2market,
        evmSigner,
        contractsByChain[network].daiPlus?.mark2market ?? null,
      ),
      buildEvmContractForChain(
        ABI_Mark2market,
        evmSigner,
        contractsByChain[network].usdtPlus?.mark2market ?? null,
      ),
      buildEvmContractForChain(
        ABI_Mark2market,
        evmSigner,
        contractsByChain[network].ethPlus?.mark2market ?? null,
      ),

      // market
      buildEvmContractForChain(ABI_Market, evmSigner, contractsByChain[network]?.market ?? null),
      buildEvmContractForChain(
        ABI_Market,
        evmSigner,
        contractsByChain[network]?.marketWeth ?? null,
      ),

      // wusd
      buildEvmContractForChain(
        ABI_WusdPlus,
        evmSigner,
        contractsByChain[network].usdPlus?.wUsdPlus ?? null,
      ),
      buildEvmContractForChain(
        ABI_WusdPlus,
        evmSigner,
        contractsByChain[network].wEthPlus?.tokenPlus ?? null,
      ),

      // assets
      buildEvmContractForChain(ERC20_ABI, evmSigner, contractsByChain[network]?.usdc ?? null),
      buildEvmContractForChain(ERC20_ABI, evmSigner, contractsByChain[network]?.wrapped ?? null),
      buildEvmContractForChain(ERC20_ABI, evmSigner, contractsByChain[network]?.dai ?? null),
      buildEvmContractForChain(ERC20_ABI, evmSigner, contractsByChain[network]?.usdt ?? null),
      buildEvmContractForChain(
        ERC20_ABI,
        evmSigner,
        contractsByChain[network]?.usdcNative ?? null,
      ),
      buildEvmContractForChain(ERC20_ABI, evmSigner, contractsByChain[network]?.usdc ?? null),
      buildEvmContractForChain(ERC20_ABI, evmSigner, contractsByChain[network]?.wETH ?? null),
      buildEvmContractForChain(ERC20_ABI, evmSigner, contractsByChain[network]?.ovn ?? null),
      buildEvmContractForChain(
        ERC20_ABI,
        evmSigner,
        contractsByChain[network]?.usdb ?? null,
      ),
    ]);

    const insurances = [{ network: 'optimism' }, { network: 'arbitrum' }];

    for (let i = 0; i < insurances.length; i++) {
      if (network === insurances[i].network) {
        contracts.insurance = {};
        contracts.insurance[`${insurances[i].network}_exchanger`] = buildEvmContractForChain(
          EXCHANGER_INSURANCE_ABI,
          evmSigner,
          contractsByChain[network]?.exchange_insurance ?? null,
        );
        contracts.insurance[`${insurances[i].network}_token`] = buildEvmContractForChain(
          INSURANCE_TOKEN_ABI,
          evmSigner,
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
