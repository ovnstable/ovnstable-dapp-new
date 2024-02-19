<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div class="modal__activator">
    <slot
      name="activator"
      :on="activator"
    />

    <Transition name="slide-fade">
      <div
        v-if="opened"
        class="modal__wrap"
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
    </Transition>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'ModalComponent',
  components: {
    BaseIcon,
  },
  props: {
    typeModal: {
      type: String,
      default: 'default',
    },
    modelValue: {
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
  mounted() {
    window.addEventListener('keyup', this.onKeyUp);
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
      console.log('EMIT');
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
    user-select: none;
    .modal__wrap-stop {
        position: relative;
        z-index: 250;
        background-color: var(--color-4);
        box-shadow: 0px 1px 0px 0px #0F172A;
        border-radius: 5px;
        pointer-events: auto;
        padding: 30px 40px;
        border: 2px solid var(--color-1);
    }
    .modal--custom {
      padding: 0;
    }
    .modal__close {
        position: absolute;
        top: 12px;
        right: 12px;
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

@media (max-width: 1024px) {
  .modal__wrap {
    width: 110vw;
  }
}
@media (max-width: 768px) {
  .modal__wrap {
    width: 140vw;
  }
}
@media (max-width: 576px) {
.modal__wrap {
    width: 155vw;
    left: -40px;
  }
}

.modal__activator {
  position: absolute;
}

.modal__body {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
