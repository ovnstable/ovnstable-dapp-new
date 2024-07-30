<template>
  <div>
    <div
      v-if="zapPool"
      :class="['modal-content', { v3: zapPool?.poolVersion === 'v3' }, { v2: zapPool?.poolVersion === 'v2' }]"
    >
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
  mapGetters,
  mapMutations,
} from 'vuex';
import SuccessZapModal from '@/modules/ModalTemplates/SuccessModal/SuccessZapModal.vue';
import ZapForm from '@/modules/ManagePosition/ZapForm/Index.vue';
import { formatPositionData } from '@/components/Pools/PositionsTable/helpers.ts';

export default {
  name: 'PositionForm',
  components: {
    ZapForm,
    SuccessZapModal,
  },
  data() {
    return {
      zapPool: null as any,
    };
  },
  computed: {
    ...mapGetters('zapinData', [
      'getUserPositions',
    ]),
    ...mapGetters('poolsData', ['allPoolsMap']),
    ...mapGetters('odosData', ['allTokensMap']),
  },
  async mounted() {
    console.log(this.$route, '__zapPool');
    if (this.getUserPositions?.length === 0) return;
    const poolInfo = this.allPoolsMap;
    const tokensList = this.allTokensMap;

    const formatPos = formatPositionData(this.getUserPositions, poolInfo, tokensList);

    const foundPool = formatPos
      .find((_: any) => _?.tokenId?.toString() === this.$route?.params?.id);

    console.log(foundPool, '__foundPool');
    if (foundPool) this.zapPool = foundPool;
  },
  methods: {
    ...mapActions('odosData', [
      'triggerSuccessZapin',
    ]),
    ...mapMutations('zapinData', ['resetStore']),
    closeModal() {
      this.resetStore();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  padding: 20px;
  min-width: 400px;
  background-color: var(--color-4);

  &.v3 {
    width: 100%;
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
