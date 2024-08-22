<template>
  <ModalComponent
    :model-value="showModal"
    :show-close="false"
    overlay-modals
    type-modal="custom"
  >
    <div class="modal-content zap-waiting-modal">
      <div
        v-if="isZapModalShow"
        class="zap-waiting-modal-container"
      >
        <ZapinWaitingModal :stage-map="STAGES_MAP_GET" />
      </div>
      <div v-else>
        <div class="modal-content__spin">
          <Spinner size="90px" />
        </div>
        <h1>Waiting for confirmation</h1>
        <p class="modal-content__confirm">
          Confirm this transaction in your wallet
        </p>
        <div class="divider" />
        <div class="modal-content__tips">
          <Carousel />
        </div>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { mapState, mapGetters } from 'vuex';
import Carousel from '@/modules/ModalTemplates/components/Carousel.vue';
import Spinner from '@/components/Spinner/Index.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import ZapinWaitingModal from '@/components/ZapWaitingModal/Index.vue';

export default {
  name: 'WaitingModal',
  components: {
    Carousel, Spinner, ModalComponent, ZapinWaitingModal,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('waitingModal', ['STAGES_MAP_GET']),
    ...mapGetters('poolsData', ['isZapModalShow']),
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  padding: 50px 70px 30px 70px;
  &.zap-waiting-modal {
    padding: 50px 25px 50px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    min-width: 700px;
    .zap-waiting-modal-container {
      width: 100%;
    }
  }
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-color: var(--color-4);
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-1);
    margin-bottom: 20px;
    text-align: center;
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

@media (max-width: 640px) {
  .modal-content {
    padding: 5px 7px 3px 7px;
    max-width: 380px;
  }
}
</style>
