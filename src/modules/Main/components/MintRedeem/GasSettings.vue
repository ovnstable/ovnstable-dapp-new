<template>
  <div class="gas-block">
    <h3>
      Gas settings
    </h3>
    <TransitionGroup
      name="staggered-fade"
      tag="div"
      class="gas-block__list"
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
          v-for="(gasData, key) in gasTypes"
          class="gas-block__item"
          :class="currentType === gasData.id ? 'gas-block__item--selected' : ''"
          :key="gasTypes.length - key"
          :data-index="gasTypes.length - key"
          @click="newSlippageSetting(gasData)"
          @keydown="newSlippageSetting(gasData)"
        >
          {{gasData.text + " " + gasData.value}} Gwei
        </div>
      </template>

      <div
        v-else-if="activeItemData"
        class="gas-block__item"
        @click="showList = true"
        @keypress="showList = true"
      >
        {{ activeItemData.text + " " + activeItemData.value }} Gwei
        <BaseIcon name="CommonSettings" />
      </div>
    </TransitionGroup>
  </div>
</template>
<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { onLeaveList, onEnterList, beforeEnterList } from '@/utils/animations.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'GasSettings',
  components: {
    BaseIcon,
  },
  data() {
    return {
      showList: false,
      currentType: 1,
      gasTypes: [
        {
          id: 0, value: 0.1, text: 'Low',
        },
        {
          id: 1, value: 0.1, text: 'Standard',
        },
        {
          id: 2, value: 0.1, text: 'Fast',
        },
      ],
    };
  },
  computed: {
    activeItemData() {
      return this.gasTypes.find((_) => _.id === this.currentType);
    },
  },
  methods: {
    newSlippageSetting(setting: typeof this.gasTypes[0]) {
      this.currentType = setting.id;
      this.showList = false;
      // Emit an event when currentGas changes
      this.$emit('gas-changed', setting);
    },
    onLeaveList,
    beforeEnterList,
    onEnterList,
  },
};
</script>

<style lang="scss" scoped>
.gas-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;

  h3 {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}

.gas-block__list {
  display: flex;
  gap: 6px;
}
.gas-block__item {
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
    background-color: var(--color-7);
  }

  &:hover {
    background-color: var(--color-6);
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-17);
      background-color: var(--color-4);
    }
    svg {
      [data-theme="dark"] & {
        fill: var(--color-17);
      }
    }
  }

  svg {
    width: 16px;
    height: 16px;
    fill: var(--color-1);
    margin-left: 10px;
  }
}

.gas-block__item--selected {
  box-shadow: 0 0 0px 2px var(--color-3);
}
</style>
