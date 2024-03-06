<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >

    <div class="account__modal">
      <p>MY ACCOUNT</p>
      <ProfilePicture class="account__modal-profile" />
      <div class="account__modal-divider" />
      <AddTokensAccount />
      <div class="account__modal-divider" />
      <AccountTransactions class="account__modal-trxs" />
      <ButtonComponent
        @click="logout"
        @keypress="logout"
      >
        DISCONNECT
        <BaseIcon
          name="Logout"
        />
      </ButtonComponent>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from '@/components/Modal/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import ProfilePicture from '@/modules/Account/ProfilePicture.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import AddTokensAccount from '@/modules/Account/AddTokens.vue';
import AccountTransactions from '@/modules/Account/AccountTransactions.vue';

export default {
  name: 'AccountModal',
  emits: ['close-modal'],
  components: {
    ModalComponent,
    ProfilePicture,
    AddTokensAccount,
    AccountTransactions,
    ButtonComponent,
    BaseIcon,
  },
  data() {
    return {
      showModal: false,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('walletAction/disconnectWallet').then(() => {
        this.closeModal();
      });
    },
    closeModal() {
      this.$emit('close-modal');
    },
  },
};
</script>

<style lang="scss" scoped>
.account__modal {
  width: 860px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  p {
    font-weight: 600;
    font-size: 16px;
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  [data-theme="dark"] & {
    background-color: var(--color-6);
  }
  button {
    padding: 6px 10px;
    border-radius: 30px;
    background-color: var(--color-5);
    box-shadow: none;
    color: var(--color-1);
    margin-top: 30px;
    flex-grow: 0;
    gap: 12px;
    align-self: center;
    [data-theme="dark"] & {
      color: var(--color-4);
      border-color: var(--color-4);
    }
  }

  @media (max-width: 1024px) {
    width: 100%;
    min-width: 90vw;
  }
}
.account__modal-profile {
  margin-top: 30px;
}
.account__modal-trxs {
  margin-top: 4px;
}
.account__modal-divider {
  border: 1px solid var(--color-7);
  margin-top: 20px;
  margin-bottom: 20px
}
</style>
