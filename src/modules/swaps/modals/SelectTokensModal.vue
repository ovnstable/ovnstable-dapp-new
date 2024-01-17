<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div v-if="isShow">
    <div
      width="570"
      persistent
      @click:outside="setShowFunc(false)"
      @click="setShowFunc(true)"
      @keypress="setShowFunc(true)"
    >
      <div
        class="container_body container-body airdrop-body pt-4 px-4"
        style="border-radius: 28px!important;"
      >
        <div
          class="container_header container-header"
          flat
        >
          <div v-if="isOvnSwap">
            <label
              v-if="selectTokenType === 'OVERNIGHT'"
              class="title-container"
            >
              Select Overnight tokens
              <span v-if="selectedTokenCount">({{selectedTokenCount}}/{{maxTokenCount}})</span>
            </label>
            <label
              v-else
              class="title-container"
            >
              All tokens
              <span v-if="selectedTokenCount">({{selectedTokenCount}}/{{maxTokenCount}})</span>
            </label>
          </div>
          <div v-else>
            <label class="title-container">
              All tokens
            </label>
          </div>

          <button
            icon
            type="button"
            @click="setShowFunc(false)"
          >
            <BaseIcon
              name="SearchClose"
              :class="light ? 'sidebar__icon-social--light' : ''"
            />
          </button>
        </div>

        <div>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import SelectTokenShort from '@/modules/swaps/SelectTokenShort.vue';
import SelectTokenWithSearch from '@/modules/swaps/SelectTokenWithSearch.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default defineComponent({
  name: 'SelectTokensModal',
  components: {
    SelectTokenWithSearch,
    SelectTokenShort,
    BaseIcon,
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
    };
  },
  mounted() {

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
    ...mapGetters('theme', ['light']),
  },
  watch: {

  },
  methods: {

    selectToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      token.selected = true;
      console.log('Token select: ', token, this.swapMethod, this.selectTokenType);
      this.addSelectedTokenToListFunc(token, this.swapMethod, this.selectTokenType);
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

<style scoped>
@media only screen and (max-width: 960px) {
    .title-container {
        font-size: 20px;
        line-height: 40px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-container {
        font-size: 30px;
        line-height: 40px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .title-container {
        font-size: 30px;
        line-height: 40px;
    }
}

@media only screen and (min-width: 1300px) {
    .title-container {
        font-size: 30px;
        line-height: 40px;
    }
}

.tokens-container {
    padding-top: 15px;
    padding-bottom: 15px;
}

.title-container {
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text);
}

.container-body {
    background: var(--secondary)!important;
}

.container-header {
    background: var(--secondary)!important;
}
</style>
