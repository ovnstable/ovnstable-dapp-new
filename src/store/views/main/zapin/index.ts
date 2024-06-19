/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import { poolsInfoMap, zapPlatformContractTypeMap } from '@/store/views/main/zapin/mocks.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { loadJSON } from '@/utils/httpUtils.ts';

export enum zapInStep {
  START,
  APPROVE_TOKENS,
  DEPOSIT,
  APPROVE_GAUGE,
  STAKE_LP
}

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
    if (!state.zapPoolRoot) {
      console.error('Zap Pool Root not found: ', state.zapPoolRoot);
      return;
    }

    console.log(state.zapPoolRoot.address, ' --state.zapPoolRoot.address');
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

    const platformName = state.currentZapPlatformContractType.name;

    let abiFile = null;

    if (state.zapPoolRoot?.poolVersion === 'v2') {
      abiFile = await loadJSON(
        `/contracts/${state.zapPoolRoot.chainName}/${platformName}Zap.json`,
      );
    }

    if (state.zapPoolRoot?.poolVersion === 'v3') {
      abiFile = await loadJSON(
        `/contracts/${state.zapPoolRoot.chainName}/${platformName}V3Zap.json`,
      );
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

    let abiGaugeContractFile = null;

    if (state.zapPoolRoot?.poolVersion === 'v2') {
      abiGaugeContractFile = await loadJSON(
        `/contracts/${state.zapPoolRoot.chainName}/${state?.currentZapPlatformContractType?.name}Gauge.json`,
      );
    }

    if (state.zapPoolRoot?.poolVersion === 'v3') {
      abiGaugeContractFile = await loadJSON(
        `/contracts/${state.zapPoolRoot.chainName}/${state?.currentZapPlatformContractType?.name}V3Gauge.json`,
      );
    }

    console.log(abiGaugeContractFile, '--abiGaugeContractFile');

    commit('changeState', {
      field: 'gaugeContract',
      val: buildEvmContract(
        abiGaugeContractFile.abi,
        rootState.web3.evmSigner,
        gaugeAddress,
      ),
    });

    let abiPoolTokenContractFile = null;

    if (state.zapPoolRoot?.poolVersion === 'v2') {
      abiPoolTokenContractFile = await loadJSON(
        `/contracts/${state.zapPoolRoot.chainName}/${state?.currentZapPlatformContractType?.name}PoolToken.json`,
      );
    }

    if (state.zapPoolRoot?.poolVersion === 'v3') {
      abiPoolTokenContractFile = await loadJSON(
        `/contracts/${state.zapPoolRoot.chainName}/${state?.currentZapPlatformContractType?.name}V3PoolToken.json`,
      );
    }

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
