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
            v-if="selectTokenType === 'OVERNIGHT'"
          >
            Select Overnight tokens
            <span v-if="selectedTokenCount">({{selectedTokenCount}}/{{maxTokenCount}})</span>
          </h1>
          <h1
            v-else
          >
            All tokens
            <span v-if="selectedTokenCount">({{selectedTokenCount}}/{{maxTokenCount}})</span>
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
          class="pt-7 pb-7 cards-list-container"
        >
          <div class="row">
            <div
              align="center"
              justify="center"
            >
              ...loading
            </div>
          </div>
        </div>

        <div v-else>
          <div v-if="selectTokenType === 'OVERNIGHT'">
            <SelectTokenShort
              :tokens="secondTokens"
              :select-token-func="selectToken"
              :remove-token-func="removeToken"
            />
          </div>
          <div v-else-if="selectTokenType === 'ALL'">
            <SelectTokenWithSearch
              :tokens="tokens"
              :select-token-func="selectToken"
              :remove-token-func="removeToken"
            />
          </div>
          <div v-else>
            select token component not found by type: {{selectTokenType}}
          </div>
        </div>
      </div>

    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectTokenShort from '@/modules/main/components/odos/TokensModal/SelectTokenShort.vue';
import SelectTokenWithSearch from '@/modules/main/components/odos/TokensModal/SelectTokenWithSearch.vue';
import ModalComponent from '@/components/Modal/Index.vue';

export default defineComponent({
  name: 'SelectTokensModal',
  components: {
    SelectTokenWithSearch,
    SelectTokenShort,
    ModalComponent,
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
    selectTokenType: {
      type: String,
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

    selectedTokenCount: {
      type: Number,
      required: true,
    },

    maxTokenCount: {
      type: Number,
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
      console.log(currVal, '-currVal');
      this.showModal = currVal;
    },
  },
  computed: {
    selectedFromTokens() {
      return this.fromTokens && this.selectedTokensFromAddresses
        ? this.fromTokens
          .filter((item: any) => this.selectedTokensFromAddresses.includes(item.address)) : [];
    },
    selectedToTokens() {
      return this.toTokens && this.selectedTokensToAddresses
        ? this.toTokens
          .filter((item: any) => this.selectedTokensToAddresses.includes(item.address)) : [];
    },

    toTokens() {
      if (this.swapMethod === 'BUY') {
        return this.secondTokens;
      } if (this.swapMethod === 'SELL') {
        return this.tokens;
      }
      console.error('Odos Swap method not found.', this.swapMethod);
      return [];
    },
    fromTokens() {
      if (this.swapMethod === 'BUY') {
        return this.tokens;
      } if (this.swapMethod === 'SELL') {
        return this.secondTokens;
      }
      console.error('Odos Swap method not found.', this.swapMethod);
      return [];
    },
  },
  methods: {
    closeModal() {
      console.log('closeModal');
      this.setShowFunc(false);
    },
    selectToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      console.log('Token select: ', token, this.swapMethod, this.selectTokenType);
      this.addSelectedTokenToListFunc({
        ...token,
        selected: true,
      }, this.swapMethod, this.selectTokenType);
    },
    removeToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      token.selected = false;
      console.log('Token remove: ', token, this.swapMethod, this.selectTokenType);
      this.removeSelectedTokenFromListFunc(token, this.swapMethod, this.selectTokenType);
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

</style>
