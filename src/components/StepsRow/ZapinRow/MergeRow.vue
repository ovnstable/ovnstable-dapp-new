<template>
  <div class="steps-row">
    <p
      :class="{
        'active-stage': currentStage === mergeStep.WITHDRAWNFT,
        'active-color': isActiveTab(mergeStep.WITHDRAWNFT),
      }"
    >
      Unstake NFTs
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === mergeStep.APPROVENFT,
        'active-color': isActiveTab(mergeStep.APPROVENFT),
      }"
    >
      Approve NFTs (zap)
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === mergeStep.MERGE,
        'active-color': isActiveTab(mergeStep.MERGE),
      }"
    >
      Merge
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === mergeStep.APPROVE_GAUGE,
        'active-color': isActiveTab(mergeStep.APPROVE_GAUGE),
      }"
    >
      Approve NFT (gauge)
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === mergeStep.STAKE_LP,
        'active-color': isActiveTab(mergeStep.STAKE_LP),
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
import { mergeStep } from '@/store/modals/waiting-modal.ts';

export default defineComponent({
  name: 'MergeStepsRow',
  components: {
    BaseIcon,
  },
  props: {
    currentStage: {
      type: Number as PropType<mergeStep>,
      default: mergeStep.WITHDRAWNFT,
    },
  },
  data() {
    return {
      mergeStep,
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
