<template>
  <div class="ovn-dashboard__nobalance">
    <p>MINT OR SWAP OVN TO SEE YOUR OVN AND INSURANCE BALANCE</p>
    <div
      v-if="!device.isMobile"
      class="ovn-dashboard__nobalance-buttons"
    >
      <router-link
        to="/"
      >
        <ButtonComponent
          class="ovn-dashboard__nobalance-button"
        >
          <BaseIcon
            class="ovn-dashboard__nobalance-button-swap"
            name='SwapIcon'
          />
          Swap
        </ButtonComponent>
      </router-link>

      <ButtonComponent
        class="ovn-dashboard__nobalance-button"
        @click="toggleModalMintRedeem()"
        @keydown.enter="toggleModalMintRedeem()"
      >
        <BaseIcon
          class="insurance__mint-button"
          name='InsuranceMint'
        />
        MINT
      </ButtonComponent>

      <router-link
        to="/"
      >
        <ButtonComponent class="ovn-dashboard__nobalance-button">
          <BaseIcon
            name='InsuranceBridge'
          />
          BRIDGE
        </ButtonComponent>
      </router-link>

    </div>
    <div
      v-else
      class="ovn-dashboard__nobalance-buttons"
    >
      <div class="ovn-dashboard__nobalance-button-wrap">
        <ButtonComponent
          class="ovn-dashboard__nobalance-button"
          @click="toggleModalMintRedeemMobile()"
          @keydown.enter="toggleModalMintRedeemMobile()"
        >
          <BaseIcon
            name='InsuranceMint'
          />

        </ButtonComponent>
        <p>MINT</p>
      </div>
      <div class="ovn-dashboard__nobalance-button-wrap">
        <router-link
          to="/"
        >
          <ButtonComponent class="ovn-dashboard__nobalance-button">
            <BaseIcon
              name='InsuranceBridge'
            />
          </ButtonComponent>
        </router-link>
        <p>BRIDGE</p>
      </div>

      <div class="ovn-dashboard__nobalance-button-wrap">
        <ButtonComponent
          class="ovn-dashboard__nobalance-button"
          @click="toggleModalMintRedeemMobile()"
          @keydown.enter="toggleModalMintRedeemMobile()"
        >
          <BaseIcon
            class="insurance__redeem-button"
            name='InsuranceRedeem'
          />
        </ButtonComponent>
        <p>REDEEM</p>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { deviceType } from '@/utils/deviceType.ts';

export default {
  name: 'NoOvnInsBalance',
  components: {
    ButtonComponent,
    BaseIcon,
  },
  data() {
    return {
      showModalMintRedeem: false,
    };
  },
  methods: {
    toggleModalMintRedeem() {
      this.showModalMintRedeem = true;
    },
    toggleModalMintRedeemMobile() {
      if (this.device.isMobile) {
        this.showModalMintRedeem = true;
        this.$store.commit('insuranceTokenData/setIsMobileMintRedeem', {
          value: this.showModalMintRedeem,
        });
      } else {
        this.showModalMintRedeem = !this.showModalMintRedeem;
      }
    },
  },
  computed: {
    device() {
      return deviceType();
    },
  },
};
</script>

<style lang="scss" scoped>

.ovn-dashboard__nobalance {
  width: 100%;
  padding: 21px 0px;
  background-color: var(--color-8);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  [data-theme="dark"] & {
    background-color: var(--color-7);
    color: var(--color-18);
  }
}
.ovn-dashboard__nobalance-text {
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  span {
    display: inline-block;
    margin-top: 10px;
  }
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.ovn-dashboard__nobalance-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  gap: 20px;
  button {
    background-color: var(--color-5);
    border: 1px solid var(--color-1);
    border-radius: 30px;
    box-shadow: none;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-1);
    [data-theme="dark"] & {
      box-shadow: none;
      color: var(--color-4);
    }
  }
}

.ovn-dashboard__nobalance-button {
  svg {
    margin-right: 8px;
    [data-theme="dark"] & {
      fill: var(--color-4);
    }
  }
}
.ovn-dashboard__nobalance-button-swap {
  [data-theme="dark"] & {
    stroke: var(--color-4);
  }
}
.insurance__redeem-button {
  margin-left: 8px;
}
.ovn-dashboard__nobalance-connect-btn {
  background: none;
  border: none;
  box-shadow: none;
  font-size: 15px;
  font-weight: 500;
  padding: 0;
  font-family: 'Red Hat Display';
  color: var(--color-2);
  padding-bottom: 1px;
  text-decoration: underline;
  [data-theme="dark"] & {
    color: var(--color-18);
    box-shadow: none;
    background: none;
  }
}
.ovn-dashboard__nobalance-wallet {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

@media (max-width: 640px) {
  .ovn-dashboard__nobalance-buttons {
    margin-top: 20px;
    justify-content: space-between;
    width: 100%;
    padding: 0 20px;
  }
  .ovn-dashboard__nobalance-button-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .ovn-dashboard__nobalance-button {
    padding: 10px;
    border-radius: 50%;
    svg {
      margin: 0;
    }
  }
}
</style>
