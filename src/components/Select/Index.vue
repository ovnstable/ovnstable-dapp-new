<template>
  <div
    :id="`select--${selectId}`"
    :ref="`select--${selectId}`"
    :class="classObject"
  >
    <div v-if="label">
      <span
        v-if="!labelEditable"
        class="label-text"
      >
        {{ label }}
      </span>

      <input
        v-else
        :value="label"
        placeholder="Field name"
        full-width
        @input="$emit('input-label', $event)"
      />
      <span v-if="required">*</span>
    </div>

    <div
      :class="{ active: isActive }"
      class="select-selected"
      @click="showList"
      @keypress="showList"
    >
      <template v-if="isValidValue">
        <span
          class="select-text"
        >
          {{ selectedText }}
        </span>
        <span
          v-if="selectStyles === 'primary'"
          class="select-icon"
        >
          <BaseIcon name="ArrowRight" />
        </span>
      </template>

      <span
        v-else-if="placeholder"
        class="select-placeholder"
        v-text="placeholder"
      />
    </div>

    <!-- List -->
    <ul
      v-if="isActive"
      :class="[{
        active: isActive,
        top: top,
        bottom: bottom,
      }]"
      class="select-list"
    >
      <div
        v-if="list.length > 10"
        class="select-list__search"
      >
        <input
          v-model="searchQuery"
          placeholder="Search in list"
          inverse
          small
          full-width
          @input="searchQueryInput"
        />
      </div>

      <li
        v-if="!listData || !listData.length"
        class="select-item disabled"
      >
        {{ noDataText }}
      </li>

      <li
        v-for="(item, index) in (listData as any)"
        :key="`select-item-${index}`"
        :class="{ selected: isSelected(item) }"
        class="select-item"
        @click="onItemClick(item)"
        @keypress="onItemClick(item)"
      >
        <slot
          name="item"
          :item="item"
        >
          {{ item[valueField] || item }}
        </slot>
      </li>
    </ul>

    <div
      v-if="hint"
      class="control-hint"
      v-text="hint"
    />
  </div>
</template>

<script lang="ts">
import uniqueId from 'lodash/uniqueId';
import { onClickOutside, templateRef } from '@vueuse/core';
import type { PropType } from 'vue';
import BaseIcon from '../Icon/BaseIcon.vue';

type selectStyles = 'primary' | 'secondary';

export default {
  name: 'SelectComponent',
  components: {
    BaseIcon,
  },

  model: {
    event: 'change',
    prop: 'value',
  },

  props: {
    value: {
      type: [
        Number,
        String,
        Object,
        Array,
      ],
      default: null,
    },
    selectStyles: {
      type: String as PropType<selectStyles>,
      default: 'primary',
    },
    list: {
      type: Array,
      default: () => ([]),
    },
    label: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: 'Select',
    },
    hint: {
      type: String,
      default: null,
    },
    noDataText: {
      type: String,
      default: 'List is empty',
    },
    idField: {
      type: String,
      default: null,
    },
    valueField: {
      type: String,
      default: null,
    },

    returnObject: {
      type: Boolean,
      default: false,
    },
    closeOnSelect: {
      type: Boolean,
      default: true,
    },

    labelEditable: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inverse: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    tiny: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    // selectedText: null,
    selectId: '',
    isActive: false,
    searchQuery: null as string | null,
    top: false,
    bottom: false,
  }),

  computed: {
    classObject() {
      return {
        [this.$options.name as string]: true,
        [this.selectStyles]: this.selectStyles,
        'is-small': this.small,
        'is-tiny': this.tiny,
        'is-inverse': this.inverse,
        'is-disabled': this.disabled,
        'is-clearable': this.clearable,
        'is-required': this.required,
        'is-label-editable': this.labelEditable,
      };
    },

    model: {
      get() {
        return this.value;
      },

      set(newValue: any) {
        this.$emit('change', newValue);
      },
    } as any,

    listData() {
      if (!this.searchQuery || this.searchQuery === '' || this.autocomplete) return this.list;

      return this.list
        .filter(
          (item: any) => (item[this.valueField] || item)
            .toLowerCase()
            .indexOf(this.searchQuery?.toLowerCase()) !== -1,
        );
    },

    selectedText() {
      if (typeof this.value === 'object' && this.value !== null) {
        return (this.value as any)[this.valueField] || (this.value as any).value;
      }

      const reference: any = this.list.find((item: any) => item[this.idField] === this.value);
      if (reference) return reference[this.valueField];

      return this.value;
    },

    isValidValue() {
      return this.value !== null;
    },
  },

  created() {
    this.selectId = uniqueId('select');
    this.initClickOutside();
  },

  methods: {
    initClickOutside() {
      const target: any = templateRef(`select--${this.selectId}`);
      onClickOutside(target, () => this.onClickAway());
    },
    onItemClick(item: any) {
      const readyValue = this.getSelectedValue(item);

      if (this.value === readyValue) {
        // this.model = null;
        return;
      }

      this.model = readyValue;

      if (this.closeOnSelect) {
        this.onClickAway();
      }
    },

    isSelected(item: any) {
      return this.value === (item[this.idField] || item);
    },

    getSelectedValue(item: any) {
      if (this.returnObject && typeof item === 'object') return item;

      if (typeof item === 'object') {
        return item[this.idField] || item.id;
      }

      return item;
    },

    onClickAway() {
      if (this.isActive) {
        if (this.autocomplete) this.$emit('autocompleteInput', null);
        this.searchQuery = null;
        this.isActive = false;
      }
    },

    searchQueryInput(event: Event) {
      this.searchQuery = (event.currentTarget as any).value;

      if (this.autocomplete) {
        this.$emit('autocompleteInput', this.searchQuery);
      }
    },

    showList() {
      this.isActive = !this.isActive;

      if (this.isActive === true) {
        this.getPosition();
      }

      this.$emit('showList');
    },

    getPosition() {
      // eslint-disable-next-line consistent-return
      this.$nextTick(() => {
        if (typeof window !== 'undefined') {
          const el = document.querySelector(`#select--${this.selectId}`);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (windowHeight - rect.bottom < 290) {
            this.bottom = false;
            this.top = true;
          } else {
            this.top = false;
            this.bottom = true;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.sidebar__button-switch-language {
  margin-left: 40px;
  padding: 0px 14px 0px 6px;
  text-align: center;
  font-size: 14px;

  [data-theme="dark"] & {
    border: 1px solid var(--color-3);
    background: var(--color-17);
    color: var( --color-4);
  }
}

.select-component {
  $max-list-height: 240;
  position: relative;
  width: auto;
  font-size: 14px;
  height: 100%;

  label {
    display: flex;
    line-height: 16px;
    font-size: 13px;
    font-family: inherit;
    font-weight: 500;
    margin-bottom: 5px;
    padding-left: 1px;

    .label-text {
      margin-right: 4px;
    }
  }

  .control-hint {
    margin-top: 4px;
    font-size: 11px;
    line-height: 12px;
    color: #666;
  }

  &.is-small {
    min-height: 32px;
    font-size: 12px;

    label {
      line-height: 14px;
      font-size: 12px;
    }

    .select-item,
    .select-selected {
      min-height: 32px;
      // margin-top: 5px;
      // margin-bottom: 5px;
    }
  }

  &.is-tiny {
    min-height: 24px;
    font-size: 11px;

    .select-placeholder,
    .select-selected {
      font-size: 11px;
    }

    label {
      line-height: 14px;
      font-size: 12px;
    }

    .select-item,
    .select-selected {
      min-height: 24px;
    }
  }

  .select-item,
  .select-selected {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-weight: 500;
    font-size: 12px;
    padding: 6px 0;
    text-align: center;
    cursor: pointer;
    transition: .1s ease background-color;

    .checkbox {
      margin-left: auto;
    }
  }

  .select-placeholder {
    color: #9F9F9F;
    font-weight: 300;
    white-space: nowrap;
  }

  .select-selected {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    padding: 2px 6px;
    min-width: 40px;
    font-weight: 500;
    overflow: hidden;
    border-radius: 30px;
    white-space: nowrap;

    &.active {
      &::after {
        transition: 0.3s;
        transform: translate(-50%, -50%) rotate(270deg);
      }
    }
  }

  &.primary {
    .select-selected {
      background: var(--color-5);
      color: var(--color-1);
      border: 1px solid var(--color-6);

      [data-theme="dark"] & {
        background: var(--color-17);
      }
    }
  }

  &.secondary {
    .select-selected {
      background: var(--color-4);
      color: var(--color-2);
      border: 1px solid var(--color-2);

      [data-theme="dark"] & {
        background: var(--color-17);
      }
    }
  }

  &.is-disabled {
    opacity: 0.7;
    pointer-events: none;

    .select-selected {
      &::after {
        background-color: #999;
      }
    }
  }

  &.is-inverse {
    .select-selected {
      background-color: white;

      &::before {
        background-color: white;
      }
    }
  }

  .select-clear {
    position: absolute;
    right: 34px;
    color: var(--color-3);
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }

  .select-item {
    &:hover {
      background-color: var(--color-1);
      color: var(--color-4);
    }

    &.selected {
      background-color: rgba(var(--color-3), 0.9);
      color: var(--color-3);

      &:hover {
        background-color: rgba(var(--color-3), 0.7);
      }
    }

    &.disabled {
      pointer-events: none;
      color: #9F9F9F;
    }
  }

  .select-list {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 1;
    width: 100%;
    max-height: 100px;
    border: 1px solid var(--color-4);
    padding: 6px 0;
    margin: 0;
    box-sizing: border-box;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 2px rgba(100, 100, 100, 0.15);
    overflow-y: auto;

    &.top {
      top: unset;
      bottom: 120%;
      box-shadow: 0 -1px 2px rgba(100, 100, 100, 0.15);
    }

    &.bottom {
      top: 120%;
      bottom: unset;
    }

    &.active {
      opacity: 1;
      visibility: visible;
    }

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      cursor: pointer;
      -webkit-appearance: none;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 4px #f7f7f7;
      box-shadow: inset 0 0 4px #f7f7f7;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-3);
      cursor: pointer;
      border-radius: 2px;
      outline: none;
      background-clip: border-box;
    }
  }

  .select-text {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    color: var(--color-1);
    max-width: 100%;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }

  .select-list__search {
    display: flex;
    flex-wrap: nowrap;
    padding: 8px;
  }
}

.select-icon {
  svg {
    width: 8px;
  }
}
</style>
