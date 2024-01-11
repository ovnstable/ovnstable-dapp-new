<template>
  <div class="modal__activator">
    <slot
      name="activator"
      :on="activator"
    />

    <div
      v-if="opened"
      class="modal__wrap"
      @click="opened = false"
      @keydown.esc="closeModal"
    >
      <div
        class="modal__wrap-stop"
        @click.stop
      >
        <div class="modal__close">
          <au-icon
            icon="mdi-close"
            :size="24"
            color="#bbb"
            @click.native="opened = false"
          />
        </div>

        <div
          v-show="$slots.header"
          class="modal__header"
        >
          <slot name="header" />
        </div>

        <div class="modal__body">
          <slot />
        </div>

        <div
          v-show="$slots.footer"
          class="modal__footer"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: 'ModalComponent',

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    pauseListeners: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      elActivator: null,
    };
  },

  computed: {
    opened: {
      get() {
        return this.modelValue;
      },
      set(val:any) {
        this.$emit('update:modelValue', val);
      },
    },

    activator() {
      return {
        click: this.show,
      };
    },
  },

  mounted() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keyup', this.onKeyUp);
    }
  },

  beforeUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keyup', this.onKeyUp);
    }
  },

  methods: {
    show(e:any) {
      e.stopPropagation();

      this.elActivator = e.currentTarget;
      this.opened = !this.opened;
    },

    onKeyUp(event:any) {
      if (!event.keyCode || this.pauseListeners) return;

      switch (event.keyCode) {
        case 27: // esc
          if (this.opened) this.$emit('on-escape');
          break;
        default:
          break;
      }
    },
    closeModal() {
      this.$emit('update:modelValue', false);
    },
  },
};
</script>

<style lang="scss">

.modal__wrap {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 200;
    display: flex;
    justify-content: center;
align-items: center;
    width: 100vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    user-select: none;

    .modal__wrap-stop {
        position: relative;
        z-index: 250;
        background-color: #fff;
        box-shadow: 0 0 70px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        pointer-events: auto;
        padding: 30px 40px;
    }

    .modal__close {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 16;
        transition: all 0.25s ease;
        cursor: pointer;

        &:hover {
            filter: grayscale(100%);
        }
    }

    .modal__header,
    .modal__body,
    .modal__footer {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .modal__header {
        border-bottom: 1px;
        align-items: center;
    }

    .modal__footer {
        border-top: 1px;
        align-items: center;
    }
}
</style>
