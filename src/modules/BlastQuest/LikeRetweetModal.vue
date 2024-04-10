<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div
      class='blast-quest-task'
    >
      <h1>LIKE AND RETWEET TASK</h1>
      <h2>Post</h2>
      <div
        class='blast-quest-task-post'
      >
        <p>Post you need to like and retweet to do task:</p>
        <a
          v-if="!loadingTweet"
          :href="`https://twitter.com/overnight_fi/status/${lastTweetNumber}`"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="token-address"
        >{{`https://twitter.com/overnight_fi/status/${lastTweetNumber}`}}</a>
        <div
          v-else
          class="blast-quest-task-post-spinner"
        >
          <Spinner size="20px" />
        </div>
      </div>

      <h2>Your account</h2>
      <div
        class='blast-quest-task-account'
      >
        <InputComponent
          :value="accountLink"
          is-text
          input-type="primary"
          placeholder="Paste the link to your Twitter account here"
          full-width
          @input="inputAccount"
        />
      </div>
      <ButtonComponent
        v-if="!checkingTweetLoading"
        @click="checkLikeFromAccount"
        @keydown.enter="checkLikeFromAccount"
      >
        <p>TASK COMPLETION CHECK</p>
      </ButtonComponent>
      <div
        v-else
        class="blast-quest-task-account-spinner"
      >
        <Spinner size="24px" />
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import Spinner from '@/components/Spinner/Index.vue';
import InputComponent from '@/components/Input/Index.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BlastQuestApiService from '@/services/blast-quest-api-service.ts';

export default {
  name: 'LikeRetweetModal',
  components: {
    Spinner,
    InputComponent,
    ModalComponent,
    ButtonComponent,
  },
  emits: ['twitter-submit'],
  data() {
    return {
      lastTweetNumber: '',
      accountLink: '',
      isLiked: false,
      isRetweeted: false,
      showModal: false,
      loadingTweet: true,
      checkingTweetLoading: false,
    };
  },
  async mounted() {
    this.loadingTweet = true;
    console.log('LOAD___');
    const resp = await BlastQuestApiService.loadTwitterData();
    console.log(resp, '____resp');
    this.lastTweetNumber = resp?.id;
    this.loadingTweet = false;
  },

  methods: {
    closeModal() {
      this.showModal = false;
    },
    inputAccount(val: string) {
      this.accountLink = val;
    },
    notLikedModalShow() {
      return true;
    },
    async checkLikeFromAccount() {
      this.checkingTweetLoading = true;

      const account = this.accountLink.split('/').pop();
      this.$emit('twitter-submit', account);

      this.checkingTweetLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.blast-quest-task {
  display: flex;
  flex-direction: column;
  padding: 30px;
  min-width: 840px;
  h1 {
    margin-bottom: 40px;
    font-size: 17px;
    font-weight: 600;
    color: var(--color-1);
  }

  h2 {
    margin-bottom: 6px;
  }
  button {
    border-radius: 30px;
    box-shadow: none;
    border: none;
    font-size: 14px;
    font-weight: 600;
    max-width: 300px;
    align-self: center;
  }
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
.blast-quest-task-post-spinner {
  margin-left: auto;
}
.blast-quest-task-account-spinner {
  align-self: center
}

.blast-quest-task-post {
  display: flex;
  flex-direction: row;
  padding: 14px 10px;
  gap: 50px;
  p,a {
    color: var(--color-1);
    font-weight: 600;
  }
  [data-theme="dark"] & {
    background-color: var(--color-7);
    p,a {
      color: var(--color-4);
    }
  }
}

.blast-quest-task-post {
  background-color: var(--color-5);
  border-radius: 10px;
  margin-bottom: 30px;
}

.blast-quest-task-account {
  border-radius: 10px;
  margin-bottom: 40px;
  background-color: var(--color-8);
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

@media (max-width: 1024px) {
  .blast-quest-task {
    min-width: 640px;
    width: auto;
  }
}

@media (max-width: 640px) {
  .blast-quest-task {
    min-width: 0;
  }
  .blast-quest-task-post {
    gap: 20px;
    flex-wrap: wrap;
    a {
      word-break: break-all;
    }
  }
}
</style>
