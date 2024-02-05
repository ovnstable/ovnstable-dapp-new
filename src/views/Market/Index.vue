<template>
  <div>
    <div
      v-if="isLoading"
    >
      <ModalComponent
        :modelValue="showModal"
        :show-close="false"
        type-modal="custom"
      >
        <div class="modal-content">
          <div class="modal-content__spin">
            <Spinner size="90px" />
          </div>
          <h1>Waiting for loading page data</h1>
          <div class="divider" />

          <div class="modal-content__tips">
            <Carousel />
          </div>

        </div>
      </ModalComponent>
    </div>
    <MarketPage
      v-if="!isLoading"
      :token-data="tokenData"
      :portfolio-data="portfolioData"
      :collateral-data="collateralData"
      :payout-data="payoutData"
    />
  </div>
</template>

<script lang="ts">

import {
  defineComponent, watch, computed, ref,
} from 'vue';
import ModalComponent from '@/components/Modal/Index.vue';
import Carousel from '@/modules/ModalTemplates/components/Carousel.vue';
import Spinner from '@/components/Spinner/Index.vue';
import MarketPage from '@/modules/Market/Index.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'MarketView',
  components: {
    MarketPage,
    ModalComponent,
    Carousel,
    Spinner,
  },
  props: {
    showModal: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const tokenData = computed(() => store.state.tokenData.tokenData || {});
    const portfolioData = computed(() => store.state.portfolioData.portfolioData || {});
    const collateralData = computed(() => store.state.collateralData.collateralData || {});
    const payoutData = computed(() => store.state.payoutData.payoutData || {});

    const isLoading = ref(false);

    watch(
      [() => route.params.id, () => store.state.network.networkName],
      async ([newId, newNetworkName]) => {
        const marketId = Array.isArray(newId) ? newId[0] : newId;

        if (typeof marketId === 'string' && newNetworkName) {
          isLoading.value = true;

          try {
            await store.dispatch('tokenData/fetchTokenData', { marketId, networkName: newNetworkName });
            await store.dispatch('portfolioData/fetchPortfolioData', { marketId, networkName: newNetworkName });
            await store.dispatch('collateralData/fetchCollateralData', { marketId, networkName: newNetworkName });
            await store.dispatch('payoutData/fetchPayoutData', { marketId, networkName: newNetworkName });
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            isLoading.value = false;
          }
        }
      },
      { immediate: true },
    );

    if (!route.params.id) {
      router.push({ name: 'market', params: { id: 'usd' } });
    }

    return {
      tokenData,
      portfolioData,
      collateralData,
      payoutData,
      isLoading,
    };
  },
});
</script>

<style>
.modal-content {
  padding: 50px 70px 30px 70px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-1);
    margin-bottom: 20px;
    text-align: center;
  }
}

.modal-content__spin {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.modal-content__confirm {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-2);
  margin-bottom: 40px;
  text-align: center;
}

.divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-7);
}

.modal-content__tips {
  margin-top: 40px;
}
</style>
