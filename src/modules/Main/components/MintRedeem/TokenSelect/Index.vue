<template>
  <div
    class="tokens-select"
  >
    <div
      class="tokens-select__header"
      @click="closeSelect"
      @keypress="closeSelect"
    >
      <h1>
        Choose 1 token to {{activeMint && isInputToken ? "mint" : "redeem"}}
      </h1>
      <div
        class="slider__arrow-wrapper"
      >
        <BaseIcon
          name="ArrowRight"
          class="slider__arrow-icon"
        />
      </div>
    </div>

    <div
      v-if="tokensList?.length === 0"
      class="token-select__spinner"
    >
      <Spinner size="40px" />
    </div>

    <template v-else>
      <TokensList
        :tokens="tokensList"
        :is-input-token="isInputToken"
        :selected-token="selectedToken"
        @select-token="selectToken"
        @remove-token="removeToken"
        @close-select="closeSelect"
      />
    </template>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Spinner from '@/components/Spinner/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import TokensList from '@/modules/Main/components/MintRedeem/TokenSelect/TokensList.vue';

export default defineComponent({
  name: 'TokenSelect',
  components: {
    TokensList,
    BaseIcon,
    Spinner,
  },
  props: {
    tokensList: {
      type: Array,
      default: () => [],
    },
    activeMint: {
      type: Boolean,
      required: true,
      default: false,
    },
    isInputToken: {
      type: Boolean,
      required: true,
      default: false,
    },
    selectedToken: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {
    closeSelect() {
      console.log('closeSelect');
      this.$emit('close-select', false);
    },
    selectToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      this.$emit('add-token', {
        ...token,
        selected: true,
      }, this.isInputToken);
    },
    removeToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      token.selected = false;
      console.log('Token remove: ', token, this.isInputToken);
      this.$emit('remove-token', {
        ...token,
        selected: true,
      }, this.isInputToken);
    },
  },
});
</script>

<style lang="scss" scoped>
.tokens-select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  background-color: var(--color-4);
  border-radius: 10px;
}

.tokens-select__header {
  padding: 15px;
  border: 2px solid var(--color-5);
  border-bottom: 0;

  h1 {
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      color: var(--color-2);
      margin-bottom: 10px;
  }
  cursor: pointer;
  transition: background-color .15s ease;

  &:hover {
    background-color: var(--color-5);
  }
}

.slider__arrow-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 24px;
  height: 24px;
  right: 10px;
  top: 14px;
  color: var(--color-3);
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
