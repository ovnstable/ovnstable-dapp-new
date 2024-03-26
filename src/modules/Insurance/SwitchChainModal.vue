<template>
  <ButtonComponent
    class="change-network-close-modal"
    @click="closeModal()"
    @keydown.enter="closeModal()"
  >
    <BaseIcon
      name='ArrowExitMobile'
    />
  </ButtonComponent>
  <div class="change-network">
    <BaseIcon name="change-network" />
    <div class="change-network__text">
      Please, switch to the chain the insurance is on.
    </div>

    <ButtonComponent
      class="change-network__btn"
      btn-size="large"
      @click.stop="setWalletNetwork('arbitrum')"
    >
      SWITCH TO ARBITRUM
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
  name: 'SwitchChainInsurance',
  components: {
    ButtonComponent,
    BaseIcon,
  },
  computed: {
    ...mapGetters('network', ['getParams', 'networkId']),
  },
  methods: {
    ...mapActions('network', ['setWalletNetwork']),
    closeModal() {
      this.$emit('closeModal');
    },
  },
};
</script>

<style lang="scss" scoped>
.change-network {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 30px;
  min-height: 40vh;
  margin: 40px 30px;
  text-align: center;
  gap: 30px;
  margin-top: 20px;
  border-radius: 12px;

  svg {
    margin: 0 auto;
  }
  button {
    [data-theme="dark"] & {
      box-shadow: none;
    }
  }
}
.change-network__text {
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.change-network-close-modal {
  border: none;
  background: none;
  box-shadow: none;
  align-items: left;
  justify-content: start;
  [data-theme="dark"] & {
    box-shadow: none;
    svg {
      fill: var(--color-4);
    }
  }
}
@media (max-width: 640px) {
  .change-network__btn {
    font-size: 16px;
  }
}

</style>
