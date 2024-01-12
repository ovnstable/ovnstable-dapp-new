<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div>
    <div class="tokens-container">
      <div class="row">
        <div
          v-for="token in (tokens as any).filter((item: any) => item.selected)"
          :key="token.id"
          @click="toggleToken(token, !token.selected)"
          @keydown="toggleToken(token, !token.selected)"
          class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-6"
        >
          <div
            :class="token.selected ? 'token-container-selected' : ''"
            class="token-container"
          >
            <div class="token-info-container">
              <div class="token-image-container">
                <img
                  :src="token.logoUrl"
                  :alt="token.symbol"
                  class="token-image"
                >
              </div>
              <div class="token-symbol">
                {{token.symbol}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="search-container pt-10">
        <div class="search-input-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or paste address"
            class="input-style"
          />
          <div
            @click="clearSearchQuery()"
            @keydown="clearSearchQuery()"
            class="search-input-close-container"
          >
            <BaseIcon
              path="assets/icons/common/SearchClose.vue"
              class="search-image-close-image"
              :class="light ? 'sidebar__icon-social--light' : ''"
            />
          </div>
        </div>
        <div class="search-items-container">
          <div
            v-for="token in (queryTokens as any)"
            :key="token.id"
            @click="toggleToken(token, !token.selected)"
            @keydown="toggleToken(token, !token.selected)"
          >
            <div
              :class="token.selected ? 'search-token-container-selected' : ''"
              class="search-token-container"
            >
              <div class="row">
                <div class="col-2">
                  <div class="search-image-container">
                    <div class="search-token-image-container">
                      <img
                        :src="token.logoUrl"
                        :alt="token.symbol"
                        class="search-token-image"
                      >
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div>
                    <div>
                      <div class="search-token-symbol">
                        {{token.symbol}}
                      </div>
                    </div>
                    <div>
                      <div class="search-token-symbol-base">
                        {{token.name}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="balance-container">
                    <div>
                      <div class="token-balance">
                        {{token.balanceData.balance ? formatMoney(token.balanceData.balance, fixedByPrice(token.price)) : '0'}}
                      </div>
                    </div>
                    <div>
                      <div class="token-usd-balance">
                        ${{token.balanceData.balance ? formatMoney(token.balanceData.balance * token.price, 2) : '0'}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<!-- eslint-disable vue/no-mutating-props -->
<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { formatMoney, fixedByPrice } from '@/utils/numbers.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default defineComponent({
  name: 'SelectTokenWithSearch',
  components: {
    BaseIcon,
  },

  props: {
    tokens: {
      type: Array,
      required: true,
    },
    selectTokenFunc: {
      type: Function,
      required: true,
    },
    removeTokenFunc: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      maxTokenSelectCount: 6,
      searchQuery: '',
    };
  },
  computed: {
    queryTokens() {
      if (!this.searchQuery) {
        return this.tokens
          .sort((a: any, b: any) => {
            if (b.price * b.balanceData.balance < a.price * a.balanceData.balance) {
              return -1;
            } if (b.price * b.balanceData.balance > a.price * a.balanceData.balance) {
              return 1;
            }
            if (b.balanceData.balance < a.balanceData.balance) {
              return -1;
            } if (b.balanceData.balance > a.balanceData.balance) {
              return 1;
            }
            return 0;
          });
      }

      return this.tokens
        .filter((token: any) => token.name.toLowerCase()
          .includes(this.searchQuery?.toLowerCase())
              || token.symbol.toLowerCase().includes(this.searchQuery.toLowerCase())
              || token.address.toLowerCase().includes(this.searchQuery.toLowerCase()))
        .sort((a: any, b: any) => {
          if (b.price * b.balanceData.balance < a.price * a.balanceData.balance) {
            return -1;
          } if (b.price * b.balanceData.balance > a.price * a.balanceData.balance) {
            return 1;
          }
          if (b.balanceData.balance < a.balanceData.balance) {
            return -1;
          } if (b.balanceData.balance > a.balanceData.balance) {
            return 1;
          }
          return 0;
        });
    },
    isAvailableCountForSelect() {
      return this.selectedCount < this.maxTokenSelectCount;
    },
    selectedCount() {
      return this.tokens.filter((item: any) => item.selected).length;
    },
    ...mapGetters('theme', ['light']),
  },
  methods: {
    formatMoney,
    fixedByPrice,
    toggleToken(token: any, isSelect: any) {
      if (isSelect && this.isAvailableCountForSelect) {
        this.selectTokenFunc(token);
        return;
      }

      this.removeTokenFunc(token);
    },
    clearSearchQuery() {
      this.searchQuery = '';
    },
  },
});
</script>

<style scoped>
@media only screen and (max-width: 960px) {
    .token-symbol {
        font-size: 16px;
        line-height: 22px;

        padding-left: 30px;
        width: 80px;
    }

    .input-style {
        font-size: 16px;
        line-height: 28px;
    }

    .search-token-symbol {
        font-size: 15px;
        line-height: 24px;
    }

    .token-image {
        height: 28px;
        width: 28px;
    }

    .search-token-image {
        height: 32px;
        width: 32px;
    }

    .token-balance {
        font-size: 16px;
        line-height: 24px;
    }

    .token-usd-balance {
        font-size: 15px;
        line-height: 24px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .token-symbol {
        font-size: 18px;
        line-height: 24px;

        padding-left: 35px;
        width: 80px;
    }

    .input-style {
        font-size: 18px;
        line-height: 28px;
    }

    .search-token-symbol {
        font-size: 18px;
        line-height: 24px;
    }

    .token-image {
        height: 32px;
        width: 32px;
    }

    .search-token-image {
        height: 40px;
        width: 40px;
    }

    .token-balance {
        font-size: 20px;
        line-height: 24px;
    }

    .token-usd-balance {
        font-size: 16px;
        line-height: 24px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .token-symbol {
        font-size: 18px;
        line-height: 24px;

        padding-left: 35px;
        width: 80px;
    }

    .input-style {
        font-size: 18px;
        line-height: 28px;
    }

    .search-token-symbol {
        font-size: 18px;
        line-height: 24px;
    }

    .token-image {
        height: 32px;
        width: 32px;
    }

    .search-token-image {
        height: 40px;
        width: 40px;
    }

    .token-balance {
        font-size: 20px;
        line-height: 24px;
    }

    .token-usd-balance {
        font-size: 16px;
        line-height: 24px;
    }
}

@media only screen and (min-width: 1300px) {
    .token-symbol {
        font-size: 18px;
        line-height: 24px;

        padding-left: 35px;
        width: 80px;
    }

    .input-style {
        font-size: 18px;
        line-height: 28px;
    }

    .search-token-symbol {
        font-size: 18px;
        line-height: 24px;
    }

    .token-image {
        height: 32px;
        width: 32px;
    }

    .search-token-image {
        height: 40px;
        width: 40px;
    }

    .token-balance {
        font-size: 20px;
        line-height: 24px;
    }

    .token-usd-balance {
        font-size: 16px;
        line-height: 24px;
    }
}

.token-container {
    height: 56px;
    padding-top: 6px;

    background: var(--card-coin-background);
    border-radius: 12px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
}

.token-container-selected {
    border: 2px solid #1C95E7;
}

.token-info-container {
    text-align: center;
    position: relative;
}

.token-symbol {
    font-style: normal;
    font-weight: 600;
    /* identical to box height, or 120% */

    display: inline-block;

    color: var(--main-gray-text);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.token-image-container {
    display: inline-block;
    position: absolute;
    top: -5px;
    left: 0;
}

.search-token-image-container {
    display: inline-block;
    position: absolute;
    top: 4px;
    left: 14px;
}

.search-items-container {
    padding: 8px;

    height: 370px;

    border: 2px solid var(--theme-toggle-border);
    border-radius: 20px;

    overflow: auto;
    overscroll-behavior: none;
}

.search-input-container {
    position: relative;
    align-items: center;
    padding: 12px 20px;

    height: 52px;

    background: var(--card-info-background);
    border-radius: 12px;
    margin-bottom: 16px;
}

.input-style {
    border:none;
    background: transparent;
    outline: 0;

    width: 100%;

    color: var(--third-gray-text);

    font-weight: 400;
}

.search-token-container {
    align-items: center;
    padding: 12px;
    gap: 12px;

    height: 78px;

    margin-bottom: 4px;

    background: var(--swap-main-banner-background);;
    border-radius: 12px;

    cursor: pointer;
}

.search-token-container-selected {
    background: rgba(28, 149, 231, 0.1);
}

.search-token-symbol {
    font-style: normal;
    font-weight: 600;

    color: var(--main-gray-text);
}

.search-token-symbol-base {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #707A8B;
}

.token-balance {
    font-style: normal;
    font-weight: 600;
    color: var(--main-gray-text);
}

.token-usd-balance {
    font-style: normal;
    font-weight: 400;
    color: #707A8B;
}

.balance-container {
    text-align: end;
}

.search-image-container {
    position: relative;
}

.search-token-image-container {
    display: inline-block;
    position: absolute;
    top: 4px;
    left: 14px;
}

/* mobile */
@media all and (min-width:0px) and (max-width: 650px) {
    .search-token-image-container {
        display: inline-block;
        position: absolute;
        top: 4px;
        left: -6px;
    }
}

/* tablet */
@media only screen and (min-width:650px) and (max-width: 1400px) {
    .search-token-image-container {
        display: inline-block;
        position: absolute;
        top: 4px;
        left: 14px;
    }
}

.search-input-close-container {
    position: absolute;
    right: 15px;
    top: 16px;
    cursor: pointer;
    width: 30px;
    text-align: center
}
</style>
