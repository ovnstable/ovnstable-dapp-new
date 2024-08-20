<template>
  <div>
    <div>
      <ZapForm
        :zap-pool="zapPool"
        @close-form="closeModal"
      />
    </div>

    <SuccessZapModal
      :set-show-func="triggerSuccessZapin"
    />
  </div>
</template>

<script lang="ts">
import {
  mapActions,
  mapMutations,
} from 'vuex';
import ZapForm from '@/components/ZapForm/Index.vue';
import SuccessZapModal from '@/modules/ModalTemplates/SuccessModal/SuccessZapModal.vue';

export default {
  name: 'ZapFormPage',
  components: {
    ZapForm,
    SuccessZapModal,
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
  emits: ['toggle-modal'],
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
  methods: {
    ...mapActions('odosData', [
      'triggerSuccessZapin',
    ]),
    ...mapMutations('zapinData', ['resetStore']),
    closeModal() {
      this.resetStore();
      this.$emit('toggle-modal');
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  padding: 20px;
  min-width: 600px;
  max-width: 600px;

  &.v3 {
    width: 100vw;
    max-width: 80vw;
    height: 100%;
  }

  @media (max-width: 1240px) {
    &.v3 {
      max-width: 80vw;
    }
  }
}

@media (max-width: 640px) {
  .modal-content {
    min-width: 0;
  }
}
</style>
