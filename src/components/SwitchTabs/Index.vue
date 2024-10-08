<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div class="switchtabs">
    <div
      class="switchtabs__inner"
      :class="{ [tabStyle]: !!tabStyle }"
    >
      <div
        v-for="item in tabs"
        :key="item.id"
        class="switchtabs__inner-text"
        :class="{ active: item.id === activeItem, [type]: !!type }"
        @click.prevent="onTabClick(item.id)"
      >
        <span>
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import uniqueId from 'lodash/uniqueId';
import type { PropType } from 'vue';

interface ITab {
  id: number;
  name: string;
}

type TSize = 'default' | 'large'
type TStyle = 'default' | 'transparent' | 'white' | 'bigWhite'

export default {
  name: 'TabsComponent',
  props: {
    tabs: {
      default: () => [],
      type: Array as PropType<ITab[]>,
    },
    tabStyle: {
      default: 'default',
      type: String as PropType<TStyle>,
    },
    type: {
      default: 'default',
      type: String as PropType<TSize>,
    },
    activeTab: {
      default: -1,
      type: Number,
    },
  },
  emits: ['tab-change'],

  data() {
    return {
      activeItem: -1,
      uid: '',
    };
  },
  watch: {
    activeTab(val) {
      this.activeItem = val;
    },
  },
  created() {
    // this.tabs-header__ul = this.$children;
    this.uid = uniqueId();
  },

  mounted() {
    this.activeItem = this.activeTab;
  },

  methods: {
    onTabClick(itemId: any) {
      this.tabs.forEach((component: any) => {
        // eslint-disable-next-line no-param-reassign
        component.isActive = component.id === itemId;
      });

      this.activeItem = itemId;
      this.$emit('tab-change', itemId);
    },
  },
};
</script>

<style lang="scss" scoped>
.switchtabs {
  display: flex;
}

.switchtabs__inner {
  font-size: 15px;
  font-weight: 500;
  display: flex;
  color: var(--color-2);
  border: 1px solid var(--color-6);
  background: var(--color-5);
  border-radius: 30px;

  &.bigWhite {
    border: unset;
    gap: 8px;
  }

  &.white {
    background: var(--color-4);
  }

  [data-theme="dark"] & {
    color: var(--color-18);
    background: var(--color-6);
    &.white {
    background: var(--color-6);
  }
  }

  &.transparent {
    background: transparent;
  }
}

.switchtabs__inner-text {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  position: relative;
  white-space: nowrap;
  border-radius: 30px;
  padding: 12px;
  cursor: pointer;
  background: var(--color-5);
  z-index: 2;
  text-transform: uppercase;
  transition: opacity .2s ease, color .2s ease;

  .white & {
    background: var(--color-4);
  }

  .bigWhite & {
    background: var(--color-8);
    color: var(--color-1);
    [data-theme="dark"] & {
    background: var(--color-19);
    }
  }

  [data-theme="dark"] & {
    color: var(--color-18);
    background: var(--color-6);
    &.white {
    background: var(--color-6);
  }
  }
  .transparent & {
    background: transparent;
  }

  &::before {
    content: "";
    position: absolute;
    z-index: -5;
    width: 100%;
    height: 100%;
    background-color: var(--color-6);
    border: 1px solid var(--color-1);
    color: var(--color-1);
    border-radius: 30px;
    top: 0;
    left: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-7px);
    transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.87, -0.65, 0.09, 0.91) .1s, visibility 0.2s ease;
    [data-theme="dark"] & {
      border-color: var(--color-2);
    }

    .bigWhite & {
      background-color: var(--color-4);
      [data-theme="dark"] & {
    background: var(--color-19);
    }
    }

  }

  &:hover {
    color: var(--color-3);
    opacity: .7;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }

  &:last-child {
    &::before {
      transform: translateX(7px);
    }
  }
}

.switchtabs__inner-text.active {
  color: var(--color-1);

  .bigWhite & {
    border: 1px solid var(--color-1);
    background: var(--color-4);
    [data-theme="dark"] & {
    background: var(--color-19);
    }
  }

  [data-theme="dark"] & {
    color: var(--color-4);
  }
  &::before {
    transform: translateX(0);
    visibility: visible;
    opacity: 1;
    z-index: -2;
  }
}

@media (max-width: 640px) {
  .switchtabs__inner {
    border: none;
    background: none;
    min-width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .switchtabs__inner-text {
    background: none;
    [data-theme="dark"] & {
      background-color: var(--color-6);
      color: var(--color-4);
    }
  }
  .switchtabs__inner-text:hover {
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .switchtabs__inner-text.active {
    color: var(--color-1);
    text-decoration: underline;
    font-weight: 600;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .switchtabs__inner-text::before {
    background: none;
    border: none;
  }
}
</style>
