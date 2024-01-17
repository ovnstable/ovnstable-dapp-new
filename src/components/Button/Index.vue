<template>
  <button
    :type="btnType"
    class="button"
    :class="{
      [btnStyles]: !!btnStyles,
      [btnSize]: !!btnSize,
      disabled,
      full,
    }"
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
type btnStyles = 'primary' | 'secondary' | 'standard';
type btnSize = 'large' | 'default' | 'small';

export default {
  name: 'ButtonComponent',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    btnSize: {
      type: String as PropType<btnSize>,
      default: 'default',
    },
    btnStyles: {
      type: String as PropType<btnStyles>,
      default: 'default',
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
  padding: 5px 12px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  border: unset;
  background-color: transparent;
  cursor: pointer;
  transition: transform .15s ease, background-color .2s ease, color .2s ease, opacity .2s ease;

  &:active {
    transform: scale(0.92);
  }

  &.large {
    padding: 14px 20px;
    font-size: 18px;
  }

  &.full {
    width: 100%;
  }

  &.disabled {
    color: var(--color-2);
    background-color: var(--color-5);
    pointer-events: none;
  }

  &.primary {
    color: #fff;
    background-color: #0497EC;

    &:hover {
      opacity: .9;
    }
  }

  &.secondary {
    color: #fff;
    background-color: #0497EC;

    &:hover {
      opacity: .9;
    }
  }

  &.standard {
    border: 1px solid #0F172A;
    box-shadow: 0px 1px 0px 0px #0F172A;

    &:hover {
      color: #fff;
      background-color: #0497EC;
    }
  }
}
</style>
