<template>
  <div>
    <ModalComponent
      v-model="showModal"
      type-modal="custom"
      :custom-class="zapPool?.poolVersion ?? ''"
      @close="closeModal"
    >
      <div :class="['modal-content', { v3: zapPool?.poolVersion === 'v3' }, { v2: zapPool?.poolVersion === 'v2' }]">
        <ZapForm
          :zap-pool="zapPool"
          @close-form="closeModal"
        />
      </div>
    </ModalComponent>

    <SuccessZapModal
      :set-show-func="triggerSuccessZapin"
    />
  </div>
</template>

<script lang="ts">
import {
  mapActions,
  mapMutations,
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
  computed: {
    ...mapState('odosData', [
      'showSuccessZapin',
    ]),
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
