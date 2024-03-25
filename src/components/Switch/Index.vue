<template>
  <input
    type="checkbox"
    :id="`switch-${id}`"
    :checked="isCurrentlyCheckedDarkTheme || isChecked"
    class="switch-checkbox"
    @change="switchTrigger"
  />
  <label
    :for="`switch-${id}`"
    class="switch-label"
    :class="{ 'switch-disabled': disabled }"
  >
    <span class="switch-button" />
  </label>
</template>

<script lang="ts">
import { uniqueId } from 'lodash';

export default {
  name: 'SwitchBox',
  emits: ['change-switch'],
  props: {
    isChecked: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      id: uniqueId(),
    };
  },
  computed: {
    isCurrentlyCheckedDarkTheme() {
      const themeType = localStorage.getItem('theme-type');
      return themeType === 'dark';
    },
  },
  methods: {
    switchTrigger() {
      this.$emit('change-switch');
    },
  },
};
</script>

<style>
.switch-checkbox {
  position: absolute;
  height: 0;
  width: 0;
  visibility: hidden;
}

.switch-label {
    cursor: pointer;
    background: var(--color-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 15px;
    position: relative;
    border: 1px solid var(--color-2);
    padding: 5px 28px 4px 5px;
    transition: .2s ease opacity;

    [data-theme="dark"] & {
      background: var(--1, #0F172A);
      border: 1px solid var( --color-2);
    }
}

.switch-button {
    width: 17px;
    height: 17px;
    border: 1px solid var( --color-2);
    background: var(--color-5);
    border-radius: 50%;
    transition: transform 0.15s;

    [data-theme="dark"] & {
      border: 1px solid var( --color-18);
      background: var(--color-7);
    }
}

.switch-checkbox:checked + .switch-label {
    background: var(--color-3);

    [data-theme="dark"] & {
      background:  var(--color-17);
    }
}

.switch-checkbox:checked + .switch-label .switch-button {
    transform: translateX(23px);
    background: var(--color-4);

    [data-theme="dark"] & {
      background:  var(--color-7);
    }
}

.switch-disabled {
  opacity: .7;
  pointer-events: none;
}
</style>
