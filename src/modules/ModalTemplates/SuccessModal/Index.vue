<template>
  <ModalComponent
    :model-value="showModal"
    type-modal="custom"
    overlay-modals
    @close="close"
  >
    <div class="modal-content">
      <BaseIcon
        class="modal-content__icon"
        name="CommonSuccess"
      />
      <h1>
        You successfully swapped
      </h1>

      <div class="modal-content__tokens">
        <div class="modal-content__tokens-col">
          <h3>From</h3>
          <div
            v-for="(item, key) in swapData?.from"
            :key="key"
            class="modal-content__tokens-col-item"
          >
            <span>-{{ item?.value }} {{ item?.symbol }}</span>
          </div>
        </div>
        <div class="modal-content__tokens-col">
          <h3>To</h3>
          <div
            v-for="(item, key) in swapData?.to"
            :key="key"
            class="modal-content__tokens-col-item"
          >
            <span>+{{ item.value }} {{ item.symbol }}</span>
          </div>
        </div>
      </div>

      <div v-if="zksyncFeeHistory">
        <RefundInfo :zksync-fee-history="zksyncFeeHistory" />
      </div>

      <div
        v-if="!zksyncFeeHistory"
        justify="center"
        class="modal-content__close"
      >
        <ButtonComponent
          @on-click="goToTransactionHistory"
        >
          Close
        </ButtonComponent>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import RefundInfo from '@/modules/ModalTemplates/components/RefundInfo.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'SuccessModal',
  components: {
    RefundInfo,
    ModalComponent,
    BaseIcon,
    ButtonComponent,
  },

  props: {
    showModal: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters('successModal', ['swapData', 'zksyncFeeHistory']),
  },

  methods: {
    ...mapActions('successModal', ['closeSuccessModal']),

    close() {
      this.closeSuccessModal();
    },

    goToTransactionHistory() {
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 70px 30px 70px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-color: var(--color-4);
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-1);
    margin-bottom: 20px;
    @media (max-width: 450px) {
      align-items: center;
      text-align: center;
    }
  }

}

.modal-content__icon {
  width: 90px;
  height: 90px;
  margin-bottom: 20px;
}

.modal-content__tokens {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 50px;
  margin-bottom: 30px;
}

.modal-content__tokens-col {
  text-align: center;

  span, h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }

  &:first-child {
    span {
      color: var(--color-3);
    }
  }

  &:last-child {
    span {
      color: var(--color-12);
    }
  }
}

.modal-content__close {
  button {
    [data-theme="dark"] & {
      box-shadow: none;
    }
  }
}
</style>
