<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div class="tabs-wrap">
    <div
      :id="parentId"
      class="tabs-header"
    >
      <ul
        :id="visibleId"
        class="tabs-header__ul"
      >
        <li
          v-for="item in tabs"
          :key="`tab-${uid}-${item.id}`"
          :class="{ active: item.id === activeItem }"
          class="tabs-header__ul__li"
        >
          <span>
            <div
              @click.prevent="onTabClick(item.id)"
              class="tabs-header__ul__li-trigger"
            >
              {{ item.name }}
            </div>
          </span>
        </li>
      </ul>
    </div>

    <div class="tabs-item">
      <slot />
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

export default {
  name: 'TabsComponent',

  props: {
    tabs: {
      default: () => [],
      type: Array as PropType<ITab[]>,
    },
    activeTab: {
      type: Number,
      required: false,
      default: 1,
    },
  },

  data() {
    return {
      activeItem: 1,
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

  watch: {
    async tabs(n, o) {
      if (n?.length !== o?.length) {
        await this.$nextTick();
        this.resizeMenu();
      }
    },
  },

  created() {
    // this.tabs-header__ul = this.$children;
    this.uid = uniqueId();
  },

  mounted() {
    if (this.tabs.length && !this.activeTab) {
      this.activeItem = this.tabs[0].id;
      this.onTabClick(this.activeItem);
    } else {
      this.onTabClick(this.activeTab);
    }

    window.addEventListener('resize', this.resizeMenu);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.resizeMenu);
  },

  methods: {
    resizeMenu() {
      const parent = document.getElementById(this.parentId);
      const visibleList: any = document.getElementById(this.visibleId);
      const hiddenList: any = document.getElementById(this.hiddenId);
      const baseOffset = 48;
      let lastWidth = 0;

      if (!parent || !hiddenList) return;

      // eslint-disable-next-line no-unsafe-optional-chaining
      [...visibleList?.children].forEach(() => {
        const toHide = visibleList.children[visibleList.children.length - 1];
        const stillOverflow = parent.offsetWidth
            < visibleList.offsetWidth + toHide.offsetWidth + baseOffset;

        lastWidth = toHide.offsetWidth;
        if (stillOverflow) {
          hiddenList.appendChild(toHide);
        }
      });

      // eslint-disable-next-line no-unsafe-optional-chaining
      [...hiddenList?.children].forEach(() => {
        const toShow = hiddenList.children[hiddenList.children.length - 1];
        const willOverflow = parent.offsetWidth
            < visibleList.offsetWidth + lastWidth + baseOffset;

        if (!willOverflow) {
          visibleList.appendChild(toShow);
        }
      });
    },

    onTabClick(itemId: any) {
      this.tabs.forEach((component: any) => {
        // eslint-disable-next-line no-param-reassign
        component.isActive = component.id === itemId;
      });

      this.activeItem = itemId;
      console.log(itemId, 'this.onTabClick');
      this.$emit('tab-change', itemId);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-header {
  min-height: 51px;
}

.tabs-wrap {
  width: 100%;
  height: 100%;
}

.tabs-item {
  height: calc(100% - 51px);
}
.tabs-header__ul {
  width: 100%;
  display: flex;
  align-items: flex-end;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.tabs-header {
  display: flex;
  border-radius: 20px 20px 0 0;
  position: relative;
}

.tabs-header__ul__li-trigger {
  color: var(--color-1);
  position: relative;
  z-index: 10;
  padding: 10px 0;
}

.tab-content.active {
  display: flex;
}

.tabs-header__ul {
  width: 100%;

  * {
    box-sizing: content-box;
  }
}
.tabs-header__ul li {
  width: 100%;
  position: relative;
}
.tabs-header__ul span {
  /* Make them block level
     and only as wide as they need */
  float: left;
  text-align: center;
  width: 100%;
  text-decoration: none;
  border: 2px solid var(--color-1);
  transition: padding .15s ease .1s,
    border-radius .2s ease, color .2s ease;

  font-size: 14px;
  /* Default colors */
  color: #848D9C;
  background: var(--color-6);
  font-weight: 400;
  text-transform: uppercase;
  cursor: pointer;

  /* Only round the top corners */
  -webkit-border-top-right-radius: 15px;
  -moz-border-radius-topleft: 15px;
  -moz-border-radius-topright: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;

  [data-theme="dark"] & {
      border: 2px solid var(--color-16);
      color: #848D9C;
      background: var(--color-17);
  }
}
.tabs-header__ul .active {
  /* Highest, active tab is on top */
  z-index: 3;

  span {
    padding: 6px 0;
  }
}
.tabs-header__ul .active span {
  /* Colors when tab is active */
  background: var(--color-4);
  font-weight: 700;
  border: 2px solid var(--color-1);
  color: var(--color-1);
  border-bottom: 0;
  color: var(--color-1);
  -webkit-border-top-right-radius: 30px;
  -moz-border-radius-topleft: 30px;
  -moz-border-radius-topright: 30px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  [data-theme="dark"] & {
      background: var(--color-17);
      color: var(--color-4);
      border: 2px solid var(--color-1);
      border-bottom: 0;
  }
}
.tabs-header__ul li:before, .tabs-header__ul li:after,
.tabs-header__ul li span:before, .tabs-header__ul li span:after {
  /* All pseudo elements are
     abs. positioned and on bottom */
  position: absolute;
  bottom: 0;
}
/* Only the first, last, and active
   tabs need pseudo elements at all */
.tabs-header__ul li:last-child:after,   .tabs-header__ul li:last-child span:after,
.tabs-header__ul li:first-child:before, .tabs-header__ul li:first-child span:before,
.tabs-header__ul .active:after,   .tabs-header__ul .active:before,
.tabs-header__ul .active span:after, .tabs-header__ul .active span:before {
  content: "";
}
.tabs-header__ul .active:before, .tabs-header__ul .active:after {
  background: var(--color-5);

  /* Squares below circles */
  z-index: 1;
  [data-theme="dark"] & {
      background: var(--color-17);
  }
}

/* Squares */
.tabs-header__ul li:before, .tabs-header__ul li:after {
  background: var(--color-6);
  width: 15px;
  height: 15px;

  [data-theme="dark"] & {
      background: var(--color-17);
  }
}
.tabs-header__ul li:before {
  left: -10px;
}
.tabs-header__ul li:after {
  right: -16px;
}
/* Circles */
.tabs-header__ul li span:after, .tabs-header__ul li span:before {
  width: 30px;
  height: 30px;
  /* Circles are circular */
  -webkit-border-radius: 10px;
  -moz-border-radius:    10px;
  border-radius:         20px;
  background: var(--color-16);

  /* Circles over squares */
  z-index: 2;
}

.tabs-header__ul__li:last-child span:after {
  display: none;
}
.tabs-header__ul .active span:after, .tabs-header__ul .active span:before {
  background: var(--color-6);
   [data-theme="dark"] & {
      background: var(--color-17);
  }
}

.tabs-header__ul .active span:after {
  border: 1px solid var(--color-1);
  border-width: 0 0 2px 2px;
  border-radius: 0 50% 0 50%;
  [data-theme="dark"] & {
       border-color: var(--color-1);
  }
}

.tabs-header__ul .active span:before {
  border: 2px solid var(--color-1);
  border-width: 2px 2px 0 0;
  border-radius: 0 50% 0 50%;
  transform: rotate(90deg);
  [data-theme="dark"] & {
       border-color: var(--color-1);
  }
}
.tabs-header__ul li:first-child span:before,
.tabs-header__ul li:last-child span:after {
  border-radius: 0;
}
.tabs-header__ul li:last-child {
  &::after {
    display: none;
  }
  & span:after {
    right: -34px;
    border: 0;
  }
}
.tabs-header__ul li:first-child {
  &::before {
    display: none;
  }
  span:before {
    left: -30px;
    border: 0;
  }
}
/* First and last tabs have different
   outside color needs */
.tabs-header__ul li:first-child.active span:before,
.tabs-header__ul li:last-child.active span:after {
  background: none;
}
.tabs-header__ul li span:before {
  left: -27px;
}
.tabs-header__ul li span:after {
  right: -31px;
}

@media only screen and (min-width: 1240px) {
  .tabs-header__ul span {
    font-size: 16px;
  }
}
</style>
