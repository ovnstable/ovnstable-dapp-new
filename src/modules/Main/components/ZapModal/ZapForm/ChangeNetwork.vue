<template>
  <div class="change-network">
    <BaseIcon name="change-network" />

    <div class="change-network__text">
      Please, switch to the chain the pool is on.
    </div>

    <ButtonComponent
      class="change-network__btn"
      btn-size="large"
      @click.stop="setWalletNetwork(zapPool.chain + '')"
    >
      SWITCH TO {{ getParams(zapPool.chain).networkName.toUpperCase() }}
    </ButtonComponent>
  </div>
</template>

<script lang="ts">
import {
  mapActions, mapGetters,
} from 'vuex';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'InputToken',
  components: {
    ButtonComponent,
    BaseIcon,
  },
  props: {
    zapPool: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('network', ['getParams', 'networkId']),
  },
  methods: {
    ...mapActions('network', ['setWalletNetwork']),

  },
};
</script>

<style lang="scss" scoped>
.change-network {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 30px;
  border: 1px solid var(--color-3);
  min-height: 40vh;
  text-align: center;
  gap: 30px;
  margin-top: 20px;
  border-radius: 12px;

  svg {
    margin: 0 auto;
  }
}
@media (max-width: 640px) {
  .change-network__btn {
    font-size: 16px;
  }
}

</style>
