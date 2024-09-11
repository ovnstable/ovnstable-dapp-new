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
import { formatMoney, getFixed } from '@/utils/numbers.ts';
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
      return (val: any) => formatMoney(val, getFixed(val));
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

<style scoped lang="scss">
.positions-modal {
  min-width: 500px;
  padding: 15px 30px 30px 30px;

  h1 {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-1);
    margin-bottom: 22px;
    text-transform: uppercase;
  }

  img {
    width: 30px;
    height: 30px;
  }

}

.positions-modal__item-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color .2s ease;

  &:hover {
    background-color: var(--color-5);
  }
}

.positions--active {
  background-color: var(--color-5);
}

.positions-modal__usd-val {
  color: var(--color-3);
  font-weight: 600;
  font-size: 20px;
  margin-left: auto;
}

.positions-modal__notify {
  color: var(--color-12);
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 22px;
}

.divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-7);
  margin-bottom: 22px;
}

.divider--item {
  margin-top: 22px
}

.positions-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.positions-modal__item-imgs {
  display: flex;

  img:last-child {
    position: relative;
    right: 8px;
  }
}

.positions-modal__item-prim {
  font-size: 20px;
  font-weight: 500;
  color: var(--color-1);
}

.positions-modal__price-prim {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-1);
}

.positions-modal__item-sec {
  font-size: 16px;
  color: var(--color-2);
}

.positions-modal__price-sec {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-2);
}

</style>
