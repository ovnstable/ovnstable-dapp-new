/* eslint-disable no-unused-vars */
const KEY = 'REFERRAL_CODE';

const state = {};

const getters = {};

const actions = {

  async getReferralCode() {
    const match = document.cookie.match(new RegExp(`(^| )${KEY}=([^;]+)`));
    if (match) {
      const referralCode = match[2];
      console.log(`Referral code found in cookie = [${referralCode}]`);
      return referralCode;
    }
    // console.log('Referral code not found in cookies');
    return '';
  },

  async initReferralCode() {
    const exist = document.cookie.indexOf(`${KEY}=`) !== -1;

    if (!exist) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const referralValue = urlParams.get('referral');

      if (referralValue) {
        const days = 86400 * 30; // 86400 = 1 day

        console.log(`Referral [${referralValue}] found in URL`);

        const expire = (new Date(Date.now() + days * 1000)).toUTCString();
        document.cookie = `${KEY}=${referralValue}; expires=${expire};path=/;`;

        console.log(`Setup [REFERRAL_CODE=${referralValue}] to cookies`);
      }
    }
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
