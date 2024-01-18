<template>
  <button
    :type="btnType"
    class="button"
    :class="{
      [btnStyles]: !!btnStyles,
      [btnSize]: !!btnSize,
      disabled: disabled || isLoading,
      full,
    }"
    @click="$emit('click', $event)"
  >
    <div v-if="isLoading">
      <Spinner size="24px" />
    </div>
    <slot v-else />
  </button>
</template>

<script lang="ts">
import { type PropType } from 'vue';
import Spinner from '@/components/Spinner/Index.vue';

type btnTypes = 'button' | 'submit';
type btnStyles = 'primary' | 'secondary' | 'standard';
type btnSize = 'large' | 'default' | 'small';

export default {
  name: 'ButtonComponent',
  components: {
    Spinner,
  },
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
      default: 'standard',
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  border-radius: 10px;
  font-size: 15px;
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

  &.primary {
    color: #fff;
    background-color: #0497EC;

    &:hover {
      opacity: .9;
    }
  }

  &.secondary {
    color: var(--color-1);
    background-color: var(--color-5);
    border: 1px solid var(--color-1);
    box-shadow: 0px 1px 0px 0px var(--color-1);

    &:hover {
      color: var(--color-3);
      background-color: var(--color-4);
    }
  }

  &.standard {
    background-color: var(--color-3);
    border: 1px solid var(--color-1);
    color: var(--color-4);
    box-shadow: 0px 1px 0px 0px var(--color-1);

    &:hover {
      color: var(--color-3);
      background-color: var(--color-4);
    }
  }

  &.disabled {
    color: var(--color-2);
    background-color: var(--color-5);
    border: unset;
    box-shadow: unset;
    pointer-events: none;
  }

}
</style>
