<template>
  <div class="app-header">
    <div class="app-header__container">
      <div class="app-header__content">
        <div
          v-if="deviceSize.isDesktop"
          class="app-header-dapp"
        >
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
            to="/pools"
            class="app-header__dashboard"
            active-class="active-link"
          >
            POOLS
          </router-link>
          <router-link
            to="/positions"
            class="app-header__dashboard"
            active-class="active-link"
          >
            MY POSITIONS
          </router-link>
          <router-link
            to="/market/usd"
            class="app-header__dashboard"
            active-class="active-link"
          >
            STATS
          </router-link>
          <router-link
            to="/ovn"
            class="app-header__dashboard"
            active-class="active-link"
          >
            OVN
          </router-link>
          <router-link
            to="/dashboard"
            class="app-header__dashboard"
            active-class="active-link"
          >
            DASHBOARD
          </router-link>
        </div>

        <div class="app-header__content-data">
          <router-link
            v-if="!account && !deviceSize.isDesktop"
            to="/"
            class="app-header__content__logo"
            :style="{ 'margin-right': (!walletConnected || !account) ? 'auto' : '' }"
          >
            <BaseIcon
              class="app-header__content__logo-svg"
              name="IconLogo"
            />

            <h1>
              OVERNIGHT
            </h1>
          </router-link>
          <div
            v-if="account && balancesLoading && !deviceSize.isMobile"
            :class="['lineLoader', 'app-header__balance-loader']"
          />

          <div
            v-if="account && balancesLoading && deviceSize.isDesktop"
            :class="['lineLoader']"
          />
          <UserBalances
            v-else-if="walletConnected && !deviceSize.isMobile"
            class="app-header__balances"
          />
          <img
            v-if="!deviceSize.isDesktop && (!walletConnected || !account)"
            class="app-header__gear"
            alt="navbar"
            :src="getImageUrl(`assets/icons/common/${light ? 'CommonGearDark.svg' : 'CommonGear.svg'}`)"
            @click="showMobMenu = !showMobMenu"
            @keypress="showMobMenu = !showMobMenu"
          />
          <MobileMenu
            :is-show="showMobMenu"
            @close="showMobMenu = false"
          />
          <div
            v-if="account && accountRenderLoading"
            class="lineLoader"
          />

          <ButtonComponent
            v-else-if="walletConnected && account && !accountRenderLoading"
            class="app-header__content-account"
            btn-styles="secondary"
            @click="openAccountModal"
          >
            <span>
              {{ cutString(account, 4, 4)?.toUpperCase() }}
            </span>
            <div
              class="app-header__chain"
              :style="{ backgroundColor: selectedProfileColor ? selectedProfileColor : '#0497EC' }"
            />
          </ButtonComponent>

          <ButtonComponent
            v-else-if="!walletConnected"
            class="app-header__connect"
            :style="{ 'margin-left': (!walletConnected || !account) ? '0' : 'auto' }"
            @on-click="connectWallet"
          >
            CONNECT
          </ButtonComponent>

          <div
            v-if="walletConnected && account"
            class="app-header__network-wrap"
          >
            <img
              v-if="!deviceSize.isDesktop"
              class="app-header__gear"
              alt="navbar"
              :src="getImageUrl(`assets/icons/common/${!light ? 'CommonGearDark.svg' : 'CommonGear.svg'}`)"
              @click="showMobMenu = !showMobMenu"
              @keypress="showMobMenu = !showMobMenu"
            />
            <MobileMenu
              :is-show="showMobMenu"
              @close="showMobMenu = false"
            />
            <PopperComponent
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
                    v-for="item in sortedChains"
                    :key="item.name"
                    class="networks-list__item"
                    @click="chooseNetwork(item.chain, close)"
                    @keypress="chooseNetwork(item.chain, close)"
                  >
                    <BaseIcon :name="item.name.toLowerCase()" />
                    {{ item.name }}
                  </div>
                  <div class="networks-list__depr">
                    <div class="networks__divider" />
                    <h3>
                      Deprecated
                    </h3>
                    <div class="networks-list__row">
                      <SpinnerComponent
                        v-if="chainsLoading"
                        size="20px"
                      />
                      <div v-else>
                        {{ isShowDeprecated ? "On" : "Off" }}
                      </div>
                      <SwitchComponent
                        :is-checked="isShowDeprecated"
                        :disabled="chainsLoading"
                        @change-switch="showDeprecated"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </PopperComponent>
          </div>
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
import SwitchComponent from '@/components/Switch/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import SpinnerComponent from '@/components/Spinner/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { cutString } from '@/utils/strings.ts';
import {
  appNetworksData, getImageUrl,
} from '@/utils/const.ts';
import { sortedChainsByTVL } from '@/store/helpers/index.ts';
import AccountModal from '@/modules/Account/Index.vue';
import { deviceType } from '@/utils/deviceType.ts';
import { useEventBus } from '@vueuse/core';
import UserBalances from './UserBalances.vue';
import MobileMenu from './MobileMenu.vue';

interface Chain {
  chainName: string;
  tvl: number;
  name: string,
  chain: number,
}

export default {
  name: 'HeaderBar',
  components: {
    ButtonComponent,
    SwitchComponent,
    SpinnerComponent,
    UserBalances,
    MobileMenu,
    AccountModal,
    BaseIcon,
  },
  data() {
    return {
      selectedProfileColor: localStorage.getItem('selectedProfileColor'),
      sortedChains: [] as Chain[],
      chainsLoading: false,
      networksData: appNetworksData,
      showModalAccount: false,
      showMobMenu: false,
    };
  },
  computed: {
    ...mapState('odosData', ['isBalancesLoading', 'isTokensLoadedAndFiltered', 'firstRenderDone', 'isTokensLoading']),
    ...mapGetters('walletAction', ['walletConnected']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('network', ['networkId', 'isShowDeprecated']),
    ...mapGetters('theme', ['light']),

    balancesLoading() {
      if (this.isTokensLoading) return true;
      return false;
    },
    accountRenderLoading() {
      if (this.firstRenderDone) return false;
      return (this.account && this.isBalancesLoading) || !this.isTokensLoadedAndFiltered;
    },
    activeNetworkData() {
      const data = appNetworksData.find((_) => _.chain === this.networkId);
      return data || appNetworksData[0];
    },
    deviceSize() {
      return deviceType();
    },
  },
  watch: {
    async isShowDeprecated() {
      this.chainsLoading = true;
      this.sortedChains = await sortedChainsByTVL(this.networksData, this.isShowDeprecated);
      this.chainsLoading = false;
    },
  },
  async mounted() {
    this.sortedChains = await sortedChainsByTVL(this.networksData, this.isShowDeprecated);
    const onTabChange = useEventBus<string>('change-profile-picture-request');
    onTabChange.on((color) => {
      this.selectedProfileColor = color;
    });
  },
  methods: {
    ...mapActions('network', ['setWalletNetwork', 'showDeprecated']),
    getImageUrl,
    openAccountModal() {
      this.showModalAccount = !this.showModalAccount;
    },
    closeAccountModal() {
      this.showModalAccount = false;
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

</style>

<style lang="scss" scoped>
.app-header {
  // position: fixed;
  position: sticky;
  margin-bottom: auto;
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
   @media (max-width: 1024px) {
    background-color: transparent;
    border-bottom: unset;
    position: relative;
    margin-bottom: 20px;
  }
  @media (max-width: 640px) {
    background-color: var(--color-5);
    border-bottom: unset;
    position: fixed;
  }
}

.app-header__balance-loader {
  @media (min-width: 1024px) {
    display: none
  }
  @media (min-width: 640px) and (max-width: 768px) {
    display: none;
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
  color: var(--color-3);
  text-decoration: underline;
}
.app-header__docs {
  text-decoration: none;
}

.app-header__container {
  width: 100%;
  max-width: 1360px;
  padding: 0 20px;
  margin: 0 auto;
}

.app-header__content {
  display: flex;
  justify-content: space-between;

  @media (max-width: 1024px) {
    width: 100%;
  }
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
  border-radius: 12px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    color: var(--color-4);
    box-shadow: none;
  }

  span {
    position: relative;
    top: 1px;
  }
}
.app-header__chain_account {
  padding: 5px 10px;
  border-radius: 12px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    box-shadow: none;
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

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
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
  align-items: center;
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

.app-header__network-wrap {
  display: flex;
  gap: 20px;
  @media (max-width: 1024px) {
    margin-left: auto;
  }
}

.app-header__gear {
  cursor: pointer;
  transition: opacity .2s ease;

  &:hover {
    opacity: .8;
  }
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.app-header__connect {
  margin-left: auto;
}

.networks__divider {
  margin: 10px 0;
  width: 100%;
  height: 1px;
  background-color: var(--color-7);
}

.networks-list__depr {
  padding: 0 14px 12px 14px;

  h3 {
    margin-bottom: 10px;
  }
}

.networks-list__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header__balances {
  position: relative;
  @media (max-width: 1024px) {
    order: 3;
  }
}

</style>
