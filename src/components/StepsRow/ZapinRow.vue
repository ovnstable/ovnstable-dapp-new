<template>
  <div class="steps-row">
    <p
      :class="{
        'active-stage': currentStage === zapInStep.START,
        'active-color': isActiveTab(zapInStep.START),
      }"
    >
      Start
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === zapInStep.APPROVE_TOKENS,
        'active-color': isActiveTab(zapInStep.APPROVE_TOKENS),
      }"
    >
      Approve tokens
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      v-if="typeOfZapIn === 'V3'"
      :class="{
        'active-stage': currentStage === zapInStep.DEPOSIT,
        'active-color': isActiveTab(zapInStep.DEPOSIT),
      }"
    >
      Deposit
    </p>
    <BaseIcon
      v-if="typeOfZapIn === 'V3'"
      name="InsuranceModalArrowRight"
    />
    <p
      v-if="typeOfZapIn === 'V3'"
      :class="{
        'active-stage': currentStage === zapInStep.APPROVE_GAUGE,
        'active-color': isActiveTab(zapInStep.APPROVE_GAUGE),
      }"
    >
      Approve Gauge
    </p>
    <BaseIcon
      v-if="typeOfZapIn === 'V3'"
      name="InsuranceModalArrowRight"
    />
    <p
      :class="{
        'active-stage': currentStage === zapInStep.STAKE_LP,
        'active-color': isActiveTab(zapInStep.STAKE_LP),
      }"
    >
      Stake LP
    </p>
  </div>
</template>

<!-- eslint-disable no-unused-vars -->
<script lang="ts">
import { type PropType } from 'vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
// eslint-disable-next-line no-shadow
export enum zapInStep {
  START,
  APPROVE_TOKENS,
  DEPOSIT,
  APPROVE_GAUGE,
  STAKE_LP
}

export default {
  name: 'ZapInStepsRow',
  components: {
    BaseIcon,
  },
  props: {
    typeOfZapIn: {
      type: String,
      default: '1W',
    },
    currentStage: {
      type: Number as PropType<zapInStep>,
      default: zapInStep.START,
    },
  },
  data() {
    return {
      zapInStep,
    };
  },
  computed: {
    isActiveTab() {
      return (stage: number) => this.currentStage > stage;
    },
  },
};
</script>

<style lang="scss" scoped>
.steps-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: var(--color-7);
  padding: 0 20px;

  [data-theme="dark"] & {
    color: var(--color-18);
  }

  .active-color {
    color: var(--color-1);
  }

  .active-stage {
    text-decoration: underline;
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}
</style>
