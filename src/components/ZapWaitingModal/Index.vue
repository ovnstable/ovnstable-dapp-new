<!-- eslint-disable vuejs-accessibility/anchor-has-content -->
<template>
  <div class="zap-waiting-content">
    <h1>Transactions</h1>
    <PoolLabel
      v-if="currentZapPool?.address"
      :pool="currentZapPool"
    />
    <div class="stages-container">
      <div
        v-for="(stageName, index) in stageNames"
        :key="index"
        class="stage-row"
      >
        <div class="stage-row-item">
          <div
            v-if="isNextStage(index)"
            class="icon-container"
          >
            <BaseIcon
              class="modal-content__icon"
              name="Clock"
            />
          </div>
          <div
            v-else-if="isCurrentStage(index)"
            class="icon-container"
          >
            <Spinner
              size="30px"
            />
          </div>
          <div
            v-else-if="isPastStage(index)"
            class="icon-container"
          >
            <BaseIcon
              class="modal-content__icon"
              name="CommonSuccess"
            />
          </div>
          <div class="data-container">
            <div>
              {{ stageName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import Spinner from '@/components/Spinner/Index.vue';
import PoolLabel from '@/modules/Main/components/ZapModal/PoolLabel.vue';
import { defineComponent, type PropType } from 'vue';
import {
  type zapInStep, type rebalanceStep, type withdrawStep, ZAPIN_MAP,
} from '@/store/modals/waiting-modal.ts';

export default defineComponent({
  name: 'ZapinWaitingModal',
  components: {
    Spinner,
    BaseIcon,
    PoolLabel,
  },
  props: {
    stageMap: {
      type: Object as PropType<Record<zapInStep | rebalanceStep | withdrawStep, string>>,
      default: ZAPIN_MAP,
    },
  },
  data() {
    return {
      // Enum, filtering number keys to get strings
      stageNames: this.stageMap,
    };
  },
  computed: {
    ...mapState('zapinData', [
      'currentStage',
    ]),
    ...mapState('poolsData', [
      'currentZapPool',
    ]),
  },
  watch: {
    stageMap(val) {
      console.log(val, '_VALL');
      this.stageNames = val;
    },
  },
  methods: {
    isPastStage(stage: number) {
      return stage < this.currentStage;
    },
    isCurrentStage(stage: number) {
      // todo: fix in state
      // eslint-disable-next-line eqeqeq
      return stage == this.currentStage;
    },
    isNextStage(stage: number) {
      return stage > this.currentStage;
    },
  },
});
</script>
<style lang="scss" scoped src="./styles.scss" />
