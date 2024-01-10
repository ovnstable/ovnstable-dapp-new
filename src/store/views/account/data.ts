/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
const state = {

  balance: {},
  originalBalance: {},
  actionAssetBalance: {},
  etsBalance: {},
  etsOriginalBalance: {},
  insuranceBalance: {},
  insuranceOriginalBalance: {},

  account: null,
  uns: null,
};

const getters = {

  balance(state: any) {
    return state.balance;
  },

  originalBalance(state: any) {
    return state.originalBalance;
  },

  etsBalance(state: any) {
    return state.etsBalance;
  },

  etsOriginalBalance(state: any) {
    return state.etsOriginalBalance;
  },

  insuranceBalance(state: any) {
    return state.insuranceBalance;
  },

  insuranceOriginalBalance(state: any) {
    return state.insuranceOriginalBalance;
  },

  actionAssetBalance(state: any) {
    return state.actionAssetBalance;
  },

  account(state: any) {
    return state.account;
  },

  uns(state: any) {
    return state.uns;
  },

};

const actions = {

  async resetBalance({ commit, dispatch, getters }: any) {
    console.log('AccountData: resetBalance');

    commit('setBalance', {});
    commit('setOriginalBalance', {});
    commit('setEtsBalance', {});
    commit('setEtsOriginalBalance', {});
    commit('setInsuranceBalance', {});
    commit('setActionAssetBalance', {});
  },

  async resetUns({ commit, dispatch, getters }: any) {
    console.log('AccountData: resetUns');

    commit('setUns', null);
  },

  async refreshBalance({
    commit, dispatch, getters, rootState,
  }: any) {
    if (getters.account === null || getters.account === undefined) {
      return;
    }

    commit('accountUI/setLoadingBalance', true, { root: true });
    const { web3 } = rootState;

    const { networkId } = rootState.network;
    const { assetDecimals } = rootState.network;

    let usdPlus;
    let originUsdPlus;

    let daiPlus;
    let originDaiPlus;

    let dai;
    let originDai;

    let usdtPlus;
    let originUsdtPlus;

    let ethPlus;
    let originEthPlus;

    let usdt;
    let originUsdt;

    let weth;
    let originWeth;

    let asset;
    let originAsset;

    let asset_two;
    let originAsset_two;

    let wUsdPlus;
    let originWUsdPlus;

    let wEthPlus;
    let originWethPlus;

    let ovn;
    let originOvn;

    try {
      asset = await web3.contracts.asset.methods.balanceOf(getters.account).call();
      originAsset = asset;
      asset = asset ? web3.web3.utils.fromWei(asset, assetDecimals === 18 ? 'ether' : 'mwei') : null;
    } catch (e) {
      asset = getters.balance.asset;
      originAsset = getters.originalBalance.asset;
    }

    // todo: arbitrum usdt ?
    if (web3.contracts.asset_two) {
      try {
        asset_two = await web3.contracts.asset_two.methods.balanceOf(getters.account).call();
        originAsset_two = asset_two;
        asset_two = asset_two ? web3.web3.utils.fromWei(asset_two, assetDecimals === 18 ? 'ether' : 'mwei') : null;
      } catch (e) {
        asset_two = getters.balance.asset_two;
        originAsset_two = getters.originalBalance.asset_two;
      }
    }

    try {
      usdPlus = await web3.contracts.usdPlus.methods.balanceOf(getters.account).call();
      originUsdPlus = usdPlus;
      usdPlus = usdPlus ? web3.web3.utils.fromWei(usdPlus, 'mwei') : usdPlus;
    } catch (e) {
      usdPlus = getters.balance.usdPlus;
      originUsdPlus = getters.originalBalance.usdPlus;
    }

    try {
      daiPlus = await web3.contracts.daiPlus.methods.balanceOf(getters.account).call();
      originDaiPlus = daiPlus;
      daiPlus = daiPlus ? web3.web3.utils.fromWei(daiPlus, 'ether') : daiPlus;
    } catch (e) {
      daiPlus = getters.balance.daiPlus;
      originDaiPlus = getters.originalBalance.daiPlus;
    }

    try {
      dai = await web3.contracts.dai.methods.balanceOf(getters.account).call();
      originDai = dai;
      dai = dai ? web3.web3.utils.fromWei(dai, 'ether') : dai;
    } catch (e) {
      dai = getters.balance.dai;
      originDai = getters.originalBalance.dai;
    }

    if (networkId === 56 || networkId === 59144 || networkId === 42161) {
      let unit = 'ether';
      if (networkId === 59144 || networkId === 42161) {
        unit = 'mwei';
      }

      try {
        usdtPlus = await web3.contracts.usdtPlus.methods.balanceOf(getters.account).call();
        originUsdtPlus = usdtPlus;
        usdtPlus = usdtPlus ? web3.web3.utils.fromWei(usdtPlus, unit) : usdtPlus;
      } catch (e) {
        usdtPlus = getters.balance.usdtPlus;
        originUsdtPlus = getters.originalBalance.usdtPlus;
      }

      try {
        usdt = await web3.contracts.usdt.methods.balanceOf(getters.account).call();
        originUsdt = usdt;
        usdt = usdt ? web3.web3.utils.fromWei(usdt, unit) : usdt;
      } catch (e) {
        usdt = getters.balance.usdt;
        originUsdt = getters.originalBalance.usdt;
      }
    }

    // eth contracts
    if (networkId === 42161) {
      const unit = 'ether';

      try {
        ethPlus = await web3.contracts.ethPlus.methods.balanceOf(getters.account).call();
        wEthPlus = await web3.contracts.wEthPlus.methods.balanceOf(getters.account).call();
        originEthPlus = ethPlus;
        originWethPlus = wEthPlus;
        ethPlus = ethPlus ? web3.web3.utils.fromWei(ethPlus, unit) : ethPlus;
        wEthPlus = wEthPlus ? web3.web3.utils.fromWei(wEthPlus, unit) : wEthPlus;
      } catch (e) {
        ethPlus = getters.balance.ethPlus;
        originEthPlus = getters.originalBalance.ethPlus;
      }

      try {
        weth = await web3.contracts.weth.methods.balanceOf(getters.account).call();
        originWeth = weth;
        weth = weth ? web3.web3.utils.fromWei(weth, unit) : weth;
      } catch (e) {
        weth = getters.balance.weth;
        originWeth = getters.originalBalance.weth;
      }
    }

    // ovn contracts
    if (networkId === 10 || networkId === 42161 || networkId === 8453) {
      try {
        ovn = await web3.contracts.ovn.methods.balanceOf(getters.account).call();
        originOvn = ovn;
        ovn = ovn ? web3.web3.utils.fromWei(ovn, 'ether') : null;
      } catch (e) {
        ovn = getters.balance.ovn;
        originOvn = getters.originalBalance.ovn;
      }
    }

    // wrapped contracts
    if (networkId === 137 || networkId === 10 || networkId === 42161 || networkId === 8453) {
      try {
        wUsdPlus = await web3.contracts.wUsdPlus.methods.balanceOf(getters.account).call();
        originWUsdPlus = wUsdPlus;
        wUsdPlus = wUsdPlus ? web3.web3.utils.fromWei(wUsdPlus, 'mwei') : null;
      } catch (e) {
        wUsdPlus = getters.balance.wUsdPlus;
        originWUsdPlus = getters.originalBalance.wUsdPlus;
      }
    }

    commit('setBalance', {
      usdPlus,
      daiPlus,
      usdtPlus,
      ethPlus,
      dai,
      usdt,
      weth,
      asset,
      asset_two,
      wUsdPlus,
      wEthPlus,
      ovn,
    });

    commit('setOriginalBalance', {
      usdPlus: originUsdPlus,
      daiPlus: originDaiPlus,
      usdtPlus: originUsdtPlus,
      ethPlus: originEthPlus,
      dai: originDai,
      usdt: originUsdt,
      weth: originWeth,
      asset: originAsset,
      asset_two: originAsset_two,
      wUsdPlus: originWUsdPlus,
      wEthPlus: originWethPlus,
      ovn: originOvn,
    });

    const resultEtsBalance: any = {};
    const resultEtsOriginalBalance: any = {};
    const { etsList } = rootState.etsAction;

    if (etsList) {
      for (let i = 0; i < etsList.length; i++) {
        const ets = etsList[i];
        let etsBalance;
        let etsOriginalBalance;

        if (ets.chain === networkId) {
          try {
            etsBalance = await web3
              .contracts[ets.tokenContract]
              .methods.balanceOf(getters.account).call();
            etsOriginalBalance = etsBalance;
            etsBalance = web3.web3.utils.fromWei(etsBalance, ets.etsTokenDecimals === 18 ? 'ether' : 'mwei');
          } catch (e) {
            etsBalance = getters.etsBalance[ets.name];
            etsOriginalBalance = getters.etsOriginalBalance[ets.name];
          }

          resultEtsBalance[ets.name] = etsBalance;
          resultEtsOriginalBalance[ets.name] = etsOriginalBalance;
        }
      }
    }

    commit('setEtsBalance', resultEtsBalance);
    commit('setEtsOriginalBalance', resultEtsOriginalBalance);

    const resultInsuranceBalance: any = {};
    const resultInsuranceOriginalBalance: any = {};
    const insuranceList = [
      /*         {
                chainName: 'polygon',
                chainId: 137,
            }, */
      {
        chainName: 'optimism',
        chainId: 10,
      },
    ];

    if (insuranceList) {
      for (let i = 0; i < insuranceList.length; i++) {
        const insurance = insuranceList[i];
        let insuranceBalance;
        let insuranceOriginalBalance;

        if (insurance.chainId === networkId) {
          try {
            insuranceBalance = await web3.contracts.insurance[`${insurance.chainName}_token`].methods.balanceOf(getters.account).call();
            insuranceOriginalBalance = insuranceBalance;
            insuranceBalance = web3.web3.utils.fromWei(insuranceBalance, 'ether');
          } catch (e) {
            insuranceBalance = getters.insuranceBalance[insurance.chainName];
            insuranceOriginalBalance = getters.insuranceOriginalBalance[insurance.chainName];
          }

          resultInsuranceBalance[insurance.chainName] = insuranceBalance;
          resultInsuranceOriginalBalance[insurance.chainName] = insuranceOriginalBalance;
        }
      }
    }

    commit('setInsuranceBalance', resultInsuranceBalance);
    commit('setInsuranceOriginalBalance', resultInsuranceOriginalBalance);

    const resultActionAssetBalance: any = {};

    if (etsList) {
      for (let i = 0; i < etsList.length; i++) {
        const ets = etsList[i];
        let actionAssetBalance;

        if (!resultActionAssetBalance[ets.actionAsset]) {
          try {
            actionAssetBalance = await web3
              .contracts[ets.actionAsset]
              .methods.balanceOf(getters.account).call();

            switch (ets.actionTokenDecimals) {
              case 6:
                actionAssetBalance = web3.web3.utils.fromWei(actionAssetBalance, 'mwei');
                break;
              case 8:
                actionAssetBalance = parseFloat(web3.web3.utils.fromWei(actionAssetBalance, 'mwei')) / 100.0;
                break;
              case 18:
                actionAssetBalance = web3.web3.utils.fromWei(actionAssetBalance, 'ether');
                break;
              default:
                break;
            }
          } catch (e) {
            return;
          }

          const assetProperty = `${ets.actionAsset}_${ets.actionTokenDecimals}`; // asset may be with different decimals.
          resultActionAssetBalance[assetProperty] = actionAssetBalance;
        }
      }
    }

    commit('setActionAssetBalance', resultActionAssetBalance);

    commit('accountUI/setLoadingBalance', false, { root: true });
  },
};

const mutations = {

  setBalance(state: any, value: any) {
    state.balance = value;
  },

  setOriginalBalance(state: any, value: any) {
    state.originalBalance = value;
  },

  setEtsBalance(state: any, value: any) {
    state.etsBalance = value;
  },

  setEtsOriginalBalance(state: any, value: any) {
    state.etsOriginalBalance = value;
  },

  setInsuranceBalance(state: any, value: any) {
    state.insuranceBalance = value;
  },

  setInsuranceOriginalBalance(state: any, value: any) {
    state.insuranceOriginalBalance = value;
  },

  setAccount(state: any, value: any) {
    state.account = value;
  },

  setUns(state: any, value: any) {
    state.uns = value;
  },

  setActionAssetBalance(state: any, value: any) {
    state.actionAssetBalance = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
