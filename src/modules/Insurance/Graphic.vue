<template>
  <div class="insurance__graphics">
    <div
      class="insurance__graphics-APY-graphic"
      v-if="!loaded"
    >
      <div class="graphic__loader">
        <Spinner />
      </div>
    </div>
    <div
      class="insurance__graphics-APY-graphic"
      v-else
    >
      <GraphicComponent
        :graphicData="reversedPayoutData"
        :accumulatorDay="payoutData.accumulatorDay"
        :accumulatorWeek="payoutData.accumulatorWeek"
        :accumulatorMonth="payoutData.accumulatorMonth"
      />
    </div>
  </div>
</template>
<script lang="ts">

import GraphicComponent from '@/modules/Insurance/SingleStatisticGraphic.vue';
import Spinner from '@/components/Spinner/Index.vue';

export default {
  name: 'GraphicsInsurance',
  components: {
    GraphicComponent,
    Spinner,
  },
  data() {
    return {
      accumulatorDay: 0,
      accumulatorWeek: 0,
      accumulatorMonth: 0,
    };
  },
  computed: {
    reversedPayoutData() {
      return [...this.payoutData.payouts].reverse();
    },
  },
  props: {
    loaded: {
      type: Boolean,
      default: false,
    },
    payoutData: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
.graphic__loader {
  min-height: 416px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.insurance__graphics {
  min-height: 416px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  background: var(--color-4);
  [data-theme="dark"] & {
      background: var(--color-6);
  }

  > .insurance__graphics-APY-graphic,
  > .insurance__graphics-TVL-graphic {
    flex: 1;
  }
}

@media (max-width: 1024px) {
  .insurance__graphics {
    flex-direction: column;
    min-height: 0;
  }
  .insurance__graphics-TVL-graphic {
    margin: 0;
    width: 100%;
  }
  .insurance__graphics-APY-graphic {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .insurance__graphics {
    min-height: 0;
    flex-direction: column;
  }
  .insurance__graphics-TVL-graphic {
    margin-top: 50px;
  }
}
@media (max-width: 640px) {
  .insurance__graphics {
    min-height: 0;
  }
}

</style>
