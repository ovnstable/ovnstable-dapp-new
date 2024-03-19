/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import { poolsInfoMap, zapPlatformContractTypeMap } from '@/store/views/main/zapin/mocks.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { loadJSON } from '@/utils/httpUtils.ts';

const stateData = {
  zapPoolRoot: null,
  currentZapPlatformContractType: null,
  zapContract: null,
  poolTokenContract: null,
  gaugeContract: null,
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

    commit('changeState', {
      field: 'currentZapPlatformContractType',
      val: zapPlatformContractTypeMap[state.zapPoolRoot.platform[0]]
      ?? zapPlatformContractTypeMap[state.zapPoolRoot.address],
    });

    if (!state.currentZapPlatformContractType) {
      console.error(
        'Error when load zap contract name. Contract not found.',
        state.zapPoolRoot,
      );
      return;
    }

    const platformName = state.currentZapPlatformContractType.name;

    const abiFile = await loadJSON(
      `/contracts/${state.zapPoolRoot.chainName}/${platformName}Zap.json`,
    );

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

    const abiGaugeContractFile = await loadJSON(
      `/contracts/${state.zapPoolRoot.chainName}/${state?.currentZapPlatformContractType?.name}Gauge.json`,
    );

    commit('changeState', {
      field: 'gaugeContract',
      val: buildEvmContract(
        abiGaugeContractFile.abi,
        rootState.web3.evmSigner,
        gaugeAddress,
      ),
    });

    const abiPoolTokenContractFile = await loadJSON(
      `/contracts/${state.zapPoolRoot.chainName}/${state?.currentZapPlatformContractType?.name}PoolToken.json`,
    );

    // exclude _ from pool address (aggregators)
    if (poolAddress.includes('_')) poolAddress = poolAddress.split('_')[0];

    const tokenContract = poolInfo.poolTokenType
      ? buildEvmContract(
        abiPoolTokenContractFile.abi,
        rootState.web3.evmSigner,
        abiPoolTokenContractFile.address,
      )
      : buildEvmContract(abiPoolTokenContractFile.abi, rootState.web3.evmSigner, poolAddress);

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
