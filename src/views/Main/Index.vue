<template>
  <div class="main-module">
    <MainModule />
    <PoolsContainer :type="'ALL'" />

    <WaitingModal :show-modal="showWaitModal" />
    <ErrorModal :show-modal="showErrorModal" />
    <SuccessModal :show-modal="showSuccessModal" />
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import MainModule from '@/modules/Main/Index.vue';
import PoolsContainer from '@/modules/Main/components/PoolsTable/Index.vue';
import WaitingModal from '@/modules/ModalTemplates/WaitingModal/Index.vue';
import ErrorModal from '@/modules/ModalTemplates/ErrorModal/Index.vue';
import SuccessModal from '@/modules/ModalTemplates/SuccessModal/Index.vue';

export default {
  name: 'MainView',
  components: {
    MainModule,
    PoolsContainer,
    ErrorModal,
    WaitingModal,
    SuccessModal,
  },
  computed: {
    ...mapGetters('waitingModal', { showWaitModal: 'show' }),
    ...mapGetters('errorModal', { showErrorModal: 'show' }),
    ...mapGetters('successModal', { showSuccessModal: 'show' }),
  },
};
</script>

<style>
.main-module {
  width: 100%;
}
</style>
