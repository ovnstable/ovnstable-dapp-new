<template>
  <div class="steps-row">
    <p
      :class="{
        'active-stage': currentStage === CompoundStep.APPROVE,
        'active-color': isActiveTab(CompoundStep.APPROVE),
      }"
    >
      Approve tokens
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === CompoundStep.CLAIM,
        'active-color': isActiveTab(CompoundStep.CLAIM),
      }"
    >
      CLAIM
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === CompoundStep.UNSTAKE,
        'active-color': isActiveTab(CompoundStep.UNSTAKE),
      }"
    >
      Unstake
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === CompoundStep.APPROVEZAPIN,
        'active-color': isActiveTab(CompoundStep.APPROVEZAPIN),
      }"
    >
      Approve NFT (zap)
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === CompoundStep.INCREASE,
        'active-color': isActiveTab(CompoundStep.INCREASE),
      }"
    >
      Increase
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === CompoundStep.APPROVEGAUGE,
        'active-color': isActiveTab(CompoundStep.APPROVEGAUGE),
      }"
    >
      Approve NFT (gauge)
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === CompoundStep.STAKE,
        'active-color': isActiveTab(CompoundStep.STAKE),
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
import { CompoundStep } from '@/store/modals/waiting-modal.ts';

export default defineComponent({
  name: 'CompoundStepsRow',
  components: {
    BaseIcon,
  },
  props: {
    currentStage: {
      type: Number as PropType<CompoundStep>,
      default: CompoundStep.CLAIM,
    },
  },
  data() {
    return {
      CompoundStep,
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
