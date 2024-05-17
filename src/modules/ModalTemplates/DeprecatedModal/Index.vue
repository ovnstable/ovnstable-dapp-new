<template>
  <ModalComponent
    type-modal="custom"
    :modelValue="showModal"
    overlayModals
    @close="close"
  >
    <div class="modal-content">
      <h1>Deprecated chains and tokens</h1>
      <div class="divider" />
      <p class="modal-content__short">
        You can check out the Deprecated chains below and alsoswitch to them to withdraw your funds:
      </p>
      <img
        class="modal-content__img"
        alt="deprecated"
        :src="getImageUrl('assets/images/common/deprecatedTokens.png')"
      />
      <div class="divider" />
      <p>
        In the chain selection section you can
        enable the button to turn on Deprecated chains and tokens:
      </p>
      <img
        class="modal-content__img"
        alt="deprecatedSwitch"
        :src="getImageUrl('assets/images/common/deprecatedSwitching.png')"
      />
      <p>
        When switching you will see Deprecated chains in all chain filters:
      </p>
      <img
        class="modal-content__img"
        alt="deprecatedChains"
        :src="getImageUrl('assets/images/common/deprecatedChains.png')"
      />
      <!-- <div class="divider" />
      <p>
        You can also check availability your funds on Deprecated chains in Your Dashboard:
      </p>
      <ButtonComponent
        @on-click="close"
      >
        LEARN MORE
      </ButtonComponent> -->
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from '@/components/Modal/Index.vue';
import { getImageUrl } from '@/utils/const.ts';
// import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'DeprecatedModal',
  components: { ModalComponent },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getImageUrl,
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content__short {
  max-width: 70%;
}

.modal-content {
  padding: 15px 30px;
  width: 100%;
  max-width: 600px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-color: var(--color-4);
  }

  p {
    text-align: center;
    margin: 20px auto;
  }

  h1 {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-1);
    margin-bottom: 20px;
    text-transform: uppercase;

    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.modal-content__spin {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.modal-content__confirm {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-2);
  margin-bottom: 40px;
  text-align: center;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-7);
}

.modal-content__tips {
  margin-top: 40px;
}

.modal-content__img {
  width: 100%;
  object-fit: contain;
  margin-bottom: 20px;
}

@media (max-width: 640px) {
  .modal-content {
    padding: 5px 7px 3px 7px;
    max-width: 380px;
  }
}
</style>
