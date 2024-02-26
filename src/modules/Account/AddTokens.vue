<template>
  <div class="account__modal-chains">
    <p>ADD TOKENS TO WALLET</p>
    <ChainsSelection />
    <AccountModalTokens />
  </div>

</template>

<script lang="ts">
import ChainsSelection from '@/modules/Account/ChainsSelection.vue';
import AccountModalTokens from '@/modules/Account/AccountModalTokens.vue'

export default {
  name: 'AddTokensAccount',
  components: {
    ChainsSelection,
    AccountModalTokens,
  },
};
</script>

<style lang="scss" scoped>
.account__modal-chains {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
