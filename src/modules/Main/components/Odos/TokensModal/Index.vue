<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div
      class="tokens-modal"
    >
      <div
        class="tokens-modal__header"
      >
        <div v-if="isOvnSwap">
          <h1
            v-if="selectTokenInput"
          >
            Select Input token
          </h1>
          <h1
            v-else
          >
            Select Output token
          </h1>
        </div>
        <div v-else>
          <h1>
            All tokens
          </h1>
        </div>
      </div>

      <div class="tokens-container">
        <div
          v-if="!isAllDataLoaded"
          class="token-select__spinner"
        >
          <Spinner size="40px" />
        </div>

        <div v-else>
          <SelectTokenWithSearch
            :tokens="tokens"
            :select-token-func="selectToken"
            :remove-token-func="removeToken"
          />
        </div>
      </div>

    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectTokenWithSearch from '@/modules/Main/components/Odos/TokensModal/SelectTokenWithSearch.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import Spinner from '@/components/Spinner/Index.vue';

export default defineComponent({
  name: 'SelectTokensModal',
  components: {
    SelectTokenWithSearch,
    ModalComponent,
    Spinner,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    setShowFunc: {
      type: Function,
      required: true,
    },

    swapMethod: {
      type: String,
      required: true,
    },
    selectTokenInput: {
      type: Boolean,
      required: true,
    },

    removeSelectedTokenFromListFunc: {
      type: Function,
      required: true,
    },

    addSelectedTokenToListFunc: {
      type: Function,
      required: true,
    },

    secondTokens: {
      type: Array,
      required: true,
    },

    tokens: {
      type: Array,
      required: true,
    },

    isAllDataLoaded: {
      type: Boolean,
      required: true,
    },

    isOvnSwap: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectedTokensFromAddresses: [] as any[],
      selectedTokensToAddresses: [] as any[],
      showModal: false,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  methods: {
    closeModal() {
      console.log('closeModal');
      this.setShowFunc(false);
    },
    selectToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      console.log('Token select: ', token, this.selectTokenInput);
      this.addSelectedTokenToListFunc({
        ...token,
        selected: true,
      }, this.selectTokenInput);
    },
    removeToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      token.selected = false;
      console.log('Token remove: ', token, this.selectTokenInput);
      this.removeSelectedTokenFromListFunc(token, this.selectTokenInput);
    },
  },
});
</script>

<style lang="scss" scoped>
.tokens-modal {
  min-width: 500px;
  max-width: 500px;
}

.tokens-modal__header {
  padding: 15px 30px;

  h1 {
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      color: var(--color-1);
  }
}
.token-select__spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  border: 2px solid var(--color-5);
  background-color: var(--color-4);
}
</style>
