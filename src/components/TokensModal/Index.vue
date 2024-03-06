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
            :selected-tokens="selectedTokens"
            @add-token="selectToken"
            @remove-token="removeToken"
          />
        </div>
      </div>

    </div>
  </ModalComponent>
</template>

<script lang="ts">
import SelectTokenWithSearch from '@//components/TokensModal/SelectTokenWithSearch.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import Spinner from '@/components/Spinner/Index.vue';

export default {
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
    selectTokenInput: {
      type: Boolean,
      required: true,
    },
    selectedTokens: {
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
      this.$emit('set-show', false);
    },
    selectToken(token: any) {
      console.log(token, 'SELECTED');
      // eslint-disable-next-line no-param-reassign
      token.selected = true;
      this.$emit('add-token-to-list', {
        tokenData: {
          ...token,
          selected: true,
        },
        isInput: this.selectTokenInput,
      });
    },
    removeToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      token.selected = false;
      this.$emit('remove-token-from-list', {
        tokenData: {
          ...token,
          selected: false,
        },
        isInput: this.selectTokenInput,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tokens-modal {
  min-width: 500px;
  max-width: 500px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
    background-color: var(--color-17);
  }
}

.tokens-modal__header {
  padding: 15px 30px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
  h1 {
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}
.token-select__spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  border: 2px solid var(--color-5);
  background-color: var(--color-4);
  min-height: 50vh;

  [data-theme="dark"] & {
    border-color: var(--color-2);
    background-color: var(--color-17);
  }
}
</style>
