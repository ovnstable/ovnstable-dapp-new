/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import { poolsInfoMap, zapPlatformContractTypeMap } from '@/store/views/main/zapin/mocks.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { JSONLoader } from '@/utils/httpUtils.ts';

import { zapInStep } from '@/store/modals/waiting-modal.ts';
import { formatPositionData } from '@/components/Pools/PositionsTable/helpers.ts';
import type { ContractAbi } from '@/types/abi';

export enum REWARD_TOKEN {
  AERO = 'AERO',
  CAKE = 'Cake'
}

enum poolVersionList {
  v2,
  v3,
  v3rebalance
}

type TSrcMap = {
  [key: string]: (chainName: string, platformName: string) => string;
}

export const srcStringBuilder = (fileType: string) => (
  chainName: string,
  fileName: string,
): string => `contracts/${chainName}/${fileName}${fileType}.json`;

export const zapAbiSrcMap: TSrcMap = {
  v2: srcStringBuilder('Zap'),
  v3: srcStringBuilder('V3Zap'),
};

export const gaugeSrcMap: TSrcMap = {
  v2: srcStringBuilder('Gauge'),
  v3: srcStringBuilder('V3Gauge'),
  [poolVersionList.v3rebalance]: srcStringBuilder('V3GaugeRebalance'),
};

export const poolTokenSrcMap: TSrcMap = {
  v2: srcStringBuilder('PoolToken'),
  v3: srcStringBuilder('V3PoolToken'),
};

export const nftSrcMap: TSrcMap = {
  v3: srcStringBuilder('V3Nft'),
};

export const rebalanceChainMap: {[key: string]: string} = {
  base: 'Aerodrome',
  arbitrum: 'Pancake',
};

export const loadAbi = async (abiFileSrc: string): Promise<ContractAbi> => {
  try {
    const abiFile = await JSONLoader(abiFileSrc);
    if (!abiFile || !abiFile?.abi) return {} as ContractAbi;
    return abiFile;
  } catch (e) {
    console.log('Error fetching ABI file');
  }
  return {} as ContractAbi;
};

const defaultState = () => ({
  zapPoolRoot: null,
  positionContract: null,
  currentZapPlatformContractType: null,
  zapContract: null,
  // for v2
  poolTokenContract: null,
  // for v3
  poolNftContract: null,
  gaugeContract: null,
  // for rebalance on aero currently
  gaugeContractV3: null,
  currentStage: zapInStep.START,
  zapLoaded: false,
});

const stateData = {
  ...defaultState(),
  userPositions: [],
};

const getters = {
  getUserPositions(state: typeof stateData) {
    return state.userPositions;
  },
  isZapLoaded(state: typeof stateData) {
    return state.zapLoaded;
  },
};

const actions = {
  async loadZapContract({
    commit, state, dispatch, rootState,
  }: any) {
    const poolRoot = state.zapPoolRoot;
    const poolVersion = state.zapPoolRoot?.poolVersion;
    const chainName = state.zapPoolRoot.chainName;
    const address = state.zapPoolRoot.address;
    const platformName = state.currentZapPlatformContractType?.name ?? poolRoot?.platform[0];

    if (!poolRoot) {
      console.error('Zap Pool Root not found: ', poolRoot);
      return;
    }

    commit('changeState', {
      field: 'currentZapPlatformContractType',
      val: zapPlatformContractTypeMap[address] ?? zapPlatformContractTypeMap[address.toLowerCase()]
        ?? zapPlatformContractTypeMap[state.zapPoolRoot.platform[0]],
    });

    if (!state.currentZapPlatformContractType) {
      console.error(
        'Error when load zap contract name. Contract not found.',
        state.zapPoolRoot,
      );
      return;
    }

    let abiFile = {} as ContractAbi;
    if (chainName && platformName) {
      const abiFileSrc = zapAbiSrcMap[poolVersion]?.(chainName, platformName);
      abiFile = await loadAbi(abiFileSrc);
    }

    commit('changeState', {
      field: 'zapContract',
      val: buildEvmContract(
        abiFile.abi,
        rootState.web3.evmSigner,
        abiFile.address,
      ),
    });

    if (state.currentZapPlatformContractType.type === 'LP_STAKE_DIFF_STEPS') {
      dispatch('loadPoolTokenAndGaugeContracts');
    }

    commit('changeState', {
      field: 'zapLoaded',
      val: true,
    });
  },
  async loadPoolTokenAndGaugeContracts({
    commit, state, rootState,
  }: any) {
    let poolAddress = state.zapPoolRoot.address;
    const poolInfo = poolsInfoMap[poolAddress];
    const gaugeAddress = poolInfo.gaugeForLP
      ? poolInfo.gaugeForLP
      : poolInfo.gauge;

    const poolVersion = state.zapPoolRoot?.poolVersion;
    const chainName = state.zapPoolRoot.chainName;
    const contractName = state?.currentZapPlatformContractType?.name;

    const abiFileSrc = gaugeSrcMap[poolVersion](chainName, contractName);
    const abiGaugeContractFile = await loadAbi(abiFileSrc);

    // Rebalance data

    const abiFileSrcV3 = gaugeSrcMap[poolVersionList.v3rebalance](chainName, contractName);
    const abiGaugeContractFileV3 = await loadAbi(abiFileSrcV3);

    if (Object.keys(abiGaugeContractFileV3).length > 0) {
      commit('changeState', {
        field: 'gaugeContractV3',
        val: buildEvmContract(
          abiGaugeContractFileV3.abi,
          rootState.web3.evmSigner,
          abiGaugeContractFileV3.address ?? poolInfo.gauge,
        ),
      });
    }

    commit('changeState', {
      field: 'gaugeContract',
      val: buildEvmContract(
        abiGaugeContractFile.abi,
        rootState.web3.evmSigner,
        gaugeAddress,
      ),
    });

    const poolTokenSrc = poolTokenSrcMap[poolVersion](chainName, contractName);
    const abiPoolTokenContractFile = await loadAbi(poolTokenSrc);

    // Rebalance data

    const poolNftSrc = nftSrcMap[poolVersion]?.(chainName, contractName);
    const abiNftContractFile = await loadAbi(poolNftSrc);

    // exclude _ from pool address (aggregators)
    if (poolAddress.includes('_')) poolAddress = poolAddress.split('_')[0];

    const getPoolTokenContractAddress = (): string => {
      // if some custom pool contract
      if (abiPoolTokenContractFile.address) return abiPoolTokenContractFile.address;
      if (poolInfo.poolTokenType === 'DIFFERENT') return poolInfo.gauge;
      return poolAddress;
    };

    const tokenContract = buildEvmContract(
      abiPoolTokenContractFile.abi,
      rootState.web3.evmSigner,
      getPoolTokenContractAddress(),
    );

    // Rebalance

    if (abiNftContractFile.address) {
      const poolNftContract = buildEvmContract(
        abiNftContractFile.abi,
        rootState.web3.evmSigner,
        abiNftContractFile.address,
      );

      commit('changeState', {
        field: 'poolNftContract',
        val: poolNftContract,
      });
    }

    commit('changeState', {
      field: 'poolTokenContract',
      val: tokenContract,
    });
  },
  async loadPositionContract({
    rootState, commit, rootGetters,
  }: any) {
    const chainName = rootState.network.networkName;
    const platformName = rebalanceChainMap[chainName];
    const abiFileSrc = zapAbiSrcMap.v3?.(chainName, platformName);

    const abiFile = await loadAbi(abiFileSrc);

    const positionContract = buildEvmContract(
      abiFile.abi,
      rootState.web3.evmSigner,
      abiFile.address,
    );

    const rawPositionData = await positionContract.getPositions(rootState.accountData.account);

    // console.log('__rawPositionData', rawPositionData);

    const poolsMap = rootGetters['poolsData/allPoolsMap'];
    const tokenMap = rootGetters['odosData/allTokensMap'];

    // console.log('__poolsTokens', poolsMap, tokenMap);

    const positionInfo = formatPositionData(rawPositionData, poolsMap, tokenMap);

    // console.log('__positionInfo', positionInfo);

    commit('changeState', {
      field: 'positionContract',
      val: positionContract,
    });

    commit('changeState', {
      field: 'userPositions',
      val: positionInfo,
    });
    return positionInfo;
  },
};

const mutations = {
  changeState(state: any, data: {
    field: keyof typeof stateData,
    val: any
  }) {
    state[data.field] = data.val;
  },
  resetStore(state: typeof stateData) {
    Object.assign(state, defaultState());
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
