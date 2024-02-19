<template>
  <div class="insurance__about">
    <div class="insurance__about-text">
      <div class="insurance__about-text-ovn-stake">
        <BaseIcon
          class="insurance__about-img-dividends"
          name="InsuranceDividends"
        />
        <p>
          Stake OVN on the Insurance Vault in<br>
          exchange for insurance premiums<br>
          (1 INS = 1 OVN)
        </p>

      </div>
      <div class="insurance__about-text-ovn-yield">
        <BaseIcon
          class="insurance__about-img-yield"
          name="InsuranceYield"
        />
        <p> By staking OVN tokens,<br>
          you can participate in high-yield,<br>
          but more risky strategies </p>
      </div>
      <div class="insurance__about-text-ins">
        <BaseIcon
          class="insurance__about-img-ins"
          name="InsuranceINS"
        />
        <p> Minting and withdrawing<br>
          INS with no fee </p>
      </div>
    </div>
    <div class="insurance__about-rebase">
      <InsuranceAboutRebase
        type='positive'
      />
      <InsuranceAboutRebase
        type='negative'
      />
    </div>
  </div>

</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import InsuranceAboutRebase from '@/modules/Insurance/InsuranceAboutRebase.vue';

export default {
  name: 'AboutInsurance',
  components: {
    BaseIcon,
    InsuranceAboutRebase,
  },
};
</script>

<style lang="scss" scoped>

.insurance__about {
  display:flex;
  flex-direction: column;
  background-color: var(--color-8);
  padding: 26px 44px;
  margin-bottom: 10px;
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}
.insurance__about-text,
.insurance__about-rebase {
  display:flex;
  flex-direction: row;
}

.insurance__about-rebase {
  margin-top: 20px;
  justify-content: space-between;
}

.insurance__about-text-ovn-stake,
.insurance__about-text-ovn-yield,
.insurance__about-text-ins {
  display:flex;
  flex-direction: column;
  align-items: center;
}

.insurance__about-text {
  justify-content: space-between;

  p {
    font-size: 15px;
    color: var(--color-1);
    text-align: center;
    margin-top: 10px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .insurance__about-img-yield,
  .insurance__about-img-dividends {
    stroke: var(--color-1);
  }

  .insurance__about-img-ins {
    fill: var(--color-1);
  }
}
</style>
