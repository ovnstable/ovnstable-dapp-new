<template>
  <div>
    <div class="not-available-container">
      <BaseIcon
        name="CommonWarning"
      />
      <div class="not-available-container-chain">
        SWAP WILL BE AVAILABLE ON <span class="network-name">{{networkName.toUpperCase()}}</span> SOON.
      </div>
      <div class="not-available-container-divider" />
      <div class="not-available-container-mint-redeem-text">

        Now you can <span
          class="not-available-container-chain-mint-redeem"
          @click="changeTab(1)"
          @keypress="changeTab(1)"
        >
          mint
        </span> and
        <span
          class="not-available-container-chain-mint-redeem"
          @click="changeTab(1)"
          @keypress="changeTab(1)"
        >
          redeem
        </span> <br>
        Tokens+ on <span class="network-name">{{networkName}}</span> chain
      </div>
      <ButtonComponent
        @click="changeTab(1)"
        @keypress="changeTab(1)"
      >
        OKAY!
      </ButtonComponent>
      <div class="not-available-container-divider last" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { useEventBus } from '@vueuse/core';

const emitTabChange = useEventBus<number>('change-tab-request');

export default {
  name: 'network-not-available',
  components: {
    ButtonComponent,
    BaseIcon,
  },
  props: ['networkName'],
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    changeTab(tabIndex: number) {
      console.log('we are in change tab in network not available');
      emitTabChange.emit(tabIndex);
    },
    mintAction() {
      console.log('mint actions was called from no linead');
      this.showMintView();
      this.showSwapModal();
    },
  },
};
</script>

<style lang="scss" scoped>

.not-available-container {
  min-height: 480px;
  padding-top: 60px;
  align-items: center;
  button {
    border: none;
    box-shadow: none;
    padding: 5px 45px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
  }
  svg {
    margin-bottom: 30px;
  }
}

.not-available-container-chain {
  color: var(--color-1);
  font-size: 24px;
  font-weight: 600;
}

.not-available-container-divider {
  width: 100%;
  border: 1px solid var(--color-7);
  margin-top: 40px;
  margin-bottom: 40px;
}
.last {
  margin-bottom: 0px;
}

.not-available-container-mint-redeem-text {
  color: var(--color-1);
  font-size: 16px;
  font-weight: 500;
  align-items: center;
  line-height: 28px;
  text-align: center;
  margin-bottom: 40px;
}
.not-available-container-chain-mint-redeem {
  text-decoration: underline;
}
.not-available-container-chain-mint-redeem:hover {
  cursor: pointer;
  opacity: 0.7;
}
.not-available-container-mint-redeem-text:first-child {
  margin-bottom: 6px;
}
.not-available-container {
  display: flex;
  flex-direction: column;
}

.network-name {
  text-transform: capitalize;
}

/*Mobile*/
@media only screen and (max-width: 960px) {

    .not-available-container {
        min-height: 250px;
        padding-top: 10px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .swap-container {
        padding: 40px 30px;
    }
}

</style>
