<template>
  <input
    type="checkbox"
    id="theme-switch"
    :checked="isChecked"
    class="theme-switch-checkbox"
    @change="$emit('change', $event)"
  />
  <label
    for="theme-switch"
    class="theme-switch-label"
  >
    <span class="theme-switch-button" />
  </label>
</template>

<script lang="ts">
export default {
  name: 'SwitchBox',
  props: {
    isChecked: Boolean,
  },
};
</script>

<style>
.theme-switch-checkbox {
    height: 0;
    width: 0;
    visibility: hidden;
}

.theme-switch-label {
    cursor: pointer;
    background: var(--color-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 15px;
    position: relative;
    border: 1px solid var( --color-2);
    padding: 5px 28px 4px 5px;
    [data-theme="dark"] & {
      background: var(--1, #0F172A);
      border: 1px solid var( --color-9);
    }
}

.theme-switch-button {
    width: 17px;
    height: 17px;
    border: 1px solid var( --color-2);
    background: var(--background-color);
    border-radius: 50%;
    transition: transform 0.15s;
    [data-theme="dark"] & {
      border: 1px solid var( --color-9);
      background:  var(--color-17);
    }
}

.theme-switch-checkbox:checked + .theme-switch-label .theme-switch-button {
    transform: translateX(23px);
}
</style>
