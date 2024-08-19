<template>
  <PopperComponent
    interactive
    placement="bottom-end"
  >
    <div
      v-if="isBalancesLoading && !device.isDesktop"
      class="lineLoaderMobile"
    />
    <ButtonComponent
      v-else
      class="app-header__balance-account"
      btn-styles="secondary"
    >
      <span>
        {{ totalUserBalance }} $
      </span>
      <BaseIcon
        name="ArrowDown"
      />
    </ButtonComponent>
    <template #content="{ close }">
      <div
        class="popper-list"
      >
        <div
          v-for="(item, key) in userBalancesList"
          :key="key"
          class="networks-list__item app-header__balance-item"
          @click="close"
          @keypress="close"
        >
          <span>
            {{ item.balance }}
          </span>
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
</template>

<script lang="ts">
import { mapGetters, useStore } from 'vuex';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { deviceType } from '@/utils/deviceType.ts';
import BN from 'bignumber.js';
import { computed, defineComponent } from 'vue';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import TokenService from '@/services/TokenService/TokenService.ts';
import type { TTokenInfo } from '@/types/common/tokens/index.ts';

type TBalanceList = {
  balance: string,
  balanceInUsd: string,
  symbol: string,
}

export default defineComponent({
  name: 'UserBalances',
  components: {
    ButtonComponent,
    BaseIcon,
  },
  setup: () => {
    const store = useStore() as any;

    const {
      data: allTokensList,
      isBalancesLoading,
      changeQueryData
    } = useTokensQuery(store.state);

    return {
      allTokensList,
      isBalancesLoading,
      changeQueryData
    };
  },
  watch: {
    networkId(val: number) {
      this.changeQueryData(val);
    },
  },
  computed: {
    ...mapGetters('network', ['networkId']),
    device() {
      return deviceType();
    },
    totalUserBalance() {
      const total = this.userBalancesList
        .reduce((acc: BN, token: TBalanceList) => acc
          .plus(BN(token.balanceInUsd)), BN(0));

      return total.toFixed(2);
    },

    userBalancesList() {
      const ovnTokens = TokenService.getFilterOvnTokens(this.allTokensList as TTokenInfo[]);

      const uniqueBalances = ovnTokens.map(
        (token: TTokenInfo) => ({
          balanceInUsd: BN(token.balanceData!.balanceInUsd).toFixed(2),
          balance: BN(token.balanceData!.balance).toFixed(2),
          symbol: token.symbol,
        }),
      );

      return uniqueBalances;
    },

  },
});
</script>
<style lang="scss">
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
  // position: fixed;
  position: sticky;
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
  margin-bottom: auto;
}

.app-header__balance-account {
  min-width: 130px;
  min-height: 31px;
  justify-content: space-between;

  span {
    padding-right: 10px;
  }

  svg path {
    fill: var(--color-3);
  }
  [data-theme="dark"] & {
    background-color: var(--color-17) !important;
  }

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    min-height: 50px;
    font-size: 20px;
    font-weight: 700;
    background: var(--color-4);

    &:hover {
      background: var(--color-8);
    }
  }
  @media (max-width: 640px) {
    margin-top: 20px;
    background-color: var(--color-4);
    [data-theme="dark"] & {
      background-color: var(--color-17);
    }

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
  font-size: 20px;
  font-weight: 500;

  [data-theme="dark"] & {
    background: var(--color-17);
  }

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    border-radius: 10px;
    font-weight: 700;
  }
}

.networks-list__item {
  display: flex;
  font-size: 14px;
  color: var(--color-1);
  padding: 8px 14px;
  cursor: pointer;
  transition: background-color .2s ease, color .2s ease;
  [data-theme="dark"] & {
    color: var(--color-4);
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

  span {
    margin-right: 5px;
  }
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
  font-size: 14px;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }

  span:first-child {
    text-decoration: underline;
  }
}
</style>
