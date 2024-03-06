<template>
  <PopperComponent
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
</template>

<script lang="ts">
import { mapGetters, mapState } from 'vuex';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { OVN_TOKENS, appNetworksData } from '@/utils/const.ts';
import BigNumber from 'bignumber.js';

export default {
  name: 'UserBalances',
  components: {
    ButtonComponent,
    BaseIcon,
  },
  data() {
    return {
      networksData: appNetworksData,
      showModalAccount: false,
    };
  },
  computed: {
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['originalBalance']),
    ...mapGetters('odosData', ['allTokensList']),
    ...mapState('odosData', ['tokensMap']),

    totalUserBalance() {
      if (this.originalBalance.length === 0) return '0';
      const total: BigNumber = this.originalBalance.reduce((acc: BigNumber, curr: any) => {
        // linea/blast doesnt have token from ODOS, so we using our schemas values
        const tokensForChain = this.allTokensList?.length > 0
          ? this.allTokensList
          : Object.values(this.tokensMap?.chainTokenMap[this.networkId]?.tokenMap ?? {});
        const tokenData = tokensForChain.find((_: any) => _.symbol === curr.symbol);

        if (!tokenData || !curr.isOvnToken) return acc;
        // todo: load tokens prices if needed, linea/blast

        const tokenPrice = [81457, 59144].includes(this.networkId) ? 1 : tokenData.price;
        const fixedBalance = new BigNumber(curr.balance)
          .div(10 ** tokenData.decimals)
          .times(tokenPrice);
        return acc.plus(fixedBalance);
      }, BigNumber(0));

      return total.toFixed(2);
    },

    userBalancesList() {
      console.log(this.tokensMap, this.networkId, '--this.originalBalance');
      if (this.originalBalance.length === 0) return [];
      return this.originalBalance
        .filter((_: any) => OVN_TOKENS.includes(_.symbol)).map((bal: any) => {
          const tokensForChain = this.allTokensList?.length > 0
            ? this.allTokensList
            : Object.values(this.tokensMap?.chainTokenMap[this.networkId]?.tokenMap ?? {});
          const tokenData = tokensForChain.find((_: any) => _.symbol === bal.symbol);

          return {
            balance: tokenData ? new BigNumber(bal.balance).div(10 ** tokenData.decimals).toFixed(2) : '0',
            symbol: tokenData?.symbol,
          };
        });
    },
  },
};
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

.app-header__container {
  width: 100%;
  max-width: 1350px;
  padding: 0 20px;
  margin: 0 auto;
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
</style>
