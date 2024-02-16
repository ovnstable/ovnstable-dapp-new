<template>
  <div
    v-if="pool"
    :style="'background: linear-gradient(57.78deg, ' + getParams(pool.chain).networkColor + ' -94.19%, transparent 57.68%);'"
    :class="isShort ? 'pool-label-container-short' : ''"
    class="zap-header"
  >
    <div class="zap-header__content">
      <BaseIcon :name="pool.chainName" />
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
      <div class="zap-header__col">
        <div
          :class="isShort ? 'short-title platform-name-short' : ''"
          class="platform-name pt-1"
        >
          {{pool.name}}
        </div>
        <div
          :class="isShort ? 'short-title' : ''"
          class="platform-label-container"
        >
          <div class="platform-label">
            {{pool.platform ? pool.platform.toUpperCase() : '-'}}
          </div>
        </div>
      </div>
      <div class="zap-header__col">
        <div
          :class="isShort ? 'pool-detail-title-short' : ''"
          class="pool-detail-title"
        >
          <span v-if="pool.platform === 'Beefy'">
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
        <div
          :class="isShort ? 'pool-detail-title-short' : ''"
          class="pool-detail-title"
        >
          TVL
        </div>
        <div
          v-if="pool.tvl >= 1000000"
          :class="isShort ? 'pool-detail-item-short' : ''"
          class="pool-detail-item"
        >
          {{('$' + formatNumberToMln(pool.tvl, 0))}}M
        </div>
        <div
          v-if="pool.tvl < 1000000"
          :class="isShort ? 'pool-detail-item-short' : ''"
          class="pool-detail-item"
        >
          ${{ formatNumberToThousands(pool.tvl, 0)}}K
        </div>
      </div>
      <div class="zap-header__col">
        <div
          :class="isShort ? 'pool-detail-title-short' : ''"
          class="pool-detail-title"
        >
          Staking
        </div>
        <BaseIcon :name="pool.platform" />
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

  svg, img {
    width: 32px;
    height: 32px;
  }
}

.zap-header__content {
  display: flex;
  justify-content: space-between;
  padding: 12px;
}

.zap-header__row {
  display: flex;
}

.zap-header__col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
