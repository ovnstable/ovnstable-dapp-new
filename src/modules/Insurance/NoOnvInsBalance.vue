<template>
  <div class="ovn-dashboard__nobalance">
    <p>MINT OR SWAP OVN TO SEE YOUR OVN AND INSURANCE BALANCE</p>
    <div class="ovn-dashboard__nobalance-buttons">
      <router-link
        to="/"
      >
        <ButtonComponent
          class="ovn-dashboard__nobalance-button"
        >
          <BaseIcon
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
    <MintRedeemModal
      v-model="showModalMintRedeem"
    />
  </div>
</template>

<script lang="ts">
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import MintRedeemModal from '@/modules/Insurance/MintRedeemModal.vue';

export default {
  name: 'NoOvnInsBalance',
  components: {
    ButtonComponent,
    BaseIcon,
    MintRedeemModal,
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
  align-items: center; // This centers the flex children horizontally
  justify-content: center; // This centers the flex children vertically, if needed
  text-align: center;
  [data-theme="dark"] & {
    background-color: var(--color-7);
    color: var(--color-6);
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
      color: var(--color-4);
    }
  }
}

.ovn-dashboard__nobalance-button {
  svg{
    margin-right: 8px;
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

</style>
