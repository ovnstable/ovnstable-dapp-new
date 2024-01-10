<template>
  <button
    :type="btnType"
    class="button"
    @click="$emit('click', $event)"
  >
    <div v-if="isLoading">
      ...Loading
    </div>
    <slot v-else />
  </button>
</template>

<script lang="ts">
import { type PropType } from 'vue';

type btnTypes = 'button' | 'submit';

export default {
  name: 'ButtonComponent',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    btnType: {
      type: String as PropType<btnTypes>,
      default: 'button',
    },
    buttonHover: {
      type: String,
      default: 'blue',
    },
  },
};
</script>

<style lang="scss">
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 5px 12px;
  border: 1px solid #0F172A;
  background-color: #FFF;
  box-shadow: 0px 1px 0px 0px #0F172A;
  cursor: pointer;
  transition: transform .15s ease, background-color .2s ease, color .2s ease;

  &:hover {
    color: #fff;
    background-color: #0497EC;
  }

  &:active {
    transform: scale(0.92);
  }
}
</style>
