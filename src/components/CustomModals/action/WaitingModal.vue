<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <ModalComponent
    :modelValue="showModal"
    :show-close="false"
    type-modal="custom"
  >
    <div class="container_body">
      <div class="px-5 pt-5">
        <div
          justify="center"
          class="mt-10 mb-10"
        >
          <Spinner size="24px" />
        </div>
        <div justify="center">
          <label class="loading-label">Waiting for confirmation</label>
        </div>
        <div
          justify="center"
          class="mt-8 mb-3"
        >
          <label class="loading-sub-label">{{ modalText }}</label>
        </div>
        <div
          justify="center"
          class="mb-5"
          v-if="modalText"
        >
          <label class="loading-sub2-label">Confirm this transaction in your wallet</label>
        </div>
        <div class="divider" />
      </div>

      <div>
        <Carousel />
      </div>

    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import ModalComponent from '@/components/Modal/Index.vue';
import Carousel from '@/components/CustomModals/action/component/Carousel.vue';
import Spinner from '@/components/Spinner/Index.vue';

export default {
  name: 'WaitingModal',
  components: { Carousel, Spinner, ModalComponent },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('waitingModal', ['show', 'modalText']),
  },
  methods: {
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),

    close() {
      this.closeWaitingModal();

      this.$emit('input', false);
      this.$emit('m-close');
    },
  },
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
    .loading-sub2-label {
        font-size: 14px;
    }
}

@media only screen and (min-width: 1400px) {
    .loading-sub2-label {
        font-size: 12px;
    }
}

/* mobile */
@media only screen and (max-width: 960px) {

    .loading-label {
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        line-height: 30px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .loading-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 34px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .loading-label {
        font-style: normal;
        font-weight: 400;
        font-size: 26px;
        line-height: 36px;
    }
}

.container_body {
    border-radius: 8px !important;
    background-color: var(--secondary) !important;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.loading-label {
    color: #FCCA46;
}

.loading-sub-label {
    color: var(--third-gray-text);
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
}

.loading-sub2-label {
    color: var(--third-gray-text);
    font-style: normal;
    font-weight: normal;
    line-height: 16px;
    font-size: 16px;
}

.divider {
    border-top: 1px solid #ADB3BD;
}
</style>
