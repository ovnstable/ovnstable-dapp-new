<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div class="modal-content">
      <ZapForm
        :zap-pool="zapPool"
        :type-of-pool="typeOfPool"
      />
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from '@/components/Modal/Index.vue';
import ZapForm from '@/modules/Main/components/ZapModal/ZapForm/Index.vue';

export default {
  name: 'ZapModal',
  components: {
    ZapForm,
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
    typeOfPool: { // OVN or ALL
      type: String,
      required: true,
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
  methods: {
    closeModal() {
      this.$emit('toggle-modal');
    },
  },
};
</script>

<style scoped>
.modal-content {
  padding: 24px;
  min-width: 600px;
  max-width: 600px;
}
</style>
