<template>
  <ModalComponent
    v-if="!insuranceIsMobileOvnDashboard && !device.isMobile"
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div class="insurance__modal-ovn-dashboard">
      <div class="insurance__modal-ovn-dashboard-title">
        <p>OVN DASHBOARD</p>
        <div
          v-if="isAnyOvnInsBalance"
          class="insurance__modal-ovn-dashboard-buttons"
        >
          <router-link
            to="/"
          >
            <ButtonComponent
              class="insurance__title-button"
            >
              <BaseIcon
                name='SwapIcon'
              />
              Swap
            </ButtonComponent>
          </router-link>

          <ButtonComponent
            class="insurance__title-button"
            @click="toggleModalMintRedeem()"
            @keydown.enter="toggleModalMintRedeem()"
          >
            <BaseIcon
              class="insurance__mint-button"
              name='InsuranceMint'
            />
            MINT / REDEEM
            <BaseIcon
              name='InsuranceRedeem'
              class="insurance__redeem-button"
            />
          </ButtonComponent>

          <router-link
            to="/"
          >
            <ButtonComponent class="insurance__title-button">
              <BaseIcon
                name='InsuranceBridge'
              />
              BRIDGE
            </ButtonComponent>
          </router-link>

        </div>
      </div>
      <div class="insurance__modal-divider" />
      <div
        v-if="isAnyOvnInsBalance"
        class="insurance__modal-ovn-dashboard-balance-info"
      >
        <div class="insurance__modal-ovn-dashboard-balance-info-ovn">
          <div class="insurance__modal-ovn-dashboard-balance-info-icon">
            <BaseIcon
              name='InsuranceOVNVault'
            />
            <p>OVN BALANCE</p>
          </div>
          <div class="insurance__modal-ovn-dashboard-balance-info-numbers">
            <p>{{getBalanceOVNIns('OVN')}} OVN</p>
            <p>${{costOvn.toFixed(2)}}</p>
          </div>
        </div>
        <div class="insurance__modal-ovn-dashboard-balance-info-ins">
          <div class="insurance__modal-ovn-dashboard-balance-info-icon">
            <BaseIcon
              name='InsuranceModalINS'
            />
            <p>BALANCE IN INS</p>
          </div>
          <div class="insurance__modal-ovn-dashboard-balance-info-numbers">
            <p>{{getBalanceOVNIns('OVNINS')}} OVN</p>
            <p>${{costOvnINS.toFixed(2)}}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <NoOvnInsBalance />
      </div>
      <div class="insurance__modal-divider" />
      <div class="insurance__modal-ovn-dashboard-profit-loss">
        <p>YOUR OVN PROFIT/LOSS</p>
        <div class="insurance__modal-ovn-dashboard-profit-loss-day">
          <p>LAST DAY:</p>
          <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">000.00 OVN</p>
          <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">$000.00</p>
          <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">+0%</p>
        </div>
        <div class="insurance__modal-ovn-dashboard-profit-loss-all">
          <p>ALL TIME:</p>
          <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">000.00 OVN</p>
          <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">$000.00</p>
          <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">+0%</p>
        </div>
      </div>
      <div class="insurance__modal-divider" />
      <AccountTransactions
        :isOvnTrxs="true"
        class="insurance__modal-ovn-dashboard-trxs"
      />
    </div>
    <MintRedeemModal
      v-model="showModalMintRedeem"
    />
  </ModalComponent>
  <div
    class="insurance__modal-ovn-dashboard"
    v-else-if="insuranceIsMobileOvnDashboard && !insuranceIsMobileMintRedeem"
  >
    <div class="insurance__modal-ovn-dashboard-exit">
      <ButtonComponent
        @click="toggleModalOvnDashboard()"
        @keydown.enter="toggleModalOvnDashboard()"
      >
        <BaseIcon
          name='ArrowExitMobile'
        />
      </ButtonComponent>
      <p>OVN AND INSURANCE DASHBOARD</p>
    </div>
    <div
      v-if="isAnyOvnInsBalance"
      class="insurance__modal-ovn-dashboard-buttons"
    >
      <div class="insurance__modal-ovn-dashboard-button-wrapper">
        <ButtonComponent
          class="insurance__modal-ovn-dashboard-button"
          @click="toggleModalMintRedeemMobile"
          @keydown.enter="toggleModalMintRedeemMobile"
        >
          <BaseIcon
            class="insurance__mint-button"
            name='InsuranceMint'
          />
        </ButtonComponent>
        <p>MINT</p>
      </div>

      <div class="insurance__modal-ovn-dashboard-button-wrapper">
        <ButtonComponent
          class="insurance__modal-ovn-dashboard-button"
          @click="toggleModalMintRedeemMobile()"
          @keydown.enter="toggleModalMintRedeemMobile()"
        >
          <BaseIcon
            name='InsuranceRedeem'
            class="insurance__redeem-button"
          />
        </ButtonComponent>
        <p>REDEEM</p>
      </div>

      <router-link
        class="insurance__modal-ovn-dashboard-button-wrapper"
        to="/"
      >
        <ButtonComponent class="insurance__modal-ovn-dashboard-button">
          <BaseIcon
            name='InsuranceBridge'
          />
        </ButtonComponent>
        <p>BRIDGE</p>
      </router-link>
    </div>
    <div v-else>
      <NoOvnInsBalance />
    </div>
    <div
      v-if="isAnyOvnInsBalance"
      class="insurance__modal-divider"
    />

    <div
      v-if="isAnyOvnInsBalance"
      class="insurance__modal-ovn-dashboard-balance-info"
    >
      <div class="insurance__modal-ovn-dashboard-balance-info-ovn">
        <div class="insurance__modal-ovn-dashboard-balance-info-icon">
          <BaseIcon
            name='InsuranceOVNVault'
          />
          <p>OVN BALANCE</p>
        </div>
        <div class="insurance__modal-ovn-dashboard-balance-info-numbers">
          <p>{{getBalanceOVNIns('OVN')}} OVN</p>
          <p>${{costOvn.toFixed(2)}}</p>
        </div>
      </div>
      <div class="insurance__modal-ovn-dashboard-balance-info-ins">
        <div class="insurance__modal-ovn-dashboard-balance-info-icon">
          <BaseIcon
            name='InsuranceModalINS'
          />
          <p>BALANCE IN INS</p>
        </div>
        <div class="insurance__modal-ovn-dashboard-balance-info-numbers">
          <p>{{getBalanceOVNIns('OVNINS')}} OVN</p>
          <p>${{costOvnINS.toFixed(2)}}</p>
        </div>
      </div>
    </div>
    <div class="insurance__modal-divider" />
    <div class="insurance__modal-ovn-dashboard-profit-loss">
      <p>PROFIT/LOSS</p>
      <div class="insurance__modal-ovn-dashboard-profit-loss-day">
        <p class="insurance__modal-ovn-dashboard-profit-loss-day-title-mob">LAST DAY:</p>
        <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">000.00 OVN</p>
        <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">$000.00</p>
        <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">+0%</p>
      </div>
      <div class="insurance__modal-ovn-dashboard-profit-loss-all">
        <p class="insurance__modal-ovn-dashboard-profit-loss-day-title-mob">ALL TIME:</p>
        <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">000.00 OVN</p>
        <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">$000.00</p>
        <p :class="{ 'no-ovn-ins': !isAnyOvnInsBalance }">+0%</p>
      </div>
    </div>
    <div class="insurance__modal-divider" />
    <AccountTransactions
      :isOvnTrxs="true"
      class="insurance__modal-ovn-dashboard-trxs"
    />

  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { deviceType } from '@/utils/deviceType.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import MintRedeemModal from '@/modules/Insurance/MintRedeemModal.vue';
import AccountTransactions from '@/modules/Account/AccountTransactions.vue';
import NoOvnInsBalance from '@/modules/Insurance/NoOnvInsBalance.vue';

export default {
  name: 'OvnDashboardModal',
  components: {
    ModalComponent,
    ButtonComponent,
    BaseIcon,
    AccountTransactions,
    MintRedeemModal,
    NoOvnInsBalance,
  },
  data() {
    return {
      showModal: false,
      ovnAmount: 0,
      ovnDecimals: 18,
      costOvn: 0,
      costOvnINS: 0,
      showModalMintRedeem: false,
    };
  },
  props: {
    price: {
      type: Number,
      default: null,
    },
  },
  computed: {
    ...mapGetters('accountData', ['originalBalance']),
    insuranceIsMobileOvnDashboard() {
      return this.$store.state.insuranceTokenData.isMobileOvnDashboard.value;
    },
    insuranceIsMobileMintRedeem() {
      return this.$store.state.insuranceTokenData.isMobileMintRedeem.value;
    },
    device() {
      return deviceType();
    },
    isAnyOvnInsBalance() {
      return (this.getBalanceOVNIns('OVN') !== '0.00' || this.getBalanceOVNIns('OVNINS') !== '0.00');
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    toggleModalMintRedeem() {
      this.showModalMintRedeem = true;
    },
    toggleModalOvnDashboard() {
      this.$store.commit('insuranceTokenData/setIsMobileOvnDashboard', {
        value: false,
      });
    },
    toggleModalMintRedeemMobile() {
      console.log('toggleModalMintRedeemMobile clicked');
      if (this.device.isMobile) {
        this.showModalMintRedeem = true;
        this.$store.commit('insuranceTokenData/setIsMobileMintRedeem', {
          value: this.showModalMintRedeem,
        });
      } else {
        this.showModalMintRedeem = !this.showModalMintRedeem;
      }
    },
    getBalanceOVNIns(symbol: any) {
      const balanceItem = this.originalBalance.find((item: any) => item.symbol === symbol);
      if (!balanceItem) {
        return '0.00';
      }
      const balanceBigInt = BigInt(balanceItem.balance);
      const mainPart = balanceBigInt / BigInt(10 ** this.ovnDecimals);
      const remainder = balanceBigInt % BigInt(10 ** this.ovnDecimals);
      const remainderString = remainder.toString().padStart(this.ovnDecimals, '0');
      const formattedBalance = `${mainPart}.${remainderString.slice(0, this.ovnDecimals)}`;
      const finalBalance = parseFloat(formattedBalance).toFixed(2);
      this.costOvn = parseFloat(formattedBalance) * this.price;
      this.costOvnINS = parseFloat(formattedBalance) * this.price;
      return finalBalance;
    },
  },
};
</script>

<style lang="scss" scoped>
.insurance__modal-divider {
  border: 1px solid var(--color-7);
  margin-top: 20px;
  margin-bottom: 20px;
}
.insurance__modal-ovn-dashboard {
  width: 860px;
  padding: 30px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  [data-theme="dark"] & {
    background-color: var(--color-6);
  }
}
.insurance__modal-ovn-dashboard-title,
.insurance__modal-ovn-dashboard-balance-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.insurance__modal-ovn-dashboard-balance-info p {
  color: var(--color-1);
  font-weight: 600;
  font-size: 16px;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__modal-ovn-dashboard-title p:nth-child(1) {
  color: var(--color-1);
  font-size: 16px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__modal-ovn-dashboard-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  button {
    box-shadow: none;
    border: none;
    border-radius: 30px;
    background-color: var(--color-5);
    padding: 3px 14px;
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}
.insurance__title-button {
  svg{
    margin-right: 8px;
  }
}
.insurance__redeem-button {
  margin-left: 8px;
}
.insurance__modal-ovn-dashboard-balance-info-icon {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  svg {
    width: 24px;
    height: 24px;
  }
}

.insurance__modal-ovn-dashboard-balance-info-numbers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.insurance__modal-ovn-dashboard-balance-info-ovn,
.insurance__modal-ovn-dashboard-balance-info-ins {
  display: flex;
  flex-direction: row;
  gap: 70px;
  align-items: start;
}

.insurance__modal-ovn-dashboard-profit-loss {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.insurance__modal-ovn-dashboard-profit-loss p:nth-child(1) {
  color: var(--color-1);
  font-size: 16px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__modal-ovn-dashboard-profit-loss-day,
.insurance__modal-ovn-dashboard-profit-loss-all {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.insurance__modal-ovn-dashboard-profit-loss-day p:nth-child(1),
.insurance__modal-ovn-dashboard-profit-loss-all p:nth-child(1){
  color: var(--color-2);
  font-weight: 400;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.insurance__modal-ovn-dashboard-profit-loss-day p:nth-child(2),
.insurance__modal-ovn-dashboard-profit-loss-all p:nth-child(2),
.insurance__modal-ovn-dashboard-profit-loss-day p:nth-child(3),
.insurance__modal-ovn-dashboard-profit-loss-all p:nth-child(3){
  color: var(--color-1);
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.insurance__modal-ovn-dashboard-profit-loss-day p:nth-child(4),
.insurance__modal-ovn-dashboard-profit-loss-all p:nth-child(4) {
  color: var(--color-12);
}

.insurance__modal-ovn-dashboard-trxs {
  margin-bottom: 30px
}
.no-ovn-ins {
  color: var(--color-7) !important;
}

@media (max-width: 768px) {
  .insurance__modal-ovn-dashboard {
    width: 650px;
  }
  .insurance__modal-ovn-dashboard-balance-info-ovn,
  .insurance__modal-ovn-dashboard-balance-info-ins {
    gap: 30px;
  }
}

@media (max-width: 400px) {
  .insurance__modal-ovn-dashboard {
    width: auto;
    padding: 0;
  }
  .insurance__modal-ovn-dashboard-exit {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    margin-bottom: 20px;
    button {
      padding: 0;
      margin-right: 30px;
      background: none;
      box-shadow: none;
      border: none;
      fill: var(--color-1);
      [data-theme="dark"] & {
        fill: var(--color-4);
      }
    }
    color: var(--color-1);
    font-weight: 600;
    font-size: 16px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .insurance__modal-ovn-dashboard-buttons {
    max-width: 360px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    button {
      border-radius: 50%;
      margin: 0;
      padding: 10px;
    }
  }
  .insurance__redeem-button {
    margin: 0;
  }
  .insurance__modal-ovn-dashboard-button {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    p {
      color: var(--color-18);
      font-size: 12px;
    }
  }
  .insurance__modal-ovn-dashboard-button-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .insurance__modal-divider {
    margin-top: 22px;
    margin-bottom: 22px;
  }
  .insurance__modal-ovn-dashboard-balance-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
  }
  .insurance__modal-divider,
  .insurance__modal-ovn-dashboard-balance-info,
  .insurance__modal-ovn-dashboard-profit-loss {
    max-width: 360px;
  }
  .insurance__modal-ovn-dashboard-profit-loss {
    gap: 20px;
  }
   .insurance__modal-ovn-dashboard-balance-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 14px;
    }
  }
  .insurance__modal-ovn-dashboard-balance-info-numbers {
    text-align: right;
  }
  .insurance__modal-ovn-dashboard-balance-info-ovn,
  .insurance__modal-ovn-dashboard-balance-info-ins {
    width: 100%;
    gap: 0;
    justify-content: space-between;
  }
  .insurance__modal-ovn-dashboard-profit-loss-day,
  .insurance__modal-ovn-dashboard-profit-loss-all {
    font-size: 14px;
  }
  .insurance__modal-ovn-dashboard-profit-loss-day-title-mob {
    font-size: 14px !important;
  }
}
</style>
