<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div class="insurance__modal-mint-redeem">
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
      <p class="insurance__modal-mint-redeem-mint-text">You mint</p>
      <div class="insurance__modal-input-group">
        <div class="insurance__modal-input">
          <div class="insurance__modal-input-ovn">
            <input
              type="number"
              v-model="ovnAmount"
              placeholder="0"
            />
            <p>icon of ovn</p>
          </div>
          <div class="insurance__modal-input-ovn-balances">
            <p>$0</p>
            <p>Balance: 0</p>
          </div>
        </div>
        <p> slider</p>

        <div>
          <p>{{ ovnAmount }} OVN = {{ ovnAmount }} OVN INS</p>
        </div>

      </div>
      <div>
        <div>
          <p>Overight fee:</p>
          <p>0.0%</p>
        </div>
        <div>
          <p>You mint:</p>
          <p>0$</p>
        </div>
        <p>1 OVN = 1 OVN INS</p>
      </div>
      <GasSettings />
      <p>Enter amount to mint</p>
      <div>
        <p>Start</p>
        <p>Approve</p>
        <p>Confirmation</p>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonComponent from '@/components/Button/Index.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import GasSettings from '@/modules/Main/components/MintRedeem/GasSettings.vue';

export default defineComponent({
  name: 'MintRedeemModal',
  components: {
    ModalComponent,
    GasSettings,
    ButtonComponent,
  },
  data() {
    return {
      showModal: false,
      ovnAmount: 0,
      selectedAction: 'mint',
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.insurance__modal-mint-redeem {
  width: 560px;
  padding: 20px;
  display: flex;
  flex-direction: column;
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
  }
}

.insurance__modal-mint-redeem-mint-text {
  text-align: center;
  margin-top: 24px;
  margin-bottom: 28px;
}
.insurance__modal-input-group * {
  width: 100%;
}
.insurance__modal-input-ovn {
  display: flex;
  flex-direction: row;
  p {
    width: 10%;
  }
}
.insurance__modal-input-ovn-balances {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  :nth-child(2) {
    text-align: right;
  }
}
</style>
