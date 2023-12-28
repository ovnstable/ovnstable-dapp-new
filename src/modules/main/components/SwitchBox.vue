<template>
  <input
    type="checkbox"
    id="theme-switch"
    :checked="isChecked"
    class="theme-switch-checkbox"
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
    background: var(--color-blue)
}
</style>
