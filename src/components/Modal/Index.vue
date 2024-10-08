<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <Teleport to="body">
    <div
      class="modal__activator"
    >
      <slot
        name="activator"
        :on="activator"
      />

      <Transition name="slide-fade">
        <div
          v-if="opened"
          class="modal__wrap"
          :class="{ 'modal__wrap-overlay-modal': overlayModals, [customClass]: customClass }"
          @click="closeModal"
          @keydown.esc="closeModal"
        >
          <div
            class="modal__wrap-stop"
            :class="{ 'modal--custom': typeModal === 'custom' }"
            @click.stop
          >
            <div
              v-if="showClose"
              class="modal__close"
              @click.native="closeModal"
              @keypress="closeModal"
            >
              <BaseIcon name="Close" />
            </div>

            <div
              v-show="$slots.header"
              class="modal__header"
            >
              <slot name="header" />
            </div>

            <div :class="['modal__body', customClass]">
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
      </Transition>
    </div>
  </Teleport>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'ModalComponent',
  components: {
    BaseIcon,
  },
  props: {
    customClass: {
      type: String,
      default: '',
    },
    typeModal: {
      type: String,
      default: 'default',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    overlayModals: {
      type: Boolean,
      default: false,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    pauseListeners: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close'],
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
      set(val: boolean) {
        this.$emit('update:modelValue', val);
      },
    },
    activator() {
      return {
        click: this.show,
      };
    },
  },
  beforeUnmount() {
    window.removeEventListener('keyup', this.onKeyUp);
  },
  methods: {
    show(e: any) {
      e.stopPropagation();
      this.elActivator = e.currentTarget;
      this.opened = !this.opened;
    },
    onKeyUp(event: any) {
      if (!event.keyCode || this.pauseListeners) return;
      switch (event.keyCode) {
        case 27: // esc
          if (this.opened) this.$emit('close');
          break;
        default:
          break;
      }
    },
    closeModal() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
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

    &.v3 {
      backdrop-filter: blur(5px);
    }

    .modal__wrap-stop {
        position: relative;
        z-index: 250;
        background-color: var(--color-4);
        box-shadow: 0px 1px 0px 0px #0F172A;
        border-radius: 20px;
        padding: 30px 40px;
        border: 2px solid var(--color-1);
        [data-theme="dark"] & {
          background-color: var(--color-6);
          border-color: var(--color-4);
        }
    }
    .modal--custom {
      padding: 0;
    }
    .modal__close {
        position: absolute;
        top: 12px;
        right: 20px;
        z-index: 16;
        cursor: pointer;
        svg {
          transition: transform 0.3s ease;
        }
        &:hover {
          svg {
            transform: rotate(-90deg);
          }
        }
    }
    .modal__header,
    .modal__body,
    .modal__footer {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
}

.modal__body {
  @media (min-width: 1024px) {
    max-height: 60vh;
    &.success-modal {
    max-height: none;
  }
  }
}

@media (max-width: 1024px) {
  .modal__wrap {
    width: 100vw;
  }
}
.modal__activator {
  position: absolute;
}

.modal__wrap-overlay-modal {
  z-index: 300;
}

.modal__body {
  max-height: 80vh;
  overflow-y: auto;
  &.success-modal {
    max-height: none;
  }
  &.v3 {
    max-height: 90vh;
    [data-theme="dark"] & {
    background-color: var(--color-17);
  }
  }
  border-radius: 20px;
  // [data-theme="dark"] & {
  //   background-color: var(--color-6);
  // }
}

@media (max-width: 640px) {
  .modal__wrap {
    .modal--custom {
      width: calc(100vw - 20px);
    }
  }

  .modal__body {
    max-height: 90vh;
    padding-bottom: 100px;
  }
}

</style>
