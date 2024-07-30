<template>
  <div class="manage-wrap">
    <div class="manage-wrap__title">
      <ButtonComponent btn-styles="grey">
        <BaseIcon name="ArrowLeft" />
        <span>
          BACK
        </span>
      </ButtonComponent>
      <h1>Manage position</h1>
    </div>
    <div
      v-if="!zapPool"
      class="pools-wrap__loader"
    >
      <TableSkeleton />
    </div>
    <div
      v-else
      class="manage-wrap__content"
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
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import { formatPositionData } from '@/components/Pools/PositionsTable/helpers.ts';

export default {
  name: 'PositionForm',
  components: {
    ZapForm,
    SuccessZapModal,
    ButtonComponent,
    BaseIcon,
    TableSkeleton,
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
    ...mapGetters('accountData', ['account']),
  },
  async mounted() {
    console.log(this.$route, '__zapPool');
    if (this.getUserPositions?.length === 0) this.init();
    else this.searchPool();
  },
  methods: {
    ...mapActions('odosData', [
      'triggerSuccessZapin',
    ]),
    ...mapMutations('zapinData', ['resetStore']),
    ...mapActions('poolsData', ['loadPools']),
    ...mapActions('zapinData', ['loadPositionContract']),
    ...mapActions('odosData', ['loadTokens', 'initData', 'loadChains', 'initContractData']),
    searchPool() {
      const poolInfo = this.allPoolsMap;
      const tokensList = this.allTokensMap;

      console.log(this.getUserPositions, '__foundPool1');
      const formatPos = formatPositionData(this.getUserPositions, poolInfo, tokensList);

      const foundPool = formatPos
        .find((_: any) => _?.tokenId?.toString() === this.$route?.params?.id);

      if (foundPool) this.zapPool = foundPool;
    },
    async init() {
      this.$store.commit('odosData/changeState', {
        field: 'isTokensLoadedAndFiltered',
        val: false,
      });
      await this.loadPools();
      await this.loadTokens();
      await this.loadChains();
      await this.initContractData();
      await this.initData();
      await this.loadPositionContract(this.account);
      this.$store.commit('odosData/changeState', {
        field: 'isTokensLoadedAndFiltered',
        val: true,
      });

      this.searchPool();
    },
    closeModal() {
      this.resetStore();
    },
  },
};
</script>

<style lang="scss" scoped>
.manage-wrap__content {
  padding: 20px;
  min-width: 400px;
  background-color: var(--color-4);
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border: 2px solid var(--color-1);
}

.manage-wrap__title {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  color: var(--color-1);

  h1 {
    font-size: 28px;
    font-weight: 700;
  }

  span {
    margin-left: 8px;
  }
}
</style>
