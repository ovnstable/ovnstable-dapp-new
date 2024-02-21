<template>
  <div class="dashboard__graphics">
    <div
      class="dashboard__graphics-APY-graphic"
      v-if="!loaded"
    >
      <div class="graphic__loader">
        <Spinner />
      </div>
    </div>
    <div
      v-else
      class="dashboard__graphics-APY-graphic"
    >
      <DashboardSingleGraphic
        v-if="portfolioBalanceData.length > 0"
        :portfolioBalanceData="portfolioBalanceData"
      />
      <p v-else> no data</p>
    </div>
  </div>
</template>
<script lang="ts">

import DashboardSingleGraphic from '@/modules/Dashboard/DashboardSingleGraphic.vue';
import Spinner from '@/components/Spinner/Index.vue';

export default {
  name: 'DashboardGraphic',
  components: {
    DashboardSingleGraphic,
    Spinner,
  },

  props: {
    loaded: {
      type: Boolean,
      default: false,
    },
    portfolioBalanceData: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
.graphic__loader {
  min-height: 362px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dashboard__graphics {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  background: var(--color-4);
  [data-theme="dark"] & {
      background: var(--color-6);
  }

  > .dashboard__graphics-APY-graphic,
  > .dashboard__graphics-TVL-graphic {
    flex: 1;
  }
}

@media (max-width: 1024px) {
  .dashboard__graphics {
    flex-direction: column;
  }
  .dashboard__graphics-TVL-graphic {
    margin: 0;
    width: 100%;
  }
  .dashboard__graphics-APY-graphic {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .dashboard__graphics {
    flex-direction: column;
  }
  .dashboard__graphics-TVL-graphic {
    margin-top: 50px;
  }
}

</style>
