<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div
      v-if="!user?.nickname"
      class='blast-quest-task-not-logged'
    >
      <p>LOGIN TO TWITTER BEFORE COMPLETE THIS TASK</p>
      <ButtonComponent

        btn-styles="secondary"
        class='blast-quest-task'
        @click="loginTwitter"
      >
        LOGIN TWITTER
      </ButtonComponent>
    </div>
    <div
      v-else
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
      <Spinner
        class="spinner-wrap"
        v-if="verifyTweet"
        size="24px"
      />
      <ButtonComponent
        v-else
        @click="checkLikeFromAccount"
        @keydown.enter="checkLikeFromAccount"
      >
        <p>TASK COMPLETION CHECK</p>
      </ButtonComponent>
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
  props: {
    verifyTweet: {
      type: Boolean,
      required: false,
      default: false,
    },
    isShow: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      lastTweetNumber: '',
      accountLink: '',
      isLiked: false,
      isRetweeted: false,
      loadingTweet: true,
      showModal: false,
      user: this.$auth0.user,
    };
  },
  async mounted() {
    const resp = await BlastQuestApiService.loadTwitterData();
    this.loadingTweet = false;
    this.lastTweetNumber = resp?.id;
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    inputAccount(val: string) {
      this.accountLink = val;
    },
    async checkLikeFromAccount() {
      const account = this.accountLink.split('/').pop();
      this.$emit('twitter-submit', account);
    },
    loginTwitter() {
      this.$auth0.loginWithRedirect();
    },
  },
};
</script>

<style lang="scss" scoped>
.spinner-wrap {
  margin: 0 auto;
}

.blast-quest-task,
.blast-quest-task-not-logged {
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
.blast-quest-task-not-logged {
  button {
    border-radius: 10px;
    box-shadow: none;
    border: none;
    font-size: 14px;
    font-weight: 600;
    align-self: center;
    margin-top: 20px;
  }
  button:hover {
    background-color: var(--color-8);
  }
  p {
    color: var(--color-1);
    font-weight: 600;
  }
}

.blast-quest-task-post-spinner {
  margin-left: auto;
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
  .blast-quest-task,
  .blast-quest-task-not-logged {
    min-width: 640px;
    width: auto;
  }
  .blast-quest-task-not-logged {
    padding: 10px;
  }
}

@media (max-width: 640px) {
  .blast-quest-task,
  .blast-quest-task-not-logged {
    min-width: 0;
  }
  .blast-quest-task-not-logged {
    padding: 5px;
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
