<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div class="switchtabs">
    <div class="switchtabs__inner">
      <div
        v-for="item in tabs"
        class="switchtabs__inner-text"
        :class="{ active: item.id === activeItem, [type]: !!type }"
        :key="item.id"
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

export default {
  name: 'TabsComponent',

  props: {
    tabs: {
      default: () => [],
      type: Array as PropType<ITab[]>,
    },
    type: {
      default: 'default',
      type: String as PropType<TSize>,
    },
  },

  data() {
    return {
      activeItem: 0,
      uid: '',
    };
  },
  computed: {
    parentId() {
      return `tabs-${this.uid}`;
    },
    visibleId() {
      return `tabs-list-${this.uid}`;
    },
    hiddenId() {
      return `tabs-hidden-${this.uid}`;
    },
  },

  created() {
    // this.tabs-header__ul = this.$children;
    this.uid = uniqueId();
  },

  mounted() {
    if (this.tabs.length) {
      this.activeItem = this.tabs[0].id;
      this.onTabClick(this.activeItem);
    }
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
  display: flex;
  color: var(--color-2);
  border: 1px solid var(--color-6);
  background: var(--color-5);
  border-radius: 30px;
  [data-theme="dark"] & {
    color: var(--color-3);
    background: var(--color-6);
  }
}

.switchtabs__inner-text {
  position: relative;
  white-space: nowrap;
  border-radius: 30px;
  padding: 4px 20px;
  cursor: pointer;
  background: var(--color-5);
  z-index: 2;
  transition: opacity .2s ease, color .2s ease;
  [data-theme="dark"] & {
    background-color: var(--color-6);
  }
  &.large {
    padding: 9px 20px;
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
  &::before {
    transform: translateX(0);
    visibility: visible;
    opacity: 1;
    z-index: -2;
  }
}
</style>
