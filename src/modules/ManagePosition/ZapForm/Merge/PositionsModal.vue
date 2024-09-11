<template>
  <ModalComponent
    v-model="showModal"
    type-modal="custom"
    @close="closeModal"
  >
    <div
      class="positions-modal"
    >
      <h1>
        Select position to merge
      </h1>

      <p class="positions-modal__notify">
        Merge is only possible within the same chain and DEX
      </p>

      <div class="divider" />

      <template v-if="positionsList?.length > 0">
        <div
          v-for="(item, key) in positionsList"
          :key="item?.tokenId?.toString()"
          class="positions-modal__item"
        >
          <div
            class="positions-modal__item-content"
            :class="{ 'positions--active': selectedPositions.includes(item?.tokenId?.toString()) }"
            @keypress="selectPos(item)"
            @click="selectPos(item)"
          >
            <div class="positions-row">
              <div class="positions-row">
                <div class="positions-modal__item-imgs">
                  <img
                    alt="token"
                    :src="item.token0Icon"
                  />
                  <img
                    alt="token"
                    :src="item.token1Icon"
                  />
                </div>
                <span class="positions-modal__item-prim">
                  {{ item.name }}
                </span>
                <span class="positions-modal__item-sec">
                  #{{ item.tokenId?.toString() }}
                </span>
              </div>
              <div class="positions-modal__usd-val">
                ${{ getFixedVal(item.position?.usdValue) }}
              </div>
            </div>
            <div
              v-if="item.position?.tokens?.length > 0"
              class="positions-row"
            >
              <div
                v-for="(tokenPos, key) in item.position?.tokens"
                :key="key"
              >
                <div class="positions-row">
                  <img
                    alt="token"
                    :src="(item as any)[`token${key}Icon`]"
                  />
                  <span class="positions-modal__price-prim">
                    {{ getFixedVal(Object.values(tokenPos)[0]) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="key + 1 !== positionsList.length"
            class="divider divider--item"
          />
        </div>
      </template>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from '@/components/Modal/Index.vue';
import type { PropType } from 'vue';
import { getFixedMoney } from '@/utils/numbers.ts';
import type { IPositionsInfo } from '@/types/positions';

export default {
  name: 'SelectTokensModal',
  components: {
    ModalComponent,
  },
  props: {
    positionsList: {
      type: Array as PropType<IPositionsInfo[]>,
      default: () => ([]),
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    selectedPositions: {
      type: Array as PropType<string[]>,
      default: () => ([]),
    },
  },
  emits: ['close', 'position-select'],
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    getFixedVal() {
      return (val: any) => getFixedMoney(val);
    },
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  methods: {
    closeModal() {
      this.$emit('close', false);
    },
    selectPos(pos: IPositionsInfo) {
      this.$emit('position-select', pos);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss"
</style>
