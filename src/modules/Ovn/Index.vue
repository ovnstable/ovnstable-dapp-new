<template>
  <div
    v-if="firstLoad"
    class="ovn__loader"
  >
    <Spinner />
  </div>
  <div
    v-else
    class="ovn-wrapper"
  >
    <div
      class="ovn"
    >
      <OvnInfo
        :token-data="tokenData"
        :loaded="loaded"
      />
      <OvnBenefits v-if="!insuranceIsMobileOvnDashboard && !insuranceIsMobileMintRedeem" />
      <OvnTokenomics v-if="!insuranceIsMobileOvnDashboard && !insuranceIsMobileMintRedeem" />
    </div>
    <div
      v-if="!insuranceIsMobileOvnDashboard && !insuranceIsMobileMintRedeem"
      class="ovn__pools"
    >
      <PoolsContainer
        :pool-type="poolTypes.OVN"
        :is-overview="true"
        class="ovn__pools-inner"
      />
    </div>
  </div>
</template>

<script lang="ts">
import OvnInfo from '@/modules/Ovn/Info.vue';
import OvnBenefits from '@/modules/Ovn/Benefits.vue';
import OvnTokenomics from '@/modules/Ovn/Tokenomics.vue';
import Spinner from '@/components/Spinner/Index.vue';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import PoolsContainer from '@/modules/Main/components/Pools/Index.vue';

export default {
  name: 'OvnPage',
  components: {
    OvnInfo,
    OvnBenefits,
    OvnTokenomics,
    Spinner,
    PoolsContainer,
  },
  props: {
    tokenData: {
      type: Object,
      default: () => ({}),
    },
    firstLoad: {
      type: Boolean,
      required: true,
    },
    loaded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      poolTypes: POOL_TYPES,
    };
  },
  computed: {
    insuranceIsMobileMintRedeem() {
      return this.$store.state.insuranceTokenData.isMobileMintRedeem.value;
    },
    insuranceIsMobileOvnDashboard() {
      return this.$store.state.insuranceTokenData.isMobileOvnDashboard.value;
    },
  },
};

</script>

<style lang="scss" scoped>
.ovn {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid var(--color-1);
  background: var(--color-4);
  padding-top: 40px;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 20px;
  width: 100%;
  [data-theme="dark"] & {
    background: var(--color-17);
    border-color: var(--color-2);
  }
}
.ovn__token-data,
.ovn__graphics,
.ovn__premiums,
.ovn__payout-inner {
  width: 100%;
}

.ovn__graphics {
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.ovn__graphics{
  margin-top: 24px;
  padding: 18px 24px;
  border-radius: 5px;
  border: 1px solid var(--color-1);
}
.ovn__premiums {
  margin-top: 20px;
}
.ovn-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 1500px;
  z-index: 1;
}

.ovn__pools {
  width: 100%;
  background: var(--color-8);
  z-index: -1;
  margin-top: -10px;
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    background-color: var(--color-6);
    color: var(--color-4);
  }
}

.ovn__payout-inner {
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.ovn__loader {
  left: 10px;
  top: 0;
  margin: auto;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, .4);
  [data-theme="dark"] & {
    background-color: var(--color-19);
  }
}

.ovn__pools {
  width: 100%;
  background: var(--color-8);
  z-index: -1;
  margin-top: -10px;
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.ovn__pools-inner {
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

@media (max-width: 1024px) {
  .ovn {
    border-radius: 0 0 30px 30px;
    border: 2px solid var(--color-1);
    border-top: 0;
  }
}

</style>
