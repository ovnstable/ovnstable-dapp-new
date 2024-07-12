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
      :is-show="showSuccessZapin"
      :success-data="successData"
      :set-show-func="triggerSuccessZapin"
      :returned-to-user="lastParsedReturnedToUserEvent"
      :put-into-pool="lastParsedPutIntoPoolEvent"
      :input-tokens="lastParsedInputTokensEvent"
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
import SuccessZapModal from '@/modules/ModalTemplates/SuccessModal/SuccessZapModal.vue';
import ZapForm from '@/modules/PoolsPositions/ZapModal/ZapForm/Index.vue';

export default {
  name: 'PositionModal',
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
      'successData',
      'showSuccessZapin',
      'lastParsedReturnedToUserEvent',
      'lastParsedPutIntoPoolEvent',
      'lastParsedInputTokensEvent',
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
  min-width: 400px;
  max-width: 400px;

  &.v3 {
    width: 100vw;
    max-width: 70vw;
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
