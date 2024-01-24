<template>
  <MarketPage :token-data="tokenData" />
</template>

<script lang="ts">
import { defineComponent, watch, computed } from 'vue';
import MarketPage from '@/modules/Market/Index.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'MarketView',
  components: {
    MarketPage,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const tokenData = computed(() => {
      const marketId = route.params.id;
      console.log(marketId);
      console.log(store.state.tokenData.tokenData);
      return store.state.tokenData.tokenData || {};
    });

    watch(
      () => route.params.id,
      async (newId) => {
        const marketId = Array.isArray(newId) ? newId[0] : newId;
        if (typeof marketId === 'string') {
          await store.dispatch('tokenData/fetchTokenData', marketId);
        }
      },
      { immediate: true },
    );
    if (!route.params.id) {
      router.push({ name: 'market', params: { id: 'default-market-id' } });
    }

    return {
      tokenData,
    };
  },
});
</script>
