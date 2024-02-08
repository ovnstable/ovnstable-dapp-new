<template>
  <div class="app-header">
    <div class="app-header__container">
      <div class="app-header__content">
        <router-link
          to="/"
          class="app-header__content__logo"
        >
          <BaseIcon :name="iconName" />

          <h1>
            OVERNIGHT
          </h1>
        </router-link>

        <div class="app-header__content-data">
          <ButtonComponent
            v-if="walletConnected && account"
            class="app-header__content-account"
            btn-styles="secondary"
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
                class="networks-list"
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
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { cutString } from '@/utils/strings.ts';
import { appNetworksData } from '@/utils/const.ts';

export default {
  name: 'HeaderBar',
  components: {
    ButtonComponent,
    BaseIcon,
  },
  data() {
    return {
      networksData: appNetworksData,
    };
  },
  computed: {
    ...mapGetters('walletAction', ['walletConnected']),
    ...mapGetters('accountData', ['balance', 'account']),
    ...mapGetters('network', ['networkId']),

    activeNetworkData() {
      const data = appNetworksData.find((_) => _.chain === this.networkId);
      return data || appNetworksData[0];
    },
    iconName() {
      return this.$store.state.theme.light ? 'IconLogoDark' : 'IconLogo';
    },
  },
  methods: {
    ...mapActions('network', ['setWalletNetwork']),
    disconnectWallet() {
      console.log('disconnectWallet');
      this.$store.dispatch('walletAction/disconnectWallet');
    },
    connectWallet() {
      console.log('connectWallet');
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

<style lang="scss" scoped>
.app-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 12px 0;
  background-color: #fff;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-bottom: 1px solid var(--color-4);
  }
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

.networks-list {
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
    color: var(--color-3);
  }
  svg {
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

.networks-active {
  width: 20px;
  height: 20px;
}
</style>
