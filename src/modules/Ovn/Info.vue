<template>

  <div class="ovn__overview">
    <div class="ovn__overview-links">
      <BaseIcon
        class='ovn__overview-links-image'
        name="InsuranceOVNVault"
      />
      <div class="ovn__overview-links-data">
        <p>OVN</p>
        <p>Token address</p>
        <p>Coinmarketcap</p>
      </div>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-price">
      <p>OVN Price</p>
      <div class="ovn__overview-price-change">
        <p>price</p>
        <p>change last day</p>
      </div>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-mc">
      <p>Market cap</p>
      <div class="ovn__overview-mc-change">
        <p>market cap</p>
        <p>change last day</p>
      </div>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-tvl">
      <p>OVN TVL</p>
      <div class="ovn__overview-exact-chain">
        <p>icon chain</p>
        <p>00,000.00$</p>
      </div>
      <p>past 2 hours</p>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-buttons">
      <ButtonComponent>
        MINT / REDEEM
      </ButtonComponent>
      <ButtonComponent>
        BRIDGE
      </ButtonComponent>
      <ButtonComponent>
        OVN DASHBOARD
      </ButtonComponent>
    </div>

  </div>

</template>

<script lang="ts">
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'OvnInfo',
  components: {
    ButtonComponent,
    BaseIcon,
  },
  props: {
  },
};

</script>

<style lang="scss" scoped>

.ovn__overview {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.ovn__overview-tvl,
.ovn__overview-buttons {
  display: flex;
  flex-direction: column;
}
.ovn__overview-divider {
  border: 1px solid var(--color-7);
}
.ovn__overview-links {
  display: flex;
  flex-direction: row;
}
.ovn__overview-links-data {
  margin-left: 10px;
}
.ovn__overview-links-data p:nth-child(1) {
  margin-bottom: 10px;
}
.ovn__overview-links-image {
  width: 70px;
  height: 70px;
}

</style>
