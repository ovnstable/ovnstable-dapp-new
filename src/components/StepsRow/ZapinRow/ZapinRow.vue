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
      v-if="version === 'V3'"
      :class="{
        'active-stage': currentStage === zapInStep.DEPOSIT,
        'active-color': isActiveTab(zapInStep.DEPOSIT),
      }"
    >
      Deposit
    </p>
    <BaseIcon
      v-if="version === 'V3'"
      name="InsuranceModalArrowRight"
    />
    <p
      v-if="version === 'V3' && showStaking"
      :class="{
        'active-stage': currentStage === zapInStep.APPROVE_GAUGE,
        'active-color': isActiveTab(zapInStep.APPROVE_GAUGE),
      }"
    >
      Approve Gauge
    </p>
    <BaseIcon
      v-if="version === 'V3' && showStaking"
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
import { defineComponent, type PropType } from 'vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { zapInStep } from '@/store/views/main/zapin/index.ts';

export default defineComponent({
  name: 'ZapInStepsRow',
  components: {
    BaseIcon,
  },
  props: {
    version: {
      type: String,
      default: '1W',
    },
    type: {
      type: Object,
      default: () => {},
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
    showStaking() {
      return this.type?.type !== 'LP_WITH_STAKE_IN_ONE_STEP';
    },
    isActiveTab() {
      return (stage: number) => this.currentStage > stage;
    },
  },
});
</script>
<style lang="scss" scoped src='./styles.scss' />
