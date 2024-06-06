<template>
  <div>
    <ModalComponent
      type-modal="custom"
      v-model="showModal"
      @close="closeModal"
      :customClass="zapPool?.poolVersion ?? ''"
    >
      <div :class="['modal-content', { v3: zapPool?.poolVersion === 'v3' }]">
        <ZapForm
          :zap-pool="zapPool"
          @close-form="closeModal"
        />
      </div>
    </ModalComponent>

    <SuccessZapModal
      :is-show="showSuccessZapin"
      :success-data="successData"
      :set-show-func="triggerSuccessZapin"
    />
  </div>
</template>

<script lang="ts">
import {
  mapActions,
  mapState,
} from 'vuex';
import ModalComponent from '@/components/Modal/Index.vue';
import ZapForm from '@/modules/Main/components/ZapModal/ZapForm/Index.vue';
import SuccessZapModal from '@/modules/ModalTemplates/SuccessModal/SuccessZapModal.vue';

export default {
  name: 'ZapModal',
  components: {
    ZapForm,
    SuccessZapModal,
    ModalComponent,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    zapPool: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  computed: {
    ...mapState('odosData', [
      'successData',
      'showSuccessZapin',
    ]),
  },
  methods: {
    ...mapActions('odosData', [
      'triggerSuccessZapin',
    ]),
    closeModal() {
      this.$emit('toggle-modal');
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  padding: 24px;
  min-width: 600px;
  max-width: 600px;

  &.v3 {
    width: 100vw;
    max-width: 80vw;
    height: 100%;
    // zoom: 90%;
  }

  @media (max-width: 1240px) {
    &.v3 {
      max-width: 80vw;
      // zoom: normal;
    }
  }
}

@media (max-width: 640px) {
  .modal-content {
    min-width: 0;
  }
}
</style>
