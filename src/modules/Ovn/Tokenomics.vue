<template>
  <p class="ovn__overview-tokenomics-title">OVN Tokenomics</p>
  <div class="ovn__overview-tokenomic">
    <div class="ovn__overview-tokenomic-diagram">
      <div class="ovn__overview-distribution">
        <div
          class="ovn__overview-distribution-item"
          v-for="benefit in benefits"
          :key="`benefit-${benefit.name}`"
        >
          <div
            class="ovn__overview-item-icon"
            :style="{ 'background-color': benefit.color }"
          />
          <p>{{ benefit.name }}:</p>
          <p>{{ benefit.percent }}%</p>
        </div>
      </div>
      <BaseIcon name="Tokenomic" />
    </div>

    <div class="ovn__overview-description">
      <p>The OVN token distribution is fixed at 1,000,000 tokens, with no plans for
        additional emissions </p>
      <p>The tokenomics of OVN are designed to maximize the token's value over the
        next 30 months</p>
      <p> &bull;&nbsp; 33.5% reserved for the team and
        pre-seed investors will vest over 30 months</p>
      <p> &bull;&nbsp;44%  reserved for Treasury will be used for seeding liquidity to OVN pools
        and incentivizing USD+ pools</p>
      <p> &bull;&nbsp;20% once vested, will be used for staking into specific Insurance Vaults</p>
    </div>
  </div>
  <div class="ovn__overview-tokenomic-pools">
    <p class="ovn__overview-tokenomic-pools-all">ALL OVN POOLS</p>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'OvnTokenomics',
  components: {
    BaseIcon,
  },
  computed: {
    networkName() {
      return this.$store.state.network.ovnNetwork;
    },
    networkScan() {
      return this.$store.state.network.ovnExplorerURL;
    },
  },
  data() {
    return {
      benefits: [
        {
          name: 'Treasury',
          percent: '44',
          color: 'var(--color-3)',
        },
        {
          name: 'Team',
          percent: '25',
          color: 'var(--color-14)',
        },
        {
          name: 'Insurance fund',
          percent: '20',
          color: 'var(--color-16)',
        },
        {
          name: 'Pre-seed investors',
          percent: '8.5',
          color: 'var(--color-9)',
        },
        {
          name: 'Pre-sale',
          percent: '2.5',
          color: 'var(--color-6)',
        },
      ],
    };
  },
};

</script>

<style lang="scss" scoped>

.ovn__overview-tokenomics-title {
  font-size: 17px;
  color: var(--color-1);
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 24px;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.ovn__overview-tokenomic {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
}

.ovn__overview-distribution {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-right: 10px;
}
.ovn__overview-distribution-item {
  gap: 4px;
  display: flex;
  flex-direction: row;
  p {
    font-size: 15px;
    color: var(--color-1);
    font-weight: 400;
  }
  [data-theme="dark"] & {
    p {
      color: var(--color-4);
    }
  }
}
.ovn__overview-description {
  max-width: 530px;
  display: flex;
  flex-direction: column;
  align-items: right;
  gap: 20px;
  text-align: right;
  p {
    color: var(--color-1);
    font-size: 14px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}
.ovn__overview-tokenomic-pools-all {
  font-size: 15px;
  color: var(--color-1);
  font-weight: 500;
  background-color: var(--color-6);
  padding: 6px 22px;
  display: flex;
  align-items: center;
  border-radius: 30px;
  border: 1px solid var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.slider__token-image {
  width: 214px;
  height: 214px;
  svg {
    width: 214px;
    height: 214px;
  }
}
.ovn__overview-item-icon {
  width: 14px;
  height: 14px;
  border-radius: 5px;
  margin-right: 3px;
}

.ovn__overview-tokenomic-pools {
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.ovn__overview-chain-data-container .selected {
  background: var(--color-4);
  color: var(--color-3);
  border-color: var(--color-6);
  svg {
    opacity: 1;
    filter: unset;
  }
  [data-theme="dark"] & {
    p {
      color: var(--color-4);
    }
    border-color: var(--color-2);
    background: var(--color-17);
  }
}
.ovn__overview-chain-data-container {
  // margin-top: 24px;
  display: flex;
  flex-direction: row;
  vertical-align: center;
  transition: background 0.3s ease, border 0.3s ease;
  svg {
    width: 24px;
    height: 24px;
    filter: grayscale(10);
    opacity: .5;
  }
}

.ovn__overview-chain-data-container > *:not(:last-child) {
  margin-right: 7px;
}
.ovn__overview-tokenomic-diagram {
  display: flex;
  flex-direction: row;
  svg {
    overflow: visible;
  }
}
.ovn__overview-chain-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 30px;
  border: 1px solid var(--color-5);
  padding: 5px 10px;
  width: fit-content;
  background-color: var(--color-5);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
   border-color: var(--color-7);
   background: var(--color-7);
  }
}
.ovn__overview-chain-data-name {
  margin-left: 8px;
  font-weight: 500;
  font-size: 13px;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.ovn__overview-chain-data:hover {
  cursor: pointer;
  border: 1px solid var(--color-7);
  background: var(--color-6);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
    background: var(--color-2);
  }
}

@media (max-width: 768px) {
  .ovn__overview-tokenomic-pools-all,
  .ovn__overview-distribution-item p {
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .ovn__overview-tokenomic {
    flex-direction: column;
    background-color: var(--color-8);
    border-radius: 10px;
    padding: 16px 10px;
    [data-theme="dark"] & {
      background-color: var(--color-6)
    }
    svg {
      scale: 85%;
      overflow: visible;
    }
  }
  .ovn__overview-distribution {
    gap: 25px;
    margin-bottom: 30px;
  }
  .ovn__overview-distribution-item {
    font-size: 12px;
  }
  .ovn__overview-item-icon {
    min-width: 14px;
  }
}

</style>
