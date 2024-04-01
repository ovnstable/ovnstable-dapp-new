<template>
  <div>
    <ButtonComponent
      v-if="device.isMobile"
      class="change-network-close-modal"
      @click="closeModal()"
      @keydown.enter="closeModal()"
    >
      <BaseIcon
        name='ArrowExitMobile'
      />
    </ButtonComponent>
    <div class="change-network">
      <div class="insurance__modal-mint-redeem-buttons">
        <ButtonComponent
          :class="{
            'insurance__modal-mint-redeem-button-selected': selectedAction === 'mint',
            'insurance__modal-mint-redeem-button-first': true,
            'insurance__modal-mint-redeem-button-overlap-first': selectedAction !== 'mint',
          }"
          @click="selectedAction = 'mint'"
        >
          <p>MINT</p>
        </ButtonComponent>
        <ButtonComponent
          :class="{
            'insurance__modal-mint-redeem-button-selected': selectedAction === 'redeem',
            'insurance__modal-mint-redeem-button-last': true,
            'insurance__modal-mint-redeem-button-overlap-last': selectedAction === 'redeem',
          }"
          @click="selectedAction = 'redeem'"
        >
          <p>REDEEM</p>
        </ButtonComponent>
      </div>
      <div class="change-network-divider" />
      <BaseIcon
        class="change-network-warning"
        name="CommonWarning"
      />
      <div class="change-network__text">
        PLEASE, SWITCH TO OTHER CHAIN<br>
        FOR {{selectedAction === 'mint' ? 'MINTING' : 'REDEEM'}} OVN.
      </div>
      <div class="change-network-divider" />
      <p class="change-network__warning-text">The chains on which you can perform actions<br>
        with OVN are presented below:</p>
      <div class="change-network__chains">
        <div
          v-for="chain in availableChains"
          :key="chain"
        >
          <ButtonComponent
            class="change-network__btn"
            btn-size="large"
            @click="setWalletNetwork(chain.toLocaleLowerCase())"
          >
            {{ chain }}
          </ButtonComponent>
        </div>
      </div>

      <div class="change-network-divider" />
      <p
        class="change-network__switch-text"
        btn-size="large"
      >
        SWITCH TO OTHER CHAIN
      </p>
      <img
        alt="navbar"
        :src="getImageUrl(`assets/icons/common/SlothUnavailable.png`)"
      />
    </div>

  </div>

</template>

<script lang="ts">
import {
  mapActions, mapGetters,
} from 'vuex';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';
import { getImageUrl } from '@/utils/const.ts';
import { deviceType } from '@/utils/deviceType.ts';

export default {
  name: 'SwitchChainInsurance',
  components: {
    ButtonComponent,
    BaseIcon,
  },
  data() {
    return {
      selectedAction: 'mint',
    };
  },
  computed: {
    ...mapGetters('network', ['getParams', 'networkId']),
    device() {
      return deviceType();
    },
    availableChains() {
      const availableNetworks = Object.entries(chainContractsMap)
        .reduce((acc: string[], [network, contracts]: [string, any]) => {
          if (contracts.token_insurance) {
            acc.push(network.charAt(0).toUpperCase() + network.slice(1));
          }
          return acc;
        }, []);

      return availableNetworks;
    },
  },
  methods: {
    ...mapActions('network', ['setWalletNetwork']),
    getImageUrl,
    closeModal() {
      this.$emit('closeModal');
    },
  },
};
</script>

<style lang="scss" scoped>

.change-network {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 30px;
  text-align: center;
  gap: 30px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 30px;
  min-width: 600px;
  min-height: 500px;
  width: 100%;
  border-radius: 12px;

  svg {
    margin: 0 auto;
  }
  button {
    [data-theme="dark"] & {
      box-shadow: none;
    }
  }
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
  img {
  max-width: 300px;
  max-height: 160px;
  display: block;
  margin: 20px auto;
  @media (max-width: 640px) {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: auto;
    margin-right: auto;
    max-width: 200px;
    max-height: 100px;
  }
}

}
.change-network__text {
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.change-network__chains {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 40px;
}
.change-network-divider {
  border: 1px solid var(--color-7);
  [data-theme="dark"] & {
    border-color: var(--color-5);
  }
}
.change-network-warning {
  scale: 150%;
}
.change-network__warning-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.change-network-close-modal {
  border: none;
  background: none;
  box-shadow: none;
  align-items: left;
  justify-content: start;
  [data-theme="dark"] & {
    box-shadow: none;
    svg {
      fill: var(--color-4);
    }
  }
}
.change-network__btn {
  box-shadow: none;
  border: none;
  border-radius: 30px;
  padding: 2px 20px;
  [data-theme="dark"] & {
    background-color: var(--color-6);
  }
}
.change-network__switch-text {
  background-color: var(--color-5);
  border-radius: 10px;
  padding: 9px;
  font-size: 17px;
  font-weight: 500;
  color: var(--color-2);
  [data-theme="dark"] & {
    background-color: var(--color-6);
    color: var(--color-18);
  }
}
.change-network__text {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__modal-mint-redeem-buttons {
  display: flex;
  flex-direction: row;
  align-self: center;
  position: relative;

  button {
    font-size: 14px;
    background-color: var(--color-5);
    color: var(--color-2);
    border: 1px solid var(--color-6);
    box-shadow: none;
    margin-right: -10px;
    position: relative;
    z-index: 0;

    &:first-child {
      border-radius: 30px;
    }

    &:last-child {
      border-radius: 0px 30px 30px 0px;
      margin-right: 0
    }
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
  .insurance__modal-mint-redeem-button-overlap-first {
    border-radius: 30px 0px 0px 30px !important;
    margin-left: 0
  }
  .insurance__modal-mint-redeem-button-overlap-last {
    border-radius: 30px 30px 30px 30px !important;
  }

  .insurance__modal-mint-redeem-button-selected {
    background-color: var(--color-6);
    color: var(--color-1);
    border-color: var(--color-1);
    z-index: 1;
    padding: 2px 26px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}
@media (max-width: 640px) {
  .change-network__btn {
    font-size: 16px;
  }
  .change-network {
    min-width: 0;
    min-height: 0;
  }
}
</style>
