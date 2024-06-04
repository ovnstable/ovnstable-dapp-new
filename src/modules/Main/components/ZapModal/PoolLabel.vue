<template>
  <div
    v-if="pool"
    class="zap-header"
  >
    <div class="zap-header__content">
      <BaseIcon :name="pool.chainName" />
      <div class="zap-header__col">
        <span
          :class="isShort ? 'short-title platform-name-short' : ''"
          class="platform-name pt-1"
        >
          {{pool.name}}
        </span>
        <div>
          <img
            v-if="pool.token0Icon"
            :class="isShort ? 'icon-short' : ''"
            :src="pool.token0Icon"
            alt="token"
          />
          <img
            v-if="pool.token1Icon"
            :class="isShort ? 'icon-short' : ''"
            :src="pool.token1Icon"
            alt="token"
          />
        </div>
      </div>
      <div class="zap-header__col">
        <span
          :class="isShort ? 'pool-detail-title-short' : ''"
          class="pool-detail-title"
        >
          {{ pool.platform[0] }}
        </span>
        <BaseIcon :name="pool.platform[0]" />
      </div>
      <div class="zap-header__col">
        <div
          :class="isShort ? 'pool-detail-title-short' : ''"
          class="pool-detail-title"
        >
          <span v-if="pool.platform[0] === 'Beefy'">
            APY
          </span>
          <span v-else>
            APR
          </span>
        </div>
        <div
          :class="isShort ? 'pool-detail-item-short' : ''"
          class="pool-detail-item"
        >
          <span v-if="pool.apr < 10000">
            {{formatMoney(pool.apr, 2)}}%
          </span>
          <span v-else>
            {{formatNumberToThousands(pool.apr, 0)}}K %
          </span>
        </div>
      </div>
      <div class="zap-header__col">
        <span
          :class="isShort ? 'pool-detail-title-short' : ''"
          class="pool-detail-title"
        >
          TVL
        </span>
        <span
          v-if="pool.tvl >= 1000000"
          :class="isShort ? 'pool-detail-item-short' : ''"
          class="pool-detail-item"
        >
          {{('$' + formatNumberToMln(pool.tvl, 0))}}M
        </span>
        <span
          v-if="pool.tvl < 1000000"
          :class="isShort ? 'pool-detail-item-short' : ''"
          class="pool-detail-item"
        >
          ${{ formatNumberToThousands(pool.tvl, 0)}}K
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { formatMoney, formatNumberToThousands, formatNumberToMln } from '@/utils/numbers.ts';

export default {
  name: 'PoolLabel',
  components: {
    BaseIcon,
  },
  props: {
    pool: {
      type: Object,
      required: true,
    },
    isShort: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    ...mapGetters('network', ['getParams', 'networkColor']),
  },
  methods: {
    formatMoney,
    formatNumberToMln,
    formatNumberToThousands,
  },
};
</script>

<style lang="scss" scoped>
.zap-header {
  border-radius: 12px;
  margin-bottom: 10px;
  background-color: var(--color-5);

  svg, img {
    width: 32px;
    height: 32px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-1)
  }
}

.zap-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
}

.zap-header__row {
  display: flex;
}

.zap-header__col {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 8px;
}
@media (max-width: 640px) {
  .zap-header__col {
    font-size: 12px;
  }
}
</style>
