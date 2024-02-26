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
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from '@/components/Modal/Index.vue';
import ProfilePicture from '@/modules/Account/ProfilePicture.vue';
import AddTokensAccount from '@/modules/Account/AddTokens.vue';

export default {
  name: 'AccountModal',
  components: {
    ModalComponent,
    ProfilePicture,
    AddTokensAccount,
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
    closeModal() {
      this.$emit('set-show', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.account__modal {
  width: 860px;
  padding: 20px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  p {
    font-weight: 600;
    font-size: 16px;
    color: var(--color-1);
  }
  [data-theme="dark"] & {
    background-color: var(--color-6);
  }
}
.account__modal-profile {
  margin-top: 30px;
}
.account__modal-divider {
  border: 1px solid var(--color-7);
  margin-top: 20px;
  margin-bottom: 20px
}
</style>
