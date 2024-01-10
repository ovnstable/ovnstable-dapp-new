<template>
  <input
    type="checkbox"
    id="theme-switch"
    :checked="isChecked"
    class="theme-switch-checkbox"
    @change="$emit('change', ($event.target as HTMLInputElement).checked)"
  />
  <label
    for="theme-switch"
    :class="['theme-switch-label', { 'dark-theme-label': isChecked }]"
  >
    <span :class="['theme-switch-button', { 'dark-theme-button': isChecked }]" />
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
    background: var(--color-white);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 15px;
    position: relative;
    border: 1px solid var( --color-dark-grey);
    padding: 5px 28px 4px 5px;
}

.theme-switch-button {
    width: 17px;
    height: 17px;
    border: 1px solid var( --color-dark-grey);
    background: var(--background-color);
    border-radius: 50%;
    transition: transform 0.15s;
}

.theme-switch-checkbox:checked + .theme-switch-label .theme-switch-button {
    transform: translateX(23px);
}
.dark-theme .theme-switch-checkbox:checked + .theme-switch-label .theme-switch-button {
    background: var(--color-black);
}

.dark-theme-label,
.dark-theme-button {
  background: var(--color-black);
  border: 1px solid var(--color-white);
}
</style>
