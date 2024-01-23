<template>
  <div class="performance__token-data">
    <BaseIcon
      name="ETH+_token-data"
      class="performance__token-data-main-token"
    />
    <div class="performance__token-data__link-title">
      <p class="performance__token-data__title token">{{tokenName}}</p>
      <a
        :href=tokenLink
        target="_blank"
        rel="noopener noreferrer"
        aria-label="token-address"
        class="performance__token-data__link-address link-ovn"
      >Token address</a>
    </div>
    <p class="performance__token-data__description">{{ tokenDescription }}</p>
    <div class="performance__divider" />
    <div class="performance__payout-data">
      <p class="performance__token-data__title">Last payout</p>
      <p class="performance__token-data__number payout-ago">{{ payoutAgo }}</p>
      <p class="performance__token-data__hours">{{ hoursAgo }}</p>
    </div>
    <div class="performance__divider" />
    <div class="performance__apy-data">
      <p class="performance__token-data__title">Daily APY</p>
      <div class="performance__apy-data__chain">
        <p class="performance__token-data__number apy-number">{{ dailyAPY }}%</p>
        <div
          class="performance__icon-chain"
        >
          <BaseIcon
            :name=chainIcon
          />
        </div>

      </div>
    </div>
    <div class="performance__divider" />
    <div class="performance__tvl-data">
      <p class="performance__token-data__title">{{ tokenName }} TVL</p>
      <p class="performance__token-data__number">{{ totalTVL }} <span class="performance__token-data__collateral-token">{{ collateralToken }}</span></p>
      <p class="performance__token-data__hours">past 2 hours</p>
    </div>
    <div class="performance__divider last-divider" />
  </div>

  <div class="performance__chain-data">
    <BaseIcon
      :name=chainIcon
      class="performance__icon-chain-bottom"
    />
    <p class="performance__chain-data-name">{{ chainName }}</p>
  </div>
</template>
<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  components: {
    BaseIcon,
  },
  props: {
    tokenName: {
      type: String,
      default: 'ETH+',
    },
    tokenLink: {
      type: String,
      default: 'https://arbiscan.io/address/0xD4939D69B31fbE981ed6904A3aF43Ee1dc777Aab',
    },
    tokenDescription: {
      type: String,
      default: 'ETH+ is the equivalent of USD+, pegged to WETH 1:1, instantly mintable and redeemable in WETH. 100% collateralized with delta-neutral and other strategies based on the best protocols',
    },
    payoutAgo: {
      type: String,
      default: '05:02',
    },
    hoursAgo: {
      type: String,
      default: 'hours ago',
    },
    dailyAPY: {
      type: Number,
      default: 11.9,
    },
    chainIcon: {
      type: String,
      default: 'IconArbitrum',
    },
    totalTVL: {
      type: Number,
      default: 123.631341,
    },
    collateralToken: {
      type: String,
      default: 'WETH',
    },
    chainName: {
      type: String,
      default: 'Arbitrum',
    },
  },

  name: 'TokenDataPerformance',
};
</script>

<style scoped>
  .performance__token-data {
    display:flex;
    flex-direction: row;
<<<<<<< HEAD:src/modules/Main/components/Market/TokenData.vue
    justify-content: space-between;
    background: var(--color-4);
    width: 100%;
=======
    align-self: flex-start;
    justify-content: center;
    background: var(--color-4);
    max-width: calc(100% - 40px);
  }

  .performance__icon-token {
    width: 90px;
    height: 90px;
>>>>>>> 90985c8a1fbbe7aa8b264fbd315093abd93c3d2d:src/modules/Main/components/Performance/TokenData.vue
  }

  .performance__token-data__link-title {
    display:flex;
    flex-direction: column;
    margin-left: 20px;
  }
  .performance__token-data__title {
    text-align: left;
    color: var(--color-2);
    font-size: 15px;
    font-weight: 500;
  }
  .token {
    color: var(--color-1);
    font-size: 22px;
    font-weight: 600;
  }
  .performance__token-data__link-address {
    margin-top: 10px;
    min-width: 79px;
    color: var(--color-2);
    font-size: 12px;
    font-weight: 600;
<<<<<<< HEAD:src/modules/Main/components/Market/TokenData.vue
=======
    text-decoration-line: underline;
  }
  .performance__token-data__link-address:hover {
    color: var(--color-3);
>>>>>>> 90985c8a1fbbe7aa8b264fbd315093abd93c3d2d:src/modules/Main/components/Performance/TokenData.vue
  }
  .performance__token-data__description {
    margin-left: 30px;
    color: var(--color-2);
    text-align: justify;
    font-size: 12px;
    font-weight: 400;
    max-width: 186px;
    line-height: 1.1;
  }

  .performance__divider {
<<<<<<< HEAD:src/modules/Main/components/Market/TokenData.vue
    margin-left: 30px;
    margin-right: 30px;
    border: 1px solid var(--color-7);
  }

  .last-divider {
     margin-right: 0;
=======
    margin-left: 40px;
    margin-right: 40px;
    border: 1px solid var(--color-7);
>>>>>>> 90985c8a1fbbe7aa8b264fbd315093abd93c3d2d:src/modules/Main/components/Performance/TokenData.vue
  }

  .performance__payout-data,
  .performance__apy-data,
  .performance__tvl-data {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .performance__token-data__number,
  .performance__token-data__collateral-token {
    color: var(--color-1);
    font-size: 20px;
    font-weight: 500;
  }

  .performance__token-data__number {
    margin-top: 20px;
    text-align: center;
  }
  .apy-number {
     margin-top: 0px;
  }
  .performance__apy-data__chain {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;

  }
  .performance__icon-chain {
    margin-left: 10px;
  }

  .performance__token-data__hours {
    color: var(--color-1);
    font-size: 15px;
    font-weight: 500;
  }

  .performance__chain-data {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 30px;
    border: 1px solid var(--color-6);
    background: var(--color-4);
    padding: 5px 10px;
    margin-top: 24px;
    width: fit-content;
  }

  .performance__chain-data-name {
    margin-left: 7px;
    font-weight: 500;
    font-size: 13px;
    color: var(--color-1)
  }

  .performance__icon-chain-bottom {
    width: 20px;
    height: 20px;
    flex-shrink: 0
  }

  @media (max-width: 1024px) {
    .performance__token-data-main-token {
      scale: 65%;
    }
    .performance__token-data__collateral-token {
      margin-left: 2px;
    }
    .performance__token-data__description {
      margin-left: 5px;
      max-width: 150px;
    }
    .performance__token-data__link-title {
      margin-left: 5px;
    }

    .performance__token-data__title {
        font-size: 16px;
    }
    .performance__token-data__number {
      font-size: 14px;
    }
    .performance__token-data__hours {
      font-size: 12px;
    }
    .performance__divider {
      margin-left: 5px;
      margin-right: 5px;
    }
  }

  @media (max-width: 768px) {
    .performance__divider {
      margin-left: 20px;
      margin-right: 20px;
    }
    .performance__token-data__collateral-token {
      margin: 0;
    }
    .performance__token-data__link-address {
      margin-top: 40px;
    }
    .payout-ago {
      margin-right: 15px;
    }
    .performance__chain-data {
      padding: 2px 5px;
      margin-top: 20px;
    }

    .performance__chain-data-name {
      font-size: 12px;
    }
  }

  @media (max-width: 576px) {
    .performance__token-data__number {
      margin-top: 60px;
    }
    .performance__apy-data__chain {
      margin: 0;
    }
    .performance__icon-chain {
      margin-top: 60px;
    }
    .performance__divider {
      margin-left: 5px;
      margin-right: 5px;
    }
  }
</style>
