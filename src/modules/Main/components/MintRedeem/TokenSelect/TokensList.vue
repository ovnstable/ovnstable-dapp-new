<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="select-tokens">
    <div
      class="select-tokens__list"
      ref="listBlock"
    >
      <div
        v-for="token in (tokens as any)"
        class="select-tokens__list-item"
        :class="token.symbol === selectedToken ? 'select-tokens__list-item--selected' : ''"
        :key="token.id"
        @click="toggleToken(token)"
        @keydown="toggleToken(token)"
      >
        <div class="select-tokens__list-item__left">
          <img
            :src="token.logoUrl"
            :alt="token.symbol"
          >
          <div class="select-tokens__list-item__left-text">
            {{token.symbol}}
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
import { onClickOutside, templateRef } from '@vueuse/core';

export default defineComponent({
  name: 'SelectTokens',

  props: {
    tokens: {
      type: Array,
      required: true,
    },
    isInputToken: {
      type: Boolean,
      required: true,
    },
    selectedToken: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      maxTokenSelectCount: 6,
      searchQuery: '',
    };
  },
  computed: {
    ...mapGetters('theme', ['light']),
  },
  mounted() {
    this.initClickOutside();
  },
  methods: {
    initClickOutside() {
      const target: any = templateRef('listBlock');
      onClickOutside(target, () => this.$emit('close-select'));
    },
    toggleToken(token: any) {
      if (!token.selected) {
        this.$emit('select-token', token);
        return;
      }

      this.$emit('remove-token', token);
    },
    clearSearchQuery() {
      this.searchQuery = '';
    },
  },
});
</script>

<style lang="scss" scoped>
.select-tokens {
  position: relative;
  width: 100%;
  height: 100%;
}

.select-tokens__list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  border: 2px solid var(--color-5);
  background-color: var(--color-4);
  padding: 10px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
    background-color: var(--color-6);
  }
}

.select-tokens__clear {
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

.select-tokens__list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 30px;
  padding: 5px 6px;
  background-color: var(--color-5);
  cursor: pointer;
  transition: background-color .1s ease;

  [data-theme="dark"] & {
    background-color: var(--color-17);
    color: var(--color-4)
  }

  &:hover {
    background-color: var(--color-6);
    [data-theme="dark"] & {
      background-color: var(--color-4);
      .select-tokens__list-item__left-text {
        color: var(--color-17);
      }
    }
  }
}

.select-tokens__list-item--selected {
  background-color: var(--color-6);
}

.select-tokens__list-item__left {
  display: flex;
  align-items: center;

  img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    margin-right: 8px;
  }
}

.select-tokens__list-item__left-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
</style>
