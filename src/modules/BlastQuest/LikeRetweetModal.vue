<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div>
      <p>LIKE AND RETWEET TASK</p>
      <p>Post</p>
      <div>
        <p>Post you need to like and retweet to do task:</p>
        <a
          :href="`https://twitter.com/overnight_fi/status/${lastTweetNumber}`"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="token-address"
        >{{`https://twitter.com/overnight_fi/status/${lastTweetNumber}`}}</a>
      </div>
      <p>Your account</p>
      <div>
        <p>Post you need to like and retweet to do task:</p>
        <InputComponent
          :value="accountLink"
          is-text
          input-type="primary"
          placeholder="Search token by name or paste address"
          full-width
          @input="inputAccount"
        />
      </div>
      <ButtonComponent
        @click="checkLikeFromAccount"
        @keydown.enter="checkLikeFromAccount"
      />
    </div>
  </ModalComponent>
</template>

<script lang="ts">
// import Spinner from '@/components/Spinner/Index.vue';
// import BaseIcon from '@/components/Icon/BaseIcon.vue';
import InputComponent from '@/components/Input/Index.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BlastQuestApiService from '@/services/blast-quest-api-service.ts';

export default {
  name: 'LikeRetweetModal',
  components: {
    // TokensList,
    // BaseIcon,
    // Spinner,
    InputComponent,
    ModalComponent,
    ButtonComponent,
  },
  data() {
    return {
      lastTweetNumber: '',
      accountLink: '',
      showModal: false,
    };
  },
  // async mounted() {
  //   const lastTweets = await BlastQuestApiService.getLastTweetsOvernight();
  //   this.lastTweetNumber = lastTweets.results[0].tweet_id;
  // },

  methods: {
    closeModal() {
      this.showModal = false;
    },
    inputAccount(val: string) {
      this.accountLink = val;
    },
    async checkLikeFromAccount() {
      const account = this.accountLink.split('/').pop();
      console.log('here is the account', account);
      console.log(this.lastTweetNumber);
      const userLikes = await BlastQuestApiService.getUserLikes(account);
      const likesFormatted = userLikes.user.result.timeline_v2.timeline.instructions[0].entries;
      console.log('here are our likesFormatted');
      console.log(likesFormatted);
      return 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.tokens-select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  background-color: var(--color-4);
  border-radius: 10px;
}

</style>
