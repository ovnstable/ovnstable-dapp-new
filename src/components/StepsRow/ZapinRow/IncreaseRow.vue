<template>
  <div class="steps-row">
    <p
      :class="{
        'active-stage': currentStage === IncreaseStep.START,
        'active-color': isActiveTab(IncreaseStep.START),
      }"
    >
      START
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === IncreaseStep.APPROVE,
        'active-color': isActiveTab(IncreaseStep.APPROVE),
      }"
    >
      Approve tokens
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === IncreaseStep.UNSTAKE,
        'active-color': isActiveTab(IncreaseStep.UNSTAKE),
      }"
    >
      Unstake
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === IncreaseStep.APPROVEGAUGE,
        'active-color': isActiveTab(IncreaseStep.APPROVEGAUGE),
      }"
    >
      Approve NFT (gauge)
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === IncreaseStep.INCREASE,
        'active-color': isActiveTab(IncreaseStep.INCREASE),
      }"
    >
      Increase
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === IncreaseStep.STAKE,
        'active-color': isActiveTab(IncreaseStep.STAKE),
      }"
    >
      Stake
    </p>
  </div>
</template>

  <!-- eslint-disable no-unused-vars -->
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export enum IncreaseStep {
  START,
  APPROVE,
  UNSTAKE,
  APPROVEGAUGE,
  INCREASE,
  STAKE,
}

export default defineComponent({
  name: 'IncreaseStepsRow',
  components: {
    BaseIcon,
  },
  props: {
    currentStage: {
      type: Number as PropType<IncreaseStep>,
      default: IncreaseStep.START,
    },
  },
  data() {
    return {
      IncreaseStep,
    };
  },
  computed: {
    isActiveTab() {
      return (stage: number) => this.currentStage > stage;
    },
  },
});
</script>
  <style lang="scss" scoped src='./styles.scss' />
