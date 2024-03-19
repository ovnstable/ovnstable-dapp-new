<template>
  <p class="ovn__overview-benefits-title">BENEFIT FROM OVN TOKEN</p>
  <BaseIcon
    name="Tokenomic"
    class="ovn__overview-tokenomic"
  />
  <div class="ovn__overview-benefits">
    <div
      class="ovn__overview-benefit"
      v-for="benefit in benefits"
      :key="`benefit-${benefit.title}`"
    >

      <BaseIcon
        v-if="!device.isMobile"
        :name="benefit.icon"
      />
      <p v-if="!device.isMobile">{{ benefit.title }}</p>
      <div
        v-if="device.isMobile"
        class="ovn__overview-benefit-icon-title"
      >
        <BaseIcon
          :name="benefit.icon"
        />
        <p>{{ benefit.title }}</p>
      </div>
      <p>{{ benefit.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { deviceType } from '@/utils/deviceType.ts';

export default {
  name: 'OvnBenefits',
  components: {
    BaseIcon,
  },
  data() {
    return {
      benefits: [
        {
          icon: 'Stake',
          title: 'STAKE INTO INS VAULT',
          description: 'Stake OVN into Insurance/ Vault generate additional yield from insurance premiums, however, potential downside in case of a potential loss on a strategy',
        },
        {
          icon: 'Hold',
          title: 'HOLD',
          description: 'The tokenomic is intended for to maximize the value of 100% of the token supply over the next 30 months. Buying and holding through that period is the most straightforward way to get exposure to OVN',
        },
        {
          icon: 'StakeLP',
          title: 'STAKE OVN/USD+ LP',
          description: 'Generate additional yield on the LP from revenue, however, would limit maximum upside and reinforce downside through impermanent loss',
        },
      ],
    };
  },
  computed: {
    device() {
      return deviceType();
    },
  },
};

</script>

<style lang="scss" scoped>
.ovn__overview-tokenomic {
  display: none;
}

.ovn__overview-benefits-title {
  font-size: 17px;
  color: var(--color-1);
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 24px;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.ovn__overview-benefits {
  background-color: var(--color-8);
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 18px 24px;
  [data-theme="dark"] & {
    background-color: var(--color-6);
    p {
      color: var(--color-4);
    }
    svg {
      stroke: var(--color-4);
      fill: var(--color-4);
    }
  }
}

.ovn__overview-benefits > .ovn__overview-benefit:nth-child(1),
.ovn__overview-benefits > .ovn__overview-benefit:nth-child(3) {
  max-width: 210px;
}

.ovn__overview-benefits > .ovn__overview-benefit:nth-child(2) {
  max-width: 305px;
}

.ovn__overview-benefit {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  text-align: center;
  p {
    font-size: 15px;
    color: var(--color-1);
  }
}

@media (max-width: 768px) {
  .ovn__overview-benefits {
    padding: 8px 12px;
    p {
      font-size: 13px;
    }
  }
  .ovn__overview-benefits > .ovn__overview-benefit:nth-child(1),
  .ovn__overview-benefits > .ovn__overview-benefit:nth-child(3) {
    max-width: 180px;
  }

  .ovn__overview-benefits > .ovn__overview-benefit:nth-child(2) {
    max-width: 250px;
  }
}

@media (max-width: 640px) {
  .ovn__overview-benefits-title {
    font-size: 16px;
  }
  .ovn__overview-benefits {
    text-align: left;
    flex-direction: column;
    align-items: stretch;
    gap: 22px;
  }
  .ovn__overview-benefit-icon-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    text-align: left;
  }
  .ovn__overview-benefit {
    width: 100%;
    align-items: flex-start;
    text-align: left;
    min-width: 100%;
  }
}
</style>
