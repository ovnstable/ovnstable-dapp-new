/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import { poolsInfoMap, zapPlatformContractTypeMap } from '@/store/views/main/zapin/mocks.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { JSONLoader } from '@/utils/httpUtils.ts';

import type { ContractAbi } from '@/types/common/abi';

export enum zapInStep {
  START,
  APPROVE_TOKENS,
  DEPOSIT,
  APPROVE_GAUGE,
  STAKE_LP
}

enum poolVersionList {
  'v2',
  'v3',
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
};

const poolTokenSrcMap: TSrcMap = {
  v2: srcStringBuilder('PoolToken'),
  v3: srcStringBuilder('V3PoolToken'),
};

const loadAbi = async (abiFileSrc: string): Promise<ContractAbi> => {
  try {
    const abiFile = await JSONLoader(abiFileSrc);
    if (!abiFile || !abiFile?.abi) return {} as ContractAbi;
    return abiFile;
  } catch (e) {
    console.log('Error fetching ABI file');
  }
  return {} as ContractAbi;
};

const stateData = {
  zapPoolRoot: null,
  currentZapPlatformContractType: null,
  zapContract: null,
  poolTokenContract: null,
  gaugeContract: null,
  currentStage: zapInStep.START,
};

const getters = {
};

const actions = {
  async loadZapContract({
    commit, state, dispatch, rootState,
  }: any) {
    const poolRoot = state.zapPoolRoot;
    const platformName = state.currentZapPlatformContractType?.name;
    const poolVersion = state.zapPoolRoot?.poolVersion;
    const chainName = state.zapPoolRoot.chainName;
    const address = state.zapPoolRoot.address;

    if (!poolRoot) {
      console.error('Zap Pool Root not found: ', poolRoot);
      return;
    }

    console.log(address, ' --state.zapPoolRoot.address');
    console.log(zapPlatformContractTypeMap[state.zapPoolRoot.address], '__ADD');

    commit('changeState', {
      field: 'currentZapPlatformContractType',
      val: zapPlatformContractTypeMap[state.zapPoolRoot.address]
        ?? zapPlatformContractTypeMap[state.zapPoolRoot.platform[0]],
    });

    if (!state.currentZapPlatformContractType) {
      console.error(
        'Error when load zap contract name. Contract not found.',
        state.zapPoolRoot,
      );
      return;
    }

    let abiFile = {};
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

    console.log('BUILDED');
  },
  async loadPoolTokenAndGaugeContracts({
    commit, state, dispatch, rootState,
  }: any) {
    let poolAddress = state.zapPoolRoot.address;
    const poolInfo = poolsInfoMap[poolAddress];
    if (!poolInfo) {
      console.log(
        'Error when get proportion. Gauge not found at pool: ',
        poolAddress,
      );
      return;
    }

    const gaugeAddress = poolInfo.gaugeForLP
      ? poolInfo.gaugeForLP
      : poolInfo.gauge;

    const poolVersion = state.zapPoolRoot?.poolVersion;
    const chainName = state.zapPoolRoot.chainName;
    const contractName = state?.currentZapPlatformContractType?.name;

    const abiFileSrc = gaugeSrcMap[poolVersion as poolVersionList]?.(chainName, contractName);
    const abiGaugeContractFile = await loadAbi(abiFileSrc);

    console.log(abiGaugeContractFile, '--abiGaugeContractFile');

    commit('changeState', {
      field: 'gaugeContract',
      val: buildEvmContract(
        abiGaugeContractFile.abi,
        rootState.web3.evmSigner,
        gaugeAddress,
      ),
    });

    const poolTokenSrc = poolTokenSrcMap[poolVersion as poolVersionList]?.(chainName, contractName);
    const abiPoolTokenContractFile = await loadAbi(poolTokenSrc);

    // exclude _ from pool address (aggregators)
    if (poolAddress.includes('_')) poolAddress = poolAddress.split('_')[0];

    let tokenContract = buildEvmContract(
      abiPoolTokenContractFile.abi,
      rootState.web3.evmSigner,
      poolAddress,
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
  },
};

const mutations = {
  changeState(state: any, data: {
    field: keyof typeof stateData,
    val: any
  }) {
    state[data.field] = data.val;
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
