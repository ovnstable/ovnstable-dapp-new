<template>
  <div class="insurance__about">
    <div class="insurance__about-text">
      <div class="insurance__about-text-ovn-stake">
        <BaseIcon
          class="insurance__about-img-dividends"
          name="InsuranceDividends"
        />
        <p>
          Stake OVN on the Insurance Vault in<template v-if="!device.isMobile"><br></template>
          exchange for insurance premiums<template v-if="!device.isMobile"><br></template>
          (1 INS = 1 OVN)
        </p>

      </div>
      <div class="insurance__about-text-ovn-yield">
        <BaseIcon
          class="insurance__about-img-yield"
          name="InsuranceYield"
        />
        <p> By staking OVN tokens,<template v-if="!device.isMobile"><br></template>
          you can participate in high-yield,<template v-if="!device.isMobile"><br></template>
          but more risky strategies </p>
      </div>
      <div class="insurance__about-text-ins">
        <BaseIcon
          class="insurance__about-img-ins"
          name="InsuranceINS"
        />
        <p> Minting and withdrawing<template v-if="!device.isMobile"><br></template>
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
import { deviceType } from '@/utils/deviceType.ts';

export default {
  name: 'AboutInsurance',
  components: {
    BaseIcon,
    InsuranceAboutRebase,
  },
  computed: {
    device() {
      return deviceType();
    },
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

@media (max-width: 1024px) {
  .insurance__about {
    padding: 20px 36px;
  }
}

@media (max-width: 768px) {
  .insurance__about {
    padding: 10px 16px;
    margin-bottom: 20px;
    svg {
      scale: 80%;
    }
  }
  .insurance__about-text {
    p {
      font-size: 13px;
    }
  }
  .insurance__about-rebase {
    flex-direction: column;
  }
}
@media (max-width: 640px) {
  .insurance__about {
    background: none;
    padding: 0;
  }
  .insurance__about-text {
    border-radius: 10px;
    background-color: var(--color-8);
    flex-direction: column;
    gap: 18px;
    padding: 14px 10px;
    [data-theme="dark"] & {
      background-color: var(--color-7);
    }
  }
  .insurance__about-rebase {
    flex-direction: column;
  }
}
</style>
