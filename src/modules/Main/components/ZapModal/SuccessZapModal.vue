<template>
  <div>
    <div v-if="isShow">
      <div>
        <div
          class="container_body container-body airdrop-body pt-4 px-4"
          style="border-radius: 28px !important"
        >
          <div
            class="container_header container-header"
            flat
          >
            <div
              icon
              @keydown="setShowFunc(false)"
              @click="setShowFunc(false)"
            >
              <img
                :src="
                  light
                    ? require('@/assets/icon/swap/search-close.svg')
                    : require('@/assets/icon/light-close.svg')
                "
                alt="close icon"
              />
            </div>
          </div>

          <div>
            <div v-if="successData">
              <div class="success-logo-container">
                <div align="center">
                  <div class="icon">
                    <img
                      alt="img"
                      v-if="successData.pool.token0Icon"
                      :src="successData.pool.token0Icon"
                    />
                  </div>
                  <div class="icon ml-n2 mr-2">
                    <img
                      alt="img"
                      v-if="successData.pool.token1Icon"
                      :src="successData.pool.token1Icon"
                    />
                  </div>
                  <div
                    v-if="successData.pool.token2Icon"
                    class="icon ml-n2 mr-2"
                  >
                    <img
                      alt="img"
                      :src="successData.pool.token2Icon"
                    />
                  </div>
                  <div
                    v-if="successData.pool.token3Icon"
                    class="icon ml-n2 mr-2"
                  >
                    <img
                      alt="img"
                      :src="successData.pool.token3Icon"
                    />
                  </div>
                  <div class="col-4" />
                </div>
              </div>
              <div class="success-container py-10">
                You successfully staked
              </div>

              <div class="success-table-info-container">
                <div class="input-token-container">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-token-title">Pool name</div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-data-list">
                        <span class="success-data-item">
                          {{ successData.pool.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="input-token-container">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-token-title">Staking platform</div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-data-list">
                        <span class="success-data-item">
                          {{ successData.pool.platform }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="input-token-container">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-token-title">Swapped from</div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-data-list">
                        <span
                          v-for="(token, index) in successData.inputTokens"
                          :key="token.symbol"
                          class="success-data-item"
                        >
                          {{
                            index === 0 && token.selectedToken
                              ? token.selectedToken.symbol
                              : ", " + token.selectedToken.symbol
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="output-token-container">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-token-title">Swapped to</div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-data-list">
                        <span
                          v-for="(token, index) in successData.outputTokens"
                          :key="token.symbol"
                          class="success-data-item"
                        >
                          {{
                            index === 0 && token.selectedToken
                              ? token.selectedToken.symbol
                              : ", " + token.selectedToken.symbol
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="success-table-position-info-container">
                <div class="input-token-container">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div
                        class="success-token-title"
                        style="color: var(--main-gray)"
                      >
                        Received stake position
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-data-list">
                        <div
                          v-for="stake in (tokensStakeList as any)"
                          :key="stake.id"
                          class="success-position-data-item"
                        >
                          {{ formatMoney(stake.value, 3) }}
                          {{ stake.token.symbol }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="input-token-container">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-token-title">Returned in wallet</div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                      <div class="success-data-list">
                        <div
                          v-for="returnData in tokensReturnList"
                          :key="returnData.id"
                          class="success-data-item"
                        >
                          {{ formatMoney(returnData.value, 6) }}
                          {{ returnData.token.symbol }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                :href="openPositionOnPool"
                target="_blank"
                rel="noopener noreferrer"
                class="platform-position-container text-center mt-5"
              >
                <div class="position-title">MY POSITION IN POOL</div>
                <div class="position-icon">
                  <img
                    :src="require('@/assets/icon/swap/scan-open-white.svg')"
                    alt="position"
                  />
                </div>
              </a>

              <div class="scan-container pt-5">
                <a
                  :href="openOnExplorer"
                  target="_blank"
                  rel="noopener noreferrer"

                  class="scan-title"
                >
                  View on Scan
                </a>
                <div class="scan-icon">
                  <img
                    :src="require('@/assets/icon/swap/scan-open.svg')"
                    alt="scan"
                  />
                </div>
              </div>
            </div>
            <div class="divider" />
          </div>

          <!-- <div>
            <Carousel />
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import { formatMoney } from '@/utils/numbers.ts';

export default {
  name: 'SuccessZapModal',
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    setShowFunc: {
      type: Function,
      required: true,
    },

    successData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tokensStakeList: [] as any[], // [ { name: count }]
      tokensReturnList: [] as any[], // [ { name: count }]
    };
  },

  mounted() {
    this.initStakeList();
    this.initReturnList();
  },
  computed: {
    ...mapGetters('network', ['getParams']),
    ...mapGetters('web3', ['web3', 'getWeiMarker']),
    ...mapGetters('theme', ['light']),

    openPositionOnPool() {
      console.log('openPositionOnPool');
      try {
        this.trackClick({
          action: 'click_open_position_on_pool',
          event_category: 'Click button',
          event_label: 'Click open position on pool.',
        });
      } catch (e) {
        console.error('Track error:', e);
      }

      if (this.successData.pool.platform === 'Chronos') {
        return `https://app.chronos.exchange/liquidity/${this.successData.pool.address}`;
      }

      if (this.successData.pool.platform === 'Thena') {
        return `https://www.thena.fi/liquidity/manage/${this.successData.pool.address}`;
      }

      if (this.successData.pool.platform === 'Ramses') {
        return `https://app.ramses.exchange/liquidity/${this.successData.pool.address}`;
      }

      if (this.successData.pool.platform === 'Velodrome') {
        return 'https://velodrome.finance/dash';
      }

      if (this.successData.pool.platform === 'Aerodrome') {
        return 'https://aerodrome.finance/dash';
      }

      if (this.successData.pool.platform === 'Arbidex') {
        return 'https://arbidex.fi/xarxfarms';
      }

      if (this.successData.pool.platform === 'Baseswap') {
        return 'https://baseswap.fi/farms';
      }

      if (this.successData.pool.platform === 'Alienbase') {
        return 'https://app.alienbase.xyz/farms';
      }

      if (this.successData.pool.platform === 'Swapbased') {
        return 'https://swapbased.finance/#/farm';
      }

      if (this.successData.pool.platform === 'Velocimeter') {
        return 'https://base.velocimeter.xyz/liquidity';
      }

      if (this.successData.pool.platform === 'Sperax') {
        return `https://demeter.sperax.io/farm/42161/${this.successData.pool.address}`;
      }

      if (this.successData.pool.platform === 'Defiedge') {
        return `https://app.defiedge.io/s/optimism/${this.successData.pool.address}`;
      }

      if (this.successData.pool.platform === 'Curve') {
        return 'https://curve.fi/#/base/pools/factory-v2-2/deposit';
      }

      if (this.successData.pool.platform === 'Convex') {
        return 'https://www.convexfinance.com/stake/arbitrum/13';
      }

      if (this.successData.pool.platform === 'Beefy') {
        return 'https://app.beefy.com/dashboard';
      }

      if (this.successData.pool.platform === 'Pancake') {
        return `https://pancakeswap.finance/info/v3/arb/pairs/${this.successData.pool.address}`;
      }

      console.error(
        'Open Position failed, dex not found.',
        this.successData.pool.platform,
      );

      return '';
    },
    openOnExplorer() {
      const { explorerUrl } = this.getParams(this.successData.chain);
      return `${explorerUrl}tx/${this.successData.hash}`;
    },
  },
  watch: {
    successData(val) {
      if (val) {
        this.initStakeList();
        this.initReturnList();
      }
    },
    isShow(val) {
      if (val) {
        try {
          this.trackClick({
            action: 'success_zap_in_view',
            event_category: 'Page view',
            event_label: 'View success zap in page',
          });
        } catch (e) {
          console.error('Track error:', e);
        }
      }
    },
  },
  methods: {
    ...mapActions('track', ['trackClick']),

    formatMoney,
    initStakeList() {
      console.log('initStakeList: ', this.successData);
      if (!this.successData || !this.successData.outputTokens) {
        return;
      }

      console.log(this.successData.outputTokens);
      for (let i = 0; i < this.successData.outputTokens.length; i++) {
        const token = this.successData.outputTokens[i];
        const originalValue = this.getCountFromPutInto(
          token.selectedToken.address,
        );
        const value = this.web3.utils.fromWei(
          originalValue,
          this.getWeiMarker(token.selectedToken.decimals),
        );

        this.tokensStakeList.push({
          id: `${token.id}stake`,
          token: token.selectedToken,
          value,
        });
      }
    },
    initReturnList() {
      if (!this.successData || !this.successData.outputTokens) {
        return;
      }

      for (let i = 0; i < this.successData.outputTokens.length; i++) {
        const token = this.successData.outputTokens[i];
        const originalValue = this.getCountFromReturned(
          token.selectedToken.address,
        );
        const value = this.web3.utils.fromWei(
          originalValue,
          this.getWeiMarker(token.selectedToken.decimals),
        );
        this.tokensReturnList.push({
          id: `${token.id}return`,
          token: token.selectedToken,
          value,
        });
      }
    },
    getCountFromPutInto(tokenAddress: string) {
      if (
        !this.successData.putIntoPoolEvent
        || !this.successData.putIntoPoolEvent.returnValues
      ) {
        return 0;
      }

      console.log('getCountFromPutInto2');

      // this.successData.putIntoPoolEvent.returnValues[1] // addresses
      for (
        let i = 0;
        i < this.successData.putIntoPoolEvent.returnValues[1].length;
        i++
      ) {
        const address = this.successData.putIntoPoolEvent.returnValues[1][i];
        if (tokenAddress.toLowerCase() === address.toLowerCase()) {
          return this.successData.putIntoPoolEvent.returnValues[0][i]; // value from returnValues[0]
        }
      }

      return 0;
    },
    getCountFromReturned(tokenAddress: string) {
      if (
        !this.successData.returnedToUserEvent
        || !this.successData.returnedToUserEvent.returnValues
      ) {
        return 0;
      }

      for (
        let i = 0;
        i < this.successData.returnedToUserEvent.returnValues[1].length;
        i++
      ) {
        const address = this.successData.returnedToUserEvent.returnValues[1][i];
        if (tokenAddress.toLowerCase() === address.toLowerCase()) {
          return this.successData
            .returnedToUserEvent.returnValues[0][i];
        }
      }

      return 0;
    },
  },
};
</script>

<style scoped>
.tokens-container {
  padding-top: 15px;
  padding-bottom: 15px;
}

.title-container {
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  line-height: 40px;
  color: var(--main-gray);
}

.container-body {
  background: var(--secondary) !important;
}

.container-header {
  background: var(--secondary) !important;
}

.success-data-list {
  text-align: end;
}

.success-logo-container {
  text-align: center;
  position: relative;
}

.success-container {
  text-align: center;
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  line-height: 40px;
  color: var(--main-gray);
}

.success-token-title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #707a8b;
}

.success-data-item {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  color: var(--main-gray);
}

.scan-title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #1c95e7;
  display: inline-block;
}

.scan-container {
  text-align: center;
  position: relative;
  cursor: pointer;
}

.scan-icon {
  position: absolute;
  top: 22px;
  padding-left: 4px;
  display: inline-block;
}

.position-icon {
  position: absolute;
  top: 14px;
  padding-left: 97px;
  display: inline-block;
}

.success-table-position-info-container {
  padding: 16px 12px 12px;
  margin-top: 20px;
  background: rgba(28, 149, 231, 0.1);
  border-radius: 8px;
}

.success-position-data-item {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.5px;
  color: var(--main-gray);
}

.platform-position-container {
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px 12px;
  background: linear-gradient(
    91.26deg,
    #28a0f0 0%,
    rgba(6, 120, 196, 0.9917) 100%
  );
  border-radius: 2px;
  cursor: pointer;
  text-align: center;
}

.position-title {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  color: #ffffff;
}

.icon {
  height: 80px !important;
  width: 80px !important;
}

.icon > .v-image {
  border-radius: 9999px !important;
}

.divider {
  border-top: 1px solid #adb3bd;
}
</style>
