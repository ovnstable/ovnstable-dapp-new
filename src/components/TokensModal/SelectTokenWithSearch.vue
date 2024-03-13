<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div>
    <div class="selected-tokens">
      <div
        v-for="token in (selectedTokensList as any)"
        :key="token.id"
        class="selected-tokens__item"
        :class="token.selected ? 'token-container-selected' : ''"
        @click="toggleToken(token)"
        @keydown="toggleToken(token)"
      >
        <img
          :src="token.logoUrl"
          :alt="token.symbol"
        >
        <span>
          {{token.symbol}}
        </span>
        <BaseIcon
          name="SearchClose"
        />
      </div>
    </div>

    <div class="search-tokens">
      <div class="search-tokens__input">
        <InputComponent
          :value="searchQuery"
          is-text
          placeholder="Search token by name or paste address"
          full-width
          @input="searchTokens"
        />
      </div>
      <div class="search-tokens__list">
        <div
          v-for="token in (queryTokens as any)"
          class="search-tokens__list-item"
          :class="selectedTokensAddress.includes(token.address) ? 'search-tokens__list-item--selected' : ''"
          :key="token.id"
          @click="toggleToken(token)"
          @keydown="toggleToken(token)"
        >
          <div class="search-tokens__list-item__left">
            <img
              :src="token.logoUrl"
              :alt="token.symbol"
            >
            <div class="search-tokens__list-item__left-text">
              <h3>
                {{token.symbol}}
              </h3>
              <p>
                {{token.name}}
              </p>
            </div>
          </div>
          <div class="search-tokens__list-item__right">
            <span class="token-balance">
              {{token.balanceData.balance ? token.balanceData.balance : '0'}}
            </span>
            <span class="token-usd-balance">
              ${{token.balanceData.balance ? formatMoney(token.balanceData.balanceInUsd, fixedByPrice(token.price)) : '0'}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { formatMoney, fixedByPrice } from '@/utils/numbers.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import InputComponent from '@/components/Input/Index.vue';
import { OVN_TOKENS } from '@/utils/const.ts';

const NATIVE_ID = 'eth0x0000000000000000000000000000000000000000';

export default {
  name: 'SelectTokenWithSearch',
  components: {
    BaseIcon,
    InputComponent,
  },

  props: {
    tokens: {
      type: Array,
      required: true,
    },
    selectedTokens: {
      type: Array,
      required: true,
    },
    removeNative: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      maxTokenSelectCount: 3,
      searchQuery: '',
    };
  },
  computed: {
    selectedTokensList() {
      if (!(this.selectedTokens[0] as any).selectedToken) return [];
      return this.selectedTokens.map((item: any) => item?.selectedToken).filter((_) => _?.selected);
    },
    selectedTokensAddress() {
      if (this.selectedTokensList?.length > 0) return this.selectedTokensList.map((_) => _.address);
      return [];
    },
    queryTokens() {
      let arrList = this.tokens.slice();

      if (this.removeNative) arrList = arrList.filter((_: any) => _.id !== NATIVE_ID);

      if (!this.searchQuery) {
        return arrList
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
          })
          .sort((a: any, b: any) => {
            if (OVN_TOKENS.includes(a.symbol) && !OVN_TOKENS.includes(b.symbol)) {
              return -1;
            }
            if (!OVN_TOKENS.includes(a.symbol) && OVN_TOKENS.includes(b.symbol)) {
              return 1;
            }

            return 0;
          });
      }

      return arrList
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
      return this.selectedTokens.length;
    },
  },
  methods: {
    formatMoney,
    fixedByPrice,
    searchTokens(val: string) {
      this.searchQuery = val;
    },
    toggleToken(token: any) {
      const selected = this.selectedTokensAddress.includes(token.address);
      if (selected) {
        this.$emit('remove-token', token);
        return;
      }

      if (this.isAvailableCountForSelect) {
        console.log('ADDTOKEN');
        this.$emit('add-token', token);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-tokens__list {
  max-height: 50vh;
  min-height: 50vh;
  overflow: auto;
}

.search-tokens__clear {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: transform .3s ease;

  &:hover {
    transform: translateY(-50%) rotate(-90deg);
  }
}

.search-tokens__input {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 0 20px 20px 30px;
}

.search-tokens__list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
  cursor: pointer;
  transition: background-color .1s ease;

  &:hover {
    background-color: var(--color-6);
  }
}

.search-tokens__list-item--selected {
  background-color: var(--color-6);
}

.search-tokens__list-item__left {
  display: flex;
  align-items: center;

  img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    margin-right: 8px;
  }
}

.search-tokens__list-item__left-text {
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-1);
    margin-bottom: 6px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }

  p {
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }

  span {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-1);
  }
}

.search-tokens__list-item__right {
  display: flex;
  flex-direction: column;
  text-align: right;

  & span:first-child {
    margin-bottom: 6px;
  }

  span {
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}

.selected-tokens {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 30px;
  margin-bottom: 20px;
}

.selected-tokens__item {
  display: flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 30px;
  border: 2px solid var(--color-6);

  [data-theme="dark"] & {
    background-color: var(--color-7);
  }

  img {
    width: 24px;
    height: 24px;
  }

  span {
    color: var(--color-1);
    font-size: 16px;
    font-weight: 500;
    margin-left: 8px;
    margin-right: 6px;
  }
}

.selected-tokens__item:hover {
  cursor: pointer;
}
</style>
