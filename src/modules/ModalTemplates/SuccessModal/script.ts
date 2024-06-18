import ModalComponent from '@/components/Modal/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import PoolLabel from '@/modules/Main/components/ZapModal/PoolLabel.vue';
import { mapGetters } from 'vuex';
import { formatMoney } from '@/utils/numbers.ts';
import { defineComponent, type PropType } from 'vue';
import {
  mapEventTokenData, mapInputTokenData, getPlatformLink, type TFormatTokenInfo, type TTokenDataList,
} from './helpers.ts';

export default defineComponent({
  name: 'SuccessZapModal',
  components: {
    ModalComponent,
    ButtonComponent,
    PoolLabel,
    BaseIcon,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    setShowFunc: {
      type: Function,
      required: true,
    },
    successData: {
      type: Object,
      required: true,
    },
    returnedToUser: {
      type: Object as PropType<TTokenDataList>,
      required: true,
    },
    putIntoPool: {
      type: Object as PropType<TTokenDataList>,
      required: true,
    },
    inputTokens: {
      type: Object as PropType<TTokenDataList>,
      required: true,
    },
  },
  data() {
    return {
      tokensSentList: [] as TFormatTokenInfo[],
      tokensReturnedList: [] as TFormatTokenInfo[],
      tokensStakedList: [] as TFormatTokenInfo[],
      showModal: false,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
    successData(val) {
      if (val) {
        this.initStakedList();
        this.initReturnedList();
        this.initSentList();
      }
    },
  },
  mounted() {
    this.initReturnedList();
    this.initStakedList();
    this.initSentList();
  },
  computed: {
    ...mapGetters('network', ['getParams']),
    ...mapGetters('odosData', ['allTokensMap']),
    openPositionOnPool(): string {
      // eslint-disable-next-line prefer-destructuring
      const pool = this.successData.pool;
      if (pool.address || pool.platform[0]) return getPlatformLink(pool.platform[0], pool.address);
      return '';
    },
    openOnExplorer() {
      const { explorerUrl } = this.getParams(this.successData.chain);
      return `${explorerUrl}tx/${this.successData.hash}`;
    },
  },
  methods: {
    formatMoney,
    closeModal() {
      this.setShowFunc({ isShow: false });
    },
    // Comes from values computed locally befor tx
    initSentList() {
      if (this.successData?.inputTokens?.length > 0) {
        this.tokensSentList = mapInputTokenData(
          this.successData.inputTokens,
        );
      }
    },
    // Comes from contract event log
    initReturnedList(): void {
      if (this.returnedToUser?.amounts) {
        this.tokensReturnedList = mapEventTokenData(
          this.returnedToUser,
          this.allTokensMap,
        );
      }
    },
    // Comes from contract event log
    initStakedList(): void {
      if (this.putIntoPool?.amounts) {
        this.tokensStakedList = mapEventTokenData(
          this.putIntoPool,
          this.allTokensMap,
        );
      }
    },
  },
});
