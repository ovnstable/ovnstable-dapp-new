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
