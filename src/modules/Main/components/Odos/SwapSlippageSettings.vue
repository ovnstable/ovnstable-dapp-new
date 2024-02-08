<template>
  <div class="slippage-block">
    <h3>
      Slippage Tolerance
    </h3>
    <TransitionGroup
      name="staggered-fade"
      tag="div"
      class="slippage-block__list"
      :css="false"
      @before-enter="beforeEnterList"
      @enter="onEnterList"
      @onLeave="onLeaveList"
      appear
    >
      <template
        v-if="showList"
      >
        <div
          v-for="(setting, key) in slippageSettings"
          :key="slippageSettings.length - key"
          class="slippage-block__item"
          :class="currentSlippage && currentSlippage.type === setting.type ? 'slippage-block__item--selected' : ''"
          :data-index="slippageSettings.length - key"
          @click="newSlippageSetting(setting)"
          @keydown="newSlippageSetting(setting)"
        >
          {{setting.value}}%
        </div>
      </template>

      <div
        v-else
        class="slippage-block__item"
        @click="showList = true"
        @keypress="showList = true"
      >
        {{ currentSlippage.value }}%
        <BaseIcon name="CommonSettings" />
      </div>
    </TransitionGroup>
  </div>
</template>
<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { onLeaveList, onEnterList, beforeEnterList } from '@/utils/animations.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default defineComponent({
  name: 'SwapSlippageSettings',
  components: {
    BaseIcon,
  },
  props: {
    currentSlippageChanged: {
      type: Function,
      required: true,
    },
    selectedInputTokens: {
      type: Array,
      required: true,
    },
    selectedOutputTokens: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentSlippage: {} as any,
      showList: false,
      slippageSettings: [
        {
          id: 4, type: 'AUTO', name: 'Auto', value: 0.1, info: 'Automatic selection by current tokens',
        },
        {
          id: 2, type: 'LOW', name: 'Low', value: 0.05, info: 'For stablecoins only',
        },
        {
          id: 3, type: 'MEDIUM', name: 'Medium', value: 0.5, info: 'For mix of stablecoins and volatile assets',
        },
        {
          id: 1, type: 'HIGH', name: 'High', value: 1, info: 'For volatile assets',
        },
      ],
    };
  },
  mounted() {
    // auto
    this.autoUpdateSlippage();
  },
  computed: {
    ...mapGetters('theme', ['light']),

    isAnyNonStablecoinSelected() {
      return this.selectedInputTokens.some((token: any) => token.selectedToken.assetType !== 'usd')
                || this.selectedOutputTokens.some((token: any) => token.selectedToken.assetType !== 'usd');
    },

  },
  watch: {
    isAnyNonStablecoinSelected: {
      handler() {
        this.autoUpdateSlippage();
      },
      immediate: true,
    },
  },
  methods: {
    newSlippageSetting(setting: any) {
      this.currentSlippage = setting;
      this.showList = false;
      // Emit an event when currentSlippage changes
      this.currentSlippageChanged(this.currentSlippage);
    },
    // method get setting by id
    getSlippageSettingById(id: any) {
      return this.slippageSettings.find((setting) => setting.id === id);
    },
    autoUpdateSlippage() {
      if (this.isAnyNonStablecoinSelected) {
        const updatedValue: any = this.getSlippageSettingById(3);
        const auto: any = this.getSlippageSettingById(4);
        auto.value = updatedValue.value;
        this.newSlippageSetting(auto);
        return;
      }

      const auto: any = this.getSlippageSettingById(4);
      auto.value = 0.1;
      this.newSlippageSetting(auto);
    },
    onLeaveList,
    beforeEnterList,
    onEnterList,
  },
});
</script>

<style lang="scss" scoped>
.slippage-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;

  h3 {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-3);
    }
  }
}

.slippage-block__list {
  display: flex;
  gap: 6px;
}
.slippage-block__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  min-width: 80px;
  color: var(--color-2);
  background-color: var(--color-5);
  border-radius: 30px;
  cursor: pointer;
  transition: background-color .2s ease,
  color .2s ease,
  box-shadow .1s ease,
  opacity .2s ease,
  transform .3s ease;

  [data-theme="dark"] & {
    color: var(--color-4);
    background-color: var(--color-6);
  }

  &:hover {
    background-color: var(--color-6);
    color: var(--color-1);
    [data-theme="dark"] & {
      background-color: var(--color-4);
      color: var(--color-17);
      svg {
        fill: var(--color-17);
      }
    }
  }

  svg {
    width: 16px;
    height: 16px;
    fill: var(--color-2);
    margin-left: 10px;
    [data-theme="dark"] & {
      fill: var(--color-4);
    }
  }
}

.slippage-block__item--selected {
  box-shadow: 0 0 0px 2px var(--color-3);
}
</style>
