<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div
      class='blast-quest-task-not-success-like'
    >
      <h2>LIKE AND RETWEET TASK</h2>
      <div class='blast-quest-task-not-success-like-divider' />
      <BaseIcon
        name="CommonErrorCircle"
      />
      <h1>OOPS! IT SEEMS YOU DIDN'T COMPLETE THE TASK</h1>
      <h3>Check that you have completed the task and come back.<br>
        If you sure that you completed the task, try to check its execution later!</h3>
      <ButtonComponent
        @click="closeModal"
        @keydown.enter="closeModal"
      >
        <p>OKAY!</p>
      </ButtonComponent>
      <div class='blast-quest-task-not-success-like-divider-last' />
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'LikedModal',
  emits: ['close-modal'],
  components: {
    ModalComponent,
    BaseIcon,
    ButtonComponent,
  },
  data() {
    return {
      showModal: true,
    };
  },
  methods: {
    closeModal() {
      this.$store.commit('jackpotData/setIsLikedQuest', null);
      this.$store.commit('jackpotData/setIsRetweetedQuest', null);
      this.$emit('close-modal');
    },
  },
};
</script>

<style lang="scss" scoped>
.blast-quest-task-not-success-like {
  display: flex;
  flex-direction: column;
  min-width: 730px;
  width: 100%;
  h3 {
    font-size: 16px;
    color: var(--color-1);
    font-weight: 600;
    text-align: center;
    line-height: 30px;
    margin-bottom: 16px;
  }
  h2 {
    font-size: 17px;
    color: var(--color-1);
    font-weight: 600;
    margin-right: auto;
  }
  h1 {
    font-size: 24px;
    color: var(--color-1);
    font-weight: 600;
    margin-bottom: 22px;
    margin-top: 20px;
  }
  button {
    border-radius: 30px;
    box-shadow: none;
    border: none;
    padding: 5px 40px;
  }
  align-items: center;
  padding: 30px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    h2,h1 {
      color: var(--color-4);
    }
    button {
      box-shadow: none;
      background-color: var(--color-7);
    }
  }
}
.blast-quest-task-not-success-like-divider,
.blast-quest-task-not-success-like-divider-last {
  border: 1px solid var(--color-7);
  width: 100%;
  margin-bottom: 22px;
  margin-top: 22px;
  [data-theme="dark"] & {
    background-color: var(--color-18);
  }
}

.blast-quest-task-not-success-like-divider-last {
  margin-bottom: 0;
}

@media (max-width: 1024px) {
  .blast-quest-task-not-success-like {
    min-width: 640px;
    width: auto;
  }
}

@media (max-width: 640px) {
  .blast-quest-task-not-success-like {
    min-width: 0;
  }
}
</style>
