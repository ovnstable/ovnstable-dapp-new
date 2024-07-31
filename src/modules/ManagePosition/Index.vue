<template>
  <div class="manage-wrap">
    <div class="manage-wrap__title">
      <router-link to="/positions">
        <ButtonComponent btn-styles="grey">
          <BaseIcon name="ArrowLeft" />
          <span>
            BACK
          </span>
        </ButtonComponent>
      </router-link>
      <h1>Manage position</h1>
    </div>

    <div class="manage-wrap__tabs">
      <SwitchTabs
        :tabs="filterTabs"
        :active-tab="activeTab"
        tab-style="white"
        type="large"
        @tab-change="changeTab"
      />
    </div>

    <div
      v-if="!zapPool"
      class="pools-wrap__loader"
    >
      <TableSkeleton />
    </div>
    <div
      v-else-if="activeTab === manageTab.REBALANCE"
      class="manage-wrap__content"
    >
      <RebalanceForm
        :zap-pool="zapPool"
        :active-tab="activeTab"
      />
    </div>
    <div
      v-else-if="activeTab === manageTab.WITHDRAW"
      class="manage-wrap__content"
    >
      <WithdrawForm
        :zap-pool="zapPool"
        :active-tab="activeTab"
      />
    </div>
    <div
      v-else-if="activeTab === manageTab.HARVEST"
      class="manage-wrap__content manage-wrap__content--harvest"
    >
      <HarvestForm
        :zap-pool="zapPool"
        :active-tab="activeTab"
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
} from 'vuex';
import SuccessZapModal from '@/modules/ModalTemplates/SuccessModal/SuccessZapModal.vue';
import RebalanceForm from '@/modules/ManagePosition/ZapForm/Index.vue';
import WithdrawForm from '@/modules/ManagePosition/ZapForm/Withdraw.vue';
import HarvestForm from '@/modules/ManagePosition/ZapForm/Harvest.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import { formatPositionData } from '@/components/Pools/PositionsTable/helpers.ts';

export enum MANAGE_TAB {
  REBALANCE,
  WITHDRAW,
  HARVEST
}

export default {
  name: 'PositionForm',
  components: {
    RebalanceForm,
    HarvestForm,
    WithdrawForm,
    SuccessZapModal,
    ButtonComponent,
    BaseIcon,
    TableSkeleton,
    SwitchTabs,
  },
  data() {
    return {
      zapPool: null as any,
      manageTab: MANAGE_TAB,
      activeTab: MANAGE_TAB.REBALANCE,
      filterTabs: [
        {
          id: MANAGE_TAB.REBALANCE,
          name: 'Rebalance',
        },
        {
          id: MANAGE_TAB.WITHDRAW,
          name: 'Withdraw',
        },
        {
          id: MANAGE_TAB.HARVEST,
          name: 'Harvest',
        },
      ],
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
    ...mapActions('poolsData', ['loadPools']),
    ...mapActions('zapinData', ['loadPositionContract']),
    ...mapActions('odosData', ['loadTokens', 'initData', 'loadChains', 'initContractData']),
    changeTab(id: number) {
      this.activeTab = id;
    },
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
  },
};
</script>

<style lang="scss" scoped>
.manage-wrap__content {
  padding: 20px;
  background-color: var(--color-4);
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border: 2px solid var(--color-1);
}

.manage-wrap__content--harvest {
  max-width: 600px;
  margin: 0 auto;
}

.manage-wrap__tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 40px
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
