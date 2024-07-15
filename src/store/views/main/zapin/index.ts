/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import { poolsInfoMap, zapPlatformContractTypeMap } from '@/store/views/main/zapin/mocks.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { JSONLoader } from '@/utils/httpUtils.ts';

import { zapInStep } from '@/store/modals/waiting-modal.ts';
import type { ContractAbi } from '@/types/common/abi';

enum poolVersionList {
  'v2',
  'v3',
  'v3rebalance'
}

type TSrcMap = {
  [key: string]: (chainName: string, platformName: string) => string;
}

const srcStringBuilder = (fileType: string) => (
  chainName: string,
  fileName: string,
): string => `contracts/${chainName}/${fileName}${fileType}.json`;

const zapAbiSrcMap: TSrcMap = {
  v2: srcStringBuilder('Zap'),
  v3: srcStringBuilder('V3Zap'),
};

const gaugeSrcMap: TSrcMap = {
  v2: srcStringBuilder('Gauge'),
  v3: srcStringBuilder('V3Gauge'),
  [poolVersionList.v3rebalance]: srcStringBuilder('V3GaugeRebalance'),
};

const poolTokenSrcMap: TSrcMap = {
  v2: srcStringBuilder('PoolToken'),
  v3: srcStringBuilder('V3PoolToken'),
};

const nftSrcMap: TSrcMap = {
  v3: srcStringBuilder('V3Nft'),
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

    if (!poolRoot) {
      console.error('Zap Pool Root not found: ', poolRoot);
      return;
    }

    commit('changeState', {
      field: 'currentZapPlatformContractType',
      val: zapPlatformContractTypeMap[address]
        ?? zapPlatformContractTypeMap[state.zapPoolRoot.platform[0]],
    });

    const platformName = state.currentZapPlatformContractType?.name;

    if (!state.currentZapPlatformContractType) {
      console.error(
        'Error when load zap contract name. Contract not found.',
        state.zapPoolRoot,
      );
      return;
    }

    let abiFile = {} as ContractAbi;
    if (chainName && platformName) {
      const abiFileSrc = zapAbiSrcMap[poolVersion as poolVersionList]?.(chainName, platformName);
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

    const abiFileSrc = gaugeSrcMap[poolVersion as poolVersionList](chainName, contractName);
    const abiGaugeContractFile = await loadAbi(abiFileSrc);

    const abiFileSrcV3 = gaugeSrcMap[poolVersionList.v3rebalance](chainName, contractName);
    const abiGaugeContractFileV3 = await loadAbi(abiFileSrcV3);

    commit('changeState', {
      field: 'gaugeContractV3',
      val: buildEvmContract(
        abiGaugeContractFileV3.abi,
        rootState.web3.evmSigner,
        poolInfo.gauge,
      ),
    });

    console.log(abiGaugeContractFile, '__abiGaugeContractFile');

    commit('changeState', {
      field: 'gaugeContract',
      val: buildEvmContract(
        abiGaugeContractFile.abi,
        rootState.web3.evmSigner,
        gaugeAddress,
      ),
    });

    const poolTokenSrc = poolTokenSrcMap[poolVersion as poolVersionList](chainName, contractName);
    const poolNftSrc = nftSrcMap[poolVersion as poolVersionList](chainName, contractName);
    const abiPoolTokenContractFile = await loadAbi(poolTokenSrc);
    const abiNftContractFile = await loadAbi(poolNftSrc);

    console.log(abiFileSrc, '__poolNftSrc1');
    console.log(abiGaugeContractFile, '__poolNftSrc');
    // exclude _ from pool address (aggregators)
    if (poolAddress.includes('_')) poolAddress = poolAddress.split('_')[0];

    let tokenContract = buildEvmContract(
      abiPoolTokenContractFile.abi,
      rootState.web3.evmSigner,
      poolAddress,
    );

    const poolNftContract = buildEvmContract(
      abiNftContractFile.abi,
      rootState.web3.evmSigner,
      abiNftContractFile.address,
    );

    if (poolInfo.poolTokenType === 'DIFFERENT') {
      tokenContract = buildEvmContract(
        abiPoolTokenContractFile.abi,
        rootState.web3.evmSigner,
        poolInfo.gauge,
      );
    }

    // if some custom pool contract, passing it, in other case skip
    if (abiPoolTokenContractFile.address) {
      tokenContract = buildEvmContract(
        abiPoolTokenContractFile.abi,
        rootState.web3.evmSigner,
        abiPoolTokenContractFile.address,
      );
    }

    commit('changeState', {
      field: 'poolTokenContract',
      val: tokenContract,
    });

    console.log(poolNftContract, '__poolNftContract');

    commit('changeState', {
      field: 'poolNftContract',
      val: poolNftContract,
    });
  },
  async loadPositionContract({
    rootState, commit,
  }: any, address: string) {
    const abiFile = await loadAbi('contracts/base/AerodromeV3Zap.json');
    const positionContract = buildEvmContract(
      abiFile.abi,
      rootState.web3.evmSigner,
      abiFile.address,
    );

    console.log(address, '__address');
    const positions = await positionContract.getPositions(address);
    console.log(positions, '__positionsss');
    commit('changeState', {
      field: 'userPositions',
      val: positions,
    });
    return positions;
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
