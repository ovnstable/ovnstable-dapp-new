<template>
  <div>
    <div class="pools-table">
      <slot name="filters" />

      <div class="pools-header">
        <div class="pools-header__item">
          Chain
        </div>
        <div class="pools-header__item">
          Pool name
        </div>
        <div
          class="pools-header__item pools-header__item--hover"
          @click="toggleOrderType('TVL')"
          @keypress="toggleOrderType('TVL')"
        >
          TVL
          <BaseIcon :name="iconNameSort()" />
        </div>
        <div class="pools-header__item">
          Platforms
        </div>
        <div class="pools-header__item" />
      </div>

      <div class="pools-table__content">
        <template v-if="pools.length > 0">
          <div
            v-for="(pool, key) in (sortedPools as any)"
            :key="key"
            class="pools-table__row"
          >
            <div class="pools-table__chain">
              <BaseIcon :name="pool.chainName" />
            </div>
            <div class="pools-table__tokens-wrap">
              <div class="pools-table__tokens">
                <div
                  v-if="pool.token0Icon"
                  class="pools-table__tokens-item"
                >
                  <img
                    alt="token"
                    :src="pool.token0Icon"
                  />
                </div>
                <div
                  v-if="pool.token1Icon"
                  class="pools-table__tokens-item"
                >
                  <img
                    alt="token"
                    :src="pool.token1Icon"
                  />
                </div>
              </div>
              <div class="pools-table__details">
                <div class="pools-table__details-row">
                  <div>
                    {{ pool.name }}
                  </div>
                </div>
                <div class="pools-table__tokens-details">
                  {{ poolVolatileType(pool) }}
                </div>
                <div
                  v-if="pool.fee"
                  class="pool-fee"
                >
                  {{ Number(pool.fee) * .0001 }} %
                </div>
              </div>
            </div>
            <div class="pools-table__tvl">
              <div class="pool-table-header-item">
                <div
                  v-if="pool.tvl"
                  class="card-label"
                >
                  {{ getDisplayedTvlValue(pool.tvl) }}
                </div>
                <div
                  v-else
                  class="card-label see-on-dex-label see-on-dex-another"
                >
                  see on platform
                </div>
              </div>
            </div>
            <div class="pools-table__platform-row">
              <a
                :key="key"
                target="_blank"
                rel="noopener noreferrer"
                class="pools-table__platform"
                :href="getPlatformLink(pool, pool.platform[0])"
              >
                <BaseIcon
                  class="pools-table__platform-icon"
                  :name="pool.platform[0]"
                />
                <span>
                  {{ pool.platform[0].toUpperCase() }}
                </span>
                <div class="button-link">
                  <BaseIcon
                    name="LinkExtra"
                  />
                </div>
              </a>
            </div>

            <ButtonComponent
              btn-styles="faded"
              @click="handleZapin(pool)"
            >
              DEPOSIT
            </ButtonComponent>
          </div>
        </template>
        <div
          v-else
          class="pools-table__empty"
        >
          pools not found
        </div>
      </div>

      <div
        v-if="pools.length > 0"
        class="pools-table__footer"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

  <!-- eslint-disable no-param-reassign -->
<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { formatNumberToMln, formatNumberToThousands } from '@/utils/numbers.ts';
import { buildLink, checkIsEveryStable } from '@/store/views/main/pools/helpers.ts';
import { inject, type PropType } from 'vue';
import { ORDER_TYPE } from '@/services/PoolService/utils/poolsSort.ts';
import PoolService from '@/services/PoolService/PoolService.ts';
import type { TPool } from '@/types/common/pools';
import type { IPoolService } from '@/services/PoolService/PoolService';

const getPoolDescStr = (
  isStable: boolean,
) => `${isStable ? 'Stable' : 'Volatile'} pool`;

export default {
  name: 'PoolsTable',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  props: {
    pools: {
      type: [] as PropType<TPool[]>,
      required: true,
    },
    orderType: {
      type: Number as PropType<ORDER_TYPE>,
      required: true,
    },
    setOrderTypeFunc: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const poolService = inject('poolService') as IPoolService;
    return {
      poolService,
    };
  },
  computed: {
    sortedPools() {
      return PoolService.sortPools(this.pools as any, this.orderType, true);
    },
  },
  methods: {
    handleZapin(pool: any) {
      const tokens = pool.name.split('/');
      // if (false) this.openZapIn(pool);
      this.$router.push(`/pools/zapin/${pool.platform[0]?.toLowerCase()}?pair=${pool.address.toLowerCase()}&chain=${pool.chainName}&tokens=${tokens[0]}-${tokens[1]}`);
    },
    poolVolatileType(poolD: any) {
      const isStable = checkIsEveryStable(poolD);
      return getPoolDescStr(isStable);
    },
    getPlatformLink(pool: any, platform: string) {
      return buildLink(pool, platform) ?? '';
    },
    toggleOrderType(type: string) {
      if (type === 'TVL') {
        if (this.orderType !== ORDER_TYPE.TVL) {
          this.setOrderTypeFunc(ORDER_TYPE.TVL);
          this.setOrderTypeFunc(ORDER_TYPE.TVL_UP);
        }

        if (this.orderType === ORDER_TYPE.TVL) {
          this.setOrderTypeFunc(ORDER_TYPE.TVL_UP);
          return;
        }

        if (this.orderType === ORDER_TYPE.TVL_UP) {
          this.setOrderTypeFunc(ORDER_TYPE.TVL_DOWN);
          return;
        }

        if (this.orderType === ORDER_TYPE.TVL_DOWN) {
          this.setOrderTypeFunc(ORDER_TYPE.TVL);
        }
      }
    },
    iconNameSort() {
      if (ORDER_TYPE.TVL_UP === this.orderType) {
        return 'ArrowUpSort';
      } if (ORDER_TYPE.TVL_DOWN === this.orderType) {
        return 'ArrowDownSort';
      }

      return 'ArrowsFilter';
    },
    getDisplayedTvlValue(tvl: string | number) {
      return (Number(tvl) >= 1000000)
        ? `${formatNumberToMln(tvl as number, 2)}M`
        : `${formatNumberToThousands(tvl as number, 0)}K`;
    },
  },
};
</script>

<style lang="scss" src="./stylesNew.scss" scoped />
