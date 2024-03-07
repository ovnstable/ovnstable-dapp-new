<template>
  <div class="steps-row">
    <p
      :class="{
        'active-stage': currentStage === mintRedeemStep.START,
        'active-color': isActiveTab(mintRedeemStep.START),
      }"
    >
      Start
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === mintRedeemStep.APPROVE,
        'active-color': isActiveTab(mintRedeemStep.APPROVE),
      }"
    >
      Approve
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === mintRedeemStep.CONFIRMATION,
        'active-color': isActiveTab(mintRedeemStep.CONFIRMATION),
      }"
    >
      Confirmation
    </p>
  </div>
</template>

<!-- eslint-disable no-unused-vars -->
<script lang="ts">
import { type PropType } from 'vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
// eslint-disable-next-line no-shadow
export enum mintRedeemStep {
  START,
  APPROVE,
  CONFIRMATION,
}

export default {
  name: 'StepsRow',
  components: {
    BaseIcon,
  },
  props: {
    currentStage: {
      type: Number as PropType<mintRedeemStep>,
      default: mintRedeemStep.START,
    },
  },
  data() {
    return {
      mintRedeemStep,
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
