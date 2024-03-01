<template>
  <div class="app-header">
    <div class="app-header__container">
      <div class="app-header__content">
        <div class="app-header-dapp">
          <router-link
            to="/"
            class="app-header__content__logo"
          >
            <BaseIcon
              class="app-header__content__logo-svg"
              name="IconLogo"
            />

            <h1>
              OVERNIGHT
            </h1>
          </router-link>
          <router-link
            to="/dashboard"
            class="app-header__dashboard"
            active-class="active-link"
          >
            <p>
              My dashboard
            </p>
          </router-link>

          <a
            href="https://docs.overnight.fi/"
            class="app-header__docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
          <a
            href="dev.overnight.fi"
            target="_blank"
            class="app-header__dashboard"
            active-class="active-link"
          >
            Old Dapp
          </a>

        </div>

        <div class="app-header__content-data">
          <div
            v-if="account && isBalancesLoading"
            class="lineLoader"
          />

          <PopperComponent
            v-else-if="walletConnected && account"
            interactive
            placement="bottom-end"
          >
            <ButtonComponent
              class="app-header__balance-account"
              btn-styles="secondary"
            >
              {{ totalUserBalance }} $
              <BaseIcon
                name="ArrowDown"
              />
            </ButtonComponent>
            <template #content="{ close }">
              <div
                class="popper-list"
              >
                <div
                  class="networks-list__item app-header__balance-item"
                  v-for="(item, key) in (userBalancesList as any)"
                  :key="key"
                  @click="close"
                  @keypress="close"
                >
                  {{ item.balance }}
                  <div class="app-header__balance-row">
                    {{ item.symbol }}
                  </div>
                </div>
                <div class="popper-list__divider" />
                <div class="app-header__balance-main">
                  <span>
                    {{ totalUserBalance }}
                  </span>
                  <span>
                    USD
                  </span>
                </div>
              </div>
            </template>
          </PopperComponent>

          <div
            v-if="account && isBalancesLoading"
            class="lineLoader"
          />
          <ButtonComponent
            v-else-if="walletConnected && account"
            class="app-header__content-account"
            btn-styles="secondary"
            @click="openAccountModal"
          >
            <span>
              {{ cutString(account, 4, 4)?.toUpperCase() }}
            </span>
            <div
              class="app-header__chain"
              :style="{ backgroundColor: activeNetworkData.color }"
            />
          </ButtonComponent>

          <ButtonComponent
            v-else
            @on-click="connectWallet"
          >
            CONNECT
          </ButtonComponent>

          <PopperComponent
            v-if="walletConnected && account"
            interactive
            placement="bottom-end"
          >
            <ButtonComponent
              class="app-header__chain_account"
              btn-styles="secondary"
            >
              <BaseIcon
                class="networks-active"
                :name="activeNetworkData.name.toLowerCase()"
              />
            </ButtonComponent>
            <template #content="{ close }">
              <div
                class="popper-list"
              >
                <div
                  class="networks-list__item"
                  v-for="item in networksData"
                  :key="item.name"
                  @click="chooseNetwork(item.chain, close)"
                  @keypress="chooseNetwork(item.chain, close)"
                >
                  <BaseIcon :name="item.name.toLowerCase()" />
                  {{ item.name }}
                </div>
              </div>
            </template>
          </PopperComponent>
        </div>
      </div>
    </div>
  </div>
  <AccountModal
    v-model="showModalAccount"
    @close-modal="closeAccountModal"
  />
</template>

<script lang="ts">
import { mapGetters, mapActions, mapState } from 'vuex';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { cutString } from '@/utils/strings.ts';
import { OVN_TOKENS, appNetworksData } from '@/utils/const.ts';
import BigNumber from 'bignumber.js';
import { loadTokenImage } from '@/utils/tokenLogo.ts';
import AccountModal from '@/modules/Account/Index.vue';

export default {
  name: 'HeaderBar',
  components: {
    ButtonComponent,
    AccountModal,
    BaseIcon,
  },
  data() {
    return {
      networksData: appNetworksData,
      showModalAccount: false,
    };
  },
  computed: {
    ...mapState('odosData', [
      'isBalancesLoading',
    ]),
    ...mapGetters('walletAction', ['walletConnected']),
    ...mapGetters('accountData', ['originalBalance', 'account']),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('odosData', ['allTokensList']),

    activeNetworkData() {
      const data = appNetworksData.find((_) => _.chain === this.networkId);
      return data || appNetworksData[0];
    },
    totalUserBalance() {
      if (this.allTokensList.length === 0 || this.originalBalance.length === 0) return '0';
      const total: BigNumber = this.originalBalance.reduce((acc: BigNumber, curr: any) => {
        const tokenData = this.allTokensList.find((_: any) => _.symbol === curr.symbol);
        if (!tokenData) return acc;
        const fixedBalance = new BigNumber(curr.balance)
          .div(10 ** tokenData.decimals)
          .times(tokenData.price);
        return acc.plus(fixedBalance);
      }, BigNumber(0));

      return total.toFixed(2);
    },
    userBalancesList() {
      if (this.originalBalance.length === 0) return [];
      return this.originalBalance
        .filter((_: any) => OVN_TOKENS.includes(_.symbol)).map((bal: any) => {
          const tokenData = this.allTokensList.find((_: any) => _.symbol === bal.symbol);

          return {
            balance: tokenData ? new BigNumber(bal.balance).div(10 ** tokenData.decimals).toFixed(2) : '0',
            srcPath: loadTokenImage(tokenData?.symbol),
            symbol: tokenData?.symbol,
          };
        });
    },
  },
  methods: {
    ...mapActions('network', ['setWalletNetwork']),
    openAccountModal() {
      this.showModalAccount = !this.showModalAccount;
    },
    closeAccountModal() {
      this.showModalAccount = false;
    },
    disconnectWallet() {
      this.$store.dispatch('walletAction/disconnectWallet');
    },
    connectWallet() {
      this.$store.dispatch('walletAction/connectWallet');
    },
    chooseNetwork(network: number, close: () => null) {
      this.setWalletNetwork(network);
      close();
    },
    cutString,
  },
};
</script>
<style lang="scss">
.app-header__content__logo-svg path {
  fill: var(--color-1);

  [data-theme="dark"] & {
    fill: var(--color-4);
  }
}
.app-header__balance-account {
  min-width: 130px;
  justify-content: space-between;

  svg path {
    fill: var(--color-3);
  }
}

</style>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 12px 0;
  background-color: #fff;
  border-bottom: 1px solid var(--color-1);
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-bottom: 1px solid var(--color-2);
  }
}
.app-header-dapp {
  display: flex;
  flex-direction: row;
}

.app-header__dashboard,
.app-header__docs {
  align-items: center;
  display: flex;
  color: var(--color-1);
  margin-left: 36px;
  font-size: 17px;
  font-weight: 600;
}
.active-link {
  text-decoration: underline;
}
.app-header__docs {
  text-decoration: none;
}

.app-header__container {
  width: 100%;
  max-width: 1350px;
  padding: 0 20px;
  margin: 0 auto;
}

.app-header__content {
  display: flex;
  justify-content: space-between;
}

.app-header__content__logo {
  display: flex;
  align-items: center;
  h1 {
    color: var(--color-1);
    font-size: 15px;
    font-weight: 700;
    margin-left: 8px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.app-header__content-account {
  display: flex;
  align-items: center;
  padding: 5px 8px 5px 20px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    color: var(--color-4);
  }

  span {
    position: relative;
    top: 1px;
  }
}
.app-header__chain_account {
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}
.app-header__chain {
  position: relative;
  margin-left: 20px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--color-3);
}

.app-header__content-data {
  display: flex;
  gap: 16px;
}

.app-header__balance-account {
  min-width: 130px;
  min-height: 31px;
  justify-content: space-between;

  svg path {
    fill: var(--color-3);
  }
}

.app-header__balance-row {
  display: flex;
  gap: 8px;
}

.popper-list {
  border-radius: 0px 0px 5px 5px;
  border: 1px solid var(--color-1);
  background: var(--color-4);
  box-shadow: 0px 1px 0px 0px var(--color-1);
  [data-theme="dark"] & {
    background: var(--color-17);
  }
}

.networks-list__item {
  display: flex;
  padding: 8px 14px;
  cursor: pointer;
  transition: background-color .2s ease, color .2s ease;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
  svg, img {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  &:first-child {
    padding-top: 12px;
  }

  &:last-child {
    padding-bottom: 12px;
  }

  &:hover {
    background-color: var(--color-3);
    color: var(--color-4);
    [data-theme="dark"] & {
      background-color: var(--color-5);
    }
  }
}

.app-header__balance-item {
  min-width: 130px;
  justify-content: space-between;
  cursor: default;
}

.networks-active {
  width: 20px;
  height: 20px;
}

.popper-list__divider {
  height: 1px;
  margin: 10px auto;
  width: 80%;
  background-color: var(--color-1);
}

.app-header__balance-main {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  margin-bottom: 10px;

  span:first-child {
    text-decoration: underline;
  }
}

$base-color: var(--color-5);
$shine-color: var(--color-4);
$animation-duration: 2.0s;
$avatar-offset: 52 + 16;

@mixin background-gradient {
  background-image: linear-gradient(90deg, $base-color 0px, $shine-color 40px, $base-color 80px);
  background-size: 600px;
}

.lineLoader {
    float: left;
    width: 100px;
    height: 100%;
    border-radius: 7px;
    border: 1px solid var(--color-1);
    box-shadow: 0px 1px 0px 0px var(--color-1);

    @include background-gradient;
    animation: shine-lines $animation-duration infinite ease-out;
}

@keyframes shine-lines{
    0% { background-position: -100px;}
    40%, 100% {background-position: 140px;}
}
</style>
