<template>
  <div
    :class="[componentClasses, customClass, { 'input--custom': isCustom }]"
    @click="$emit('click', $event)"
    @mouseover="$emit('mouseover', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    @mousemove="$emit('mousemove', $event)"
    @blur="$emit('mousemove', $event)"
    @focusin="$emit('mousemove', $event)"
    @keypress="$emit('mousemove', $event)"
  >
    <slot name="prefix" />
    <input
      ref="input"
      type="text"
      autocomplete="new-password"
      :placeholder="placeholder"
      :required="required"
      :value="value"
      :disabled="disabled || readonly"
      maxlength="255"
      @change="onChange"
      @input="onInput"
      @focus="onFocus"
      @focusin="isFocused = true"
      @focusout="isFocused = false"
    >

    <slot name="suffix" />
  </div>
</template>

<script lang="ts">
import uniqueId from 'lodash/uniqueId';

export default {
  name: 'input-component',

  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    value: {
      type: [
        String,
        Number,
        Array,
      ],
      default: null,
    },
    customClass: {
      type: String,
      default: '',
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: uniqueId(),
    },
    mask: {
      type: [
        String,
        Array,
        Function,
      ],
      default: null,
    },

    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },

    fullWidth: {
      type: Boolean,
      default: false,
    },
    emitEvent: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isFocused: false,
    };
  },

  computed: {
    componentClasses() {
      return [
        this.$options.name,
        {
          'is-focused': this.isFocused,
          'is-full-width': this.fullWidth,
          'is-disabled': this.disabled,
        },
      ];
    },
  },

  mounted() {
    if (this.autofocus) {
      this.$nextTick(() => {
        (this.$refs?.input as any)?.focus();
      });
    }
  },

  methods: {
    onInput(event: any) {
      if (this.emitEvent) this.$emit('input', event);
      else this.$emit('input', event.target.value);
    },

    onChange(event: any) {
      if (this.emitEvent) this.$emit('change', event);
      else this.$emit('change', event.target.value);
    },

    onFocus(event: any) {
      if (this.emitEvent) this.$emit('focus', event);
      else this.$emit('focus', event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-component {
  display: flex;
  align-items: center;

  input {
    width: 100%;
    height: 100%;
    max-width: calc(100% - 6px);
    padding: 8px 12px;
    border: none;
    background-color: transparent;
    font: inherit;
    color: inherit;
    outline: none;
    border-radius: 8px;
    transition: box-shadow .2s ease;
    [data-theme="dark"] & {
      color: var(--color-4);
    }

    &:hover {
      box-shadow: 0 0 1px var(--color-1);
      [data-theme="dark"] & {
        box-shadow: 0 0 1px var(--color-4);
      }
    }

    &::placeholder {
      color: #9F9F9F;
      [data-theme="dark"] & {
        color: var(--color-3);
      }
    }

    &[disabled] {
      pointer-events: none;
    }
  }

  &.is-focused {
    input {
      box-shadow: 0 0 3px var(--color-1);
    }
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.is-full-width {
    width: 100%;
  }
}

.input--custom {
  input {
    &:hover {
      box-shadow: unset;
    }
  }
  &.is-focused {
    input {
      box-shadow: unset;
    }
  }
}
</style>
