<template>

  <div class="ovn__overview-benefits">
    <div
      class="ovn__overview-benefit"
      v-for="benefit in benefits"
      :key="`benefit-${benefit.title}`"
    >

      <BaseIcon :name="benefit.icon" />
      <p>{{ benefit.title }}</p>
      <p>{{ benefit.description }}</p>
    </div>
  </div>

</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'OvnBenefits',
  components: {
    BaseIcon,
  },
  data() {
    return {
      benefits: [
        {
          icon: '',
          title: 'STAKE INTO INS VAULT',
          description: 'Stake OVN into Insurance Vault generate additional yield from insurance premiums, however, potential downside in case of a potential loss on a strategy',
        },
        {
          icon: '',
          title: 'HOLD',
          description: 'The tokenomic is intended for to maximize the value of 100% of the token supply over the next 30 months. Buying and holding through that period is the most straightforward way to get exposure to OVN',
        },
        {
          icon: '',
          title: 'STAKE OVN/USD+ LP',
          description: 'Generate additional yield on the LP from revenue, however, would limit maximum upside and reinforce downside through impermanent loss',
        },
      ],
    };
  },
};

</script>

<style lang="scss" scoped>
.ovn__overview-benefits {
background-color: var(--color-8);
border-radius: 5px;
display: flex;
flex-direction: row;
justify-content: space-between;
}

.ovn__overview-benefit {
display: flex;
flex-direction: column;
gap: 10px;
}
</style>
