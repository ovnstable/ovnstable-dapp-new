import { mapState } from 'vuex';
import { zapInStep } from '@/store/views/main/zapin/index.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import Spinner from '@/components/Spinner/Index.vue';
// import ButtonComponent from '@/components/Button/Index.vue';
import PoolLabel from '@/modules/Main/components/ZapModal/PoolLabel.vue';
import { defineComponent } from 'vue';

const stagesMap: Record<zapInStep, string> = {
  [zapInStep.START]: 'Start',
  [zapInStep.APPROVE_TOKENS]: 'Approve Tokens',
  [zapInStep.DEPOSIT]: 'Deposit',
  [zapInStep.APPROVE_GAUGE]: 'Approve Gauge',
  [zapInStep.STAKE_LP]: 'Stake LP',
};

const getStageName = (stage: number) => zapInStep[stage];

export default defineComponent({
  name: 'ZapinWaitingModal',
  components: {
    Spinner, BaseIcon, /* ButtonComponent, */ PoolLabel,
  },
  data() {
    return {
      zapInStep,
      getStageName,
      // Enum, filtering number keys to get strings
      stageNames: stagesMap,
    };
  },
  computed: {
    ...mapState('zapinData', [
      'currentStage',
      'selectedTokens',
    ]),
    ...mapState('poolsData', [
      'currentZapPool',
      'isZapModalShow',
    ]),
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
