<template>
  <div class="mintredeem-form">
    <div class="mintredeem-form__tabs">
      <SwitchTabs
        :tabs="mintTabs"
        @tab-change="changeMintTab"
      />
      <h1>You mint</h1>
      <SwitchTabs
        :tabs="wrapTabs"
        @tab-change="changeWrapTab"
      />
    </div>
    <div class="mintredeem-form__inputs">
      <TokenForm
        :token-info="inputToken"
        :is-token-removable="true"
        :select-token-func="selectFormToken"
        :is-input-token="true"
        :update-token-value-func="updateTokenValueMethod"
      />
    </div>

    <SelectTokensModal
      :is-show="showTokensModal"
      :set-show-func="showSelectTokensModals"
      :select-token-input="selectModalTypeInput"
      :add-selected-token-to-list-func="addSelectedTokenToList"
      :remove-selected-token-from-list-func="removeSelectedTokenFromList"
      :tokens="allTokensList"
      :is-all-data-loaded="isAllDataLoaded"
      :is-ovn-swap="true"
    />
  </div>

</template>

<script lang="ts">
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import TokenForm from '@/modules/Main/components/MintRedeem/TokenForm.vue';
import SelectTokensModal from '@/modules/Main/components/MintRedeem/TokensModal/Index.vue';

import { mintStatus, wrapStatus } from '@/modules/Main/components/MintRedeem/types/index.ts';
import {
  getNewInputToken,
} from '@/store/odos/helpers.ts';

export default {
  name: 'MintRedeem',
  components: {
    SwitchTabs,
    TokenForm,
    SelectTokensModal,
  },
  data() {
    return {
      inputToken: getNewInputToken(),
      activeMintTab: 0,
      activeWrapTab: 0,
      showTokensModal: false,
      selectModalTypeInput: true,
      allTokensList: [],
      isAllDataLoaded: false,

      mintTabs: [
        {
          id: mintStatus.MINT,
          name: 'MINT',
        },
        {
          id: mintStatus.REDEEM,
          name: 'REDEEM',
        },
      ],
      wrapTabs: [
        {
          id: wrapStatus.WRAP,
          name: 'WRAP',
        },
        {
          id: wrapStatus.UNWRAP,
          name: 'UNWRAP',
        },
      ],
    };
  },
  methods: {
    removeSelectedTokenFromList() {
      console.log('removeSelectedTokenFromList');
    },
    addSelectedTokenToList() {
      console.log('addSelectedTokenToList');
    },
    showSelectTokensModals() {
      this.showTokensModal = false;
    },
    selectFormToken(isInput: boolean) {
      this.showTokensModal = true;
      this.selectModalTypeInput = isInput;
    },
    updateTokenValueMethod(token: any) {
      this.inputToken = token;
    },
    changeWrapTab(id: number) {
      this.activeWrapTab = id;
    },
    changeMintTab(id: number) {
      this.activeMintTab = id;
    },
  },
};
</script>

<style lang="scss" scoped>
.mintredeem-form {
  width: 100%;
  height: 100%;
}
.mintredeem-form__tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: auto;
}

.mintredeem-form__inputs {
  margin-top: 16px;
}
</style>
