<template>
  <div class="steps-row">
    <p
      :class="{
        'active-stage': currentStage === rebalanceStep.UNSTAKE,
        'active-color': isActiveTab(rebalanceStep.UNSTAKE),
      }"
    >
      Unstake
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === rebalanceStep.APPROVE,
        'active-color': isActiveTab(rebalanceStep.APPROVE),
      }"
    >
      Approve NFT (zap)
    </p>
    <BaseIcon name="InsuranceModalArrowRight" />
    <p
      :class="{
        'active-stage': currentStage === rebalanceStep.REBALANCE,
        'active-color': isActiveTab(rebalanceStep.REBALANCE),
      }"
    >
      Rebalance
    </p>
    <template v-if="!skipStake">
      <BaseIcon name="InsuranceModalArrowRight" />
      <p
        :class="{
          'active-stage': currentStage === rebalanceStep.APPROVEGAUGE,
          'active-color': isActiveTab(rebalanceStep.APPROVEGAUGE),
        }"
      >
        Approve NFT (gauge)
      </p>
      <BaseIcon name="InsuranceModalArrowRight" />
      <p
        :class="{
          'active-stage': currentStage === rebalanceStep.STAKE,
          'active-color': isActiveTab(rebalanceStep.STAKE),
        }"
      >
        Stake
      </p>
    </template>
  </div>
</template>

<!-- eslint-disable no-unused-vars -->
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { rebalanceStep } from '@/store/modals/waiting-modal.ts';

export default defineComponent({
  name: 'RebalanceStepsRow',
  components: {
    BaseIcon,
  },
  props: {
    skipStake: {
      type: Boolean,
      default: false,
    },
    currentStage: {
      type: Number as PropType<rebalanceStep>,
      default: rebalanceStep.UNSTAKE,
    },
  },
  data() {
    return {
      rebalanceStep,
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
