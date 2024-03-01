<template>
  <div class="insurance__info">
    <BaseIcon
      :name="tokenData.insImage"
      class="insurance__token-image"
    />
    <div class="insurance__token-title">
      <div class="insurance__title-token-info">
        <p class="insurance__token-data-title insurance__token-data-title--token">INSURANCE</p>
        <div class="insurance__links-info">
          <a
            :href="`${networkScan}token/` + generateHref('token_insurance', networkName)"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="token-address"
            class="insurance__token-data-link-addr link-ovn"
          >Token address</a>
          <a
            href="https://docs.overnight.fi/governance/ovn-token"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="token-address"
            class="insurance__token-data-ovn-info link-ovn"
          >What is ovn</a>
        </div>
      </div>

      <div class="insurance__title-buttons">
        <div class="insurance__interact-buttons">
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

          <ButtonComponent class="insurance__title-button">
            <BaseIcon
              name='InsuranceBridge'
            />
            BRIDGE
          </ButtonComponent>
          <ButtonComponent class="insurance__title-button">
            <BaseIcon
              name='InsuranceOVN'
            />
            OVN DASHBOARD
          </ButtonComponent>
        </div>
        <ButtonComponent
          class="insurance__title-button"
          :class="{ about_selected: showInsuranceInfo }"
          @click="toggleInsuranceAbout()"
          @keydown.enter="toggleInsuranceAbout()"
        >
          <BaseIcon
            name='InsuranceAbout'
          />
          ABOUT INSURANCE
        </ButtonComponent>
      </div>
    </div>

  </div>
  <div
    class="insurance__about"
    v-if="showInsuranceInfo"
  >
    <InsuranceAbout />
  </div>
  <div class="insurance__token-data">
    <div class="insurance__divider insurance__divider--first-divider" />
    <div class="insurance__payout-data">
      <p class="insurance__token-data-title">Risk factor</p>
      <div class="insurance_risk-factor">
        <p class="insurance_risk-factor-text">High</p>
        <BaseIcon
          name='InsuranceRiskFactor'
        />
      </div>
    </div>
    <div class="insurance__divider" />
    <div class="insurance__payout-data">
      <p class="insurance__token-data-title">Last payout</p>
      <p class="insurance__token-data-num">{{ tokenData.lastPayoutTime }}</p>
      <p class="insurance__token-data-h">{{ tokenData.lastPayoutType }}</p>
    </div>
    <div class="insurance__divider" />
    <div class="insurance__payout-data">
      <p class="insurance__token-data-title">Insurance vault</p>
      <p class="insurance__token-data-num amount-of-ovn">{{ formatTVL(tokenData.data.supply.toFixed(2)) }} OVN</p>
      <BaseIcon
        name='InsuranceOVNVault'
      />
    </div>
    <div class="insurance__divider" />
    <div class="insurance__payout-data">
      <p class="insurance__token-data-title">Value of vault</p>
      <p class="insurance__token-data-num amount-of-ovn">${{ formatTVL(tokenData.data.supplyUSD.toFixed(2)) }}</p>
    </div>
    <div class="insurance__divider" />
    <div class="insurance__payout-data">
      <p class="insurance__token-data-title">Insurance coverage</p>
      <p class="insurance__token-data-num amount-of-ovn">{{ tokenData.data.coverage.toFixed(2) }}%</p>
    </div>
    <div class="insurance__divider" />
    <div class="performance__apy-data">
      <p class="insurance__token-data-title">30-day APY</p>
      <div class="insurance__apy-data-chain">
        <p class="insurance__token-data-num insurance__token-data-num--apy-num">{{ tokenData.data.apyMonth.toFixed(2) }}%</p>
        <div
          class="insurance__icon-chain"
        >
          <BaseIcon
            :name="networkName.toLocaleLowerCase()"
          />
        </div>

      </div>
    </div>
    <div class="insurance__divider insurance__divider--last-divider" />

    <MintRedeemModal
      v-model="showModalMintRedeem"
    />
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import InsuranceAbout from '@/modules/Insurance/InsuranceAbout.vue';
import MintRedeemModal from '@/modules/Insurance/MintRedeemModal.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';

export default {
  name: 'TokenDataInsurance',
  components: {
    BaseIcon,
    ButtonComponent,
    InsuranceAbout,
    MintRedeemModal,
  },
  data() {
    return {
      showInsuranceInfo: false,
      showModalMintRedeem: false,
    };
  },
  props: {
    tokenData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    networkName() {
      return this.$store.state.network.insuranceNetwork;
    },
    networkScan() {
      return this.$store.state.network.insuranceExplorerURL;
    },
  },
  methods: {
    toggleModalMintRedeem() {
      this.showModalMintRedeem = !this.showModalMintRedeem;
    },
    toggleInsuranceAbout() {
      this.showInsuranceInfo = !this.showInsuranceInfo;
    },
    generateHref(tokenName: string, networkName: string) {
      const networkContracts = (chainContractsMap as any)[networkName.toLowerCase()];
      const tokenInsurance = networkContracts[tokenName];
      return tokenInsurance;
    },

    formatTVL(number: any) {
      return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 })
        .format(number);
    },
  },
};
</script>

<style lang="scss" scoped>

.insurance__info {
  display:flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 18px;
}
.insurance__token-image {
  width: 76px;
}

.insurance__links-info {
  margin-top: 10px;
}

.insurance__title-token-info {
  display: flex;
  flex-direction: column;
}

.insurance__title-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  svg {
    margin-right: 8px;
  }
  svg:not(.insurance__mint-button) {
    fill: var(--color-1);
  }

  .insurance__mint-button svg {
    stroke: var(--color-1);
  }

}

.amount-of-ovn {
  margin-bottom: 5px;
}
.insurance__redeem-button {
  margin-left: 8px;
}

.insurance__interact-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10px;
  gap: 10px;
}

.insurance__title-button {
  background-color: var(--color-5);
  color: var(--color-1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  border: none;
  border-radius: 30px;
  padding: 5px 14px;
}
.about_selected {
  border: 1px solid var(--color-1);
  [data-theme="dark"] & {
    border-color: var(--color-4);
  }
}
.insurance_risk-factor-text {
  color: var(--color-1);
  font-size: 20px;
  font-weight: 500;
  margin-right: 10px  ;
}
.insurance_risk-factor {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
}

.insurance__token-data {
  max-height: 84px;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  background: var(--color-4);
  width: 100%;
  [data-theme="dark"] & {
    background: var(--color-6);
  }
}

.performance__icon-token {
  width: 90px;
  height: 90px;
}
.insurance__token-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
  margin-left: 10px;
}
.insurance__token-data-title {
  text-align: left;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.insurance__token-data-title--token {
  color: var(--color-1);
  font-size: 20px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__token-data-link-addr,
.insurance__token-data-ovn-info {
  margin-right: 10px;
  color: var(--color-2);
  font-size: 12px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.insurance__token-data__description {
  margin-left: 30px;
  color: var(--color-2);
  text-align: justify;
  font-size: 12px;
  font-weight: 400;
  max-width: 186px;
  line-height: 1.1;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.insurance__divider {
  margin-left: 30px;
  margin-right: 30px;
  border: 1px solid var(--color-7);
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.insurance__divider--last-divider {
  margin-right: 0;
}
.insurance__divider--first-divider {
  margin-left: 0;
}

.insurance__payout-data,
.performance__apy-data,
.performance__tvl-data {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.insurance__token-data-num,
.insurance__token-data-col-token {
  color: var(--color-1);
  font-size: 20px;
  font-weight: 500;
}

.insurance__token-data-num {
  margin-top: 20px;
  text-align: center;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__token-data-num--apy-num {
  margin-top: 0px;
}
.insurance__apy-data-chain {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.insurance__icon-chain {
  margin-top: 8px;
  svg {
    width: 24px;
    height: 24px;
  }
}

.insurance__token-data-h {
  color: var(--color-1);
  font-size: 15px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.performance__chain-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 30px;
  border: 1px solid var(--color-6);
  background: var(--color-5);
  padding: 5px 10px;
  margin-top: 24px;
  width: fit-content;
  transition: background 0.3s ease, border 0.3s ease;
}
.selected {
  background: var(--color-4);
  [data-theme="dark"] & {
    background: var(--color-2);
  }
}

.performance__chain-data-container .selected:hover {
  background: var(--color-4);
  cursor: default;
  [data-theme="dark"] & {
    background: var(--color-2);
  }
}

.performance__chain-data:hover {
  cursor: pointer;
  border: 1px solid var(--color-7);
  background: var(--color-6);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
    background: var(--color-7);
  }
}

.performance__chain-data-name {
  margin-left: 8px;
  font-weight: 500;
  font-size: 13px;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.insurance__icon-chain-bottom {
  flex-shrink: 0
}

.performance__chain-data-container {
  display: flex;
  flex-direction: row;
}

.performance__chain-data-container > *:not(:last-child) {
  margin-right: 7px;
}

@media (max-width: 1024px) {
  .performance__chain-data {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 30px;
    border: 1px solid var(--color-6);
    background: var(--color-5);
    padding: 2px 5px;
    margin-top: 24px;
  }
  .insurance__token-data-title {
    text-align: center;
  }
  .insurance__token-image {
    scale: 65%;
  }
  .insurance__token-data-col-token {
    margin-left: 2px;
  }
  .insurance__token-data__description {
    margin-left: 5px;
    max-width: 150px;
  }
  .insurance__token-title {
    margin-left: 5px;
  }

  .insurance__token-data-title {
      font-size: 16px;
  }
  .insurance__token-data-num {
    font-size: 14px;
  }
  .insurance__token-data-h {
    font-size: 12px;
  }
  .insurance__divider {
    margin-left: 5px;
    margin-right: 5px;
  }
}

@media (max-width: 768px) {
  .insurance__divider {
    margin-left: 20px;
    margin-right: 20px;
  }
  .insurance__token-data-col-token {
    margin: 0;
  }
  .insurance__token-data-link-addr {
    margin-top: 40px;
  }
  .performance__chain-data {
    padding: 2px 5px;
    margin-top: 20px;
  }

  .performance__chain-data-name {
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .insurance__token-data-num {
    margin-top: 60px;
  }
  .insurance__apy-data-chain {
    margin: 0;
  }
  .insurance__icon-chain {
    margin-top: 60px;
  }
  .insurance__divider {
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>
