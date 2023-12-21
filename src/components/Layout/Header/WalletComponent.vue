<template>
  <div
    class="wallet-bar-main-container"
  >
    <div class="wallet-bar-container">
      <!-- <WalletSelect /> -->

      <!-- <div
        class="wallet-col"
        @click="switchEyeFunc"
      >
        <img
          :src="dataHidden ?require('@/assets/icon/eye_close_white.svg')
           : require('@/assets/icon/eye_open_white.svg')"
          alt="Eye Icon"
          class="eye-icon"
        />

      </div>

      <div
        class="wallet-bar__wrap"
        @click="pendingTx ? showTxHistory() : walletClickAction()"
      >
        <div
          v-if="!$wu.isMobile()"
          class="account-display-container"
        >
          <template v-if="pendingTx">
            <v-progress-circular
              width="2"
              :size="14"
              color="var(--third-gray-text)"
              indeterminate
            />
            <label class="account-label pending-label ml-2">
              Pending...
            </label>
          </template>

          <label
            v-else
            class="account-label"
            :class="dataHidden ? 'hidden-label' : ''"
          >
            {{ account ? (dataHidden ? '' : accountDisplay) : 'XXX...XXXX' }}
          </label>
        </div>

        <div
          class="wallet-col"
          v-if="!$wu.isMobile()"
        >
          <div
            v-if="walletName"
            class="wallet-icon"
          >
            <v-img :src="require('@/assets/wallet/' + walletName.toLowerCase() + '.svg')" />
          </div>
        </div>
      </div> -->
    </div>

  </div>
</template>

<script lang="ts">
// import { mapActions } from 'vuex';
// import WalletSelect from '@/components/common/header/WalletSelect';
export default {
  name: 'WalletComponent',
};
</script>

<style scoped>
.hidden-label {
  border-radius: 4px;
}

.account-display-container {
  width: 90px;
}
@media only screen and (max-width: 960px) {
  .wallet-bar-container {
      height: 28px !important;
  }

  .wallet-col {
      margin-top: -8px;
  }

  .account-display-container {
      height: 24px !important;
  }

  .wallet-icon {
      width: 20px;
      height: 20px;
  }

  .balance-label, .account-label {
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      letter-spacing: 0.02em;
  }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .wallet-bar-container {
      height: 44px !important;
  }

  .wallet-col {
      margin-top: -2px;
  }

  .account-display-container {
      height: 28px !important;
      margin-right: 5px;
  }

  .wallet-icon {
      width: 28px;
      height: 28px;
  }

  .balance-label, .account-label {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 0.02em;
  }

  .hidden-label {
      width: 90px;
      height: 28px;
      background: var(--hide-account);
  }
}

/* full */
@media only screen and (min-width: 1400px) {
  .wallet-bar-container {
      height: 42px !important;
  }

  .wallet-col {
      margin-top: -2px;
  }

  .account-display-container {
      height: 28px !important;
  }

  .wallet-icon {
      width: 28px;
      height: 28px;
  }

  .balance-label, .account-label {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 0.02em;
  }

  .hidden-label {
      width: 90px;
      height: 28px;
      background: var(--hide-account);
  }
}

.wallet-bar-container {
  background-color: var(--secondary) !important;
  border-radius: 2px;
  cursor: pointer !important;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.balance-label, .account-label {
  text-transform: uppercase;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: var(--secondary-gray-text);
}

.pending-label {
  text-transform: capitalize;
  color: var(--third-gray-text);
}

.eye-icon {
  width: 24px;
  height: 24px;
  margin-top: 8px;
}

.wallet-bar-container:hover > .wallet-col >  {
  color: var(--hover);
}

.account-display-container {
  background: var(--card-coin-background);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-display-container, .account-display-container > * {
  cursor: pointer !important;
}

.account-display-container {
  margin-right: 8px;
}

.wallet-bar__wrap {
  display: flex;
  transition: opacity .2s ease;
}

.wallet-bar__wrap:hover {
  opacity: .7;
}

.wallet-bar-container {
  padding: 5px 10px;
}

.wallet-col {
  padding: 0 10px;
}

.account-label {
  margin: 0 5px;
}

.account-label.hidden-label {
  margin: 0;
}
</style>
