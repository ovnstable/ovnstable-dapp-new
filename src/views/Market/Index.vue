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
    const tokenData = computed(() => store.state.tokenData);
    // TODO FIX WHY DOESN'T WORK
    watch(() => route.params.id, async (newId) => {
      if (typeof newId === 'string') {
        await store.dispatch('fetchTokenData', newId);
      } else if (Array.isArray(newId) && newId.length > 0) {
        await store.dispatch('fetchTokenData', newId[0]);
      }
    }, { immediate: true });

    if (!route.params.id) {
      router.push({ name: 'market', params: { id: 'default-market-id' } });
    }

    return {
      tokenData,
    };
  },
});
</script>
