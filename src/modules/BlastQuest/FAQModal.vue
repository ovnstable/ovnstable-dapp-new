<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div
      class="faq-content"
    >
      <h2>BRONZE LOOTBOX INFO</h2>

      <QuestBox
        :open-box="false"
        :view-box="viewBox"
      />

      <p class="faq-content__main-desc">
        Complete 3 daily tasks to get the Blast loot box! The boxes contain
        a random amount of Blast points within the range shown under the box.
      </p>

      <ul class="faq-content__ul">
        <li
          v-for="(item, key) in getUlData"
          :key="key"
        >
          <template v-if="key === 0">{{ `${item} ${rangeBox}` }}</template><template v-else><p v-html="item" /></template>

          <div
            v-if="key + 1 === getUlData.length"
            class="faq-content__ul-links"
          >
            <a
              v-for="(pool, keyPool) in getUlPools"
              :key="keyPool"
              :href="pool.link"
              target="_blank"
              rel="noopener noreferrer"
              class="link-ovn"
            >
              {{ pool.text }}
            </a>
          </div>
        </li>
      </ul>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from '@/components/Modal/Index.vue';
import QuestBox, { TypeofQuest } from '@/components/QuestBox/Index.vue';
import type { PropType } from 'vue';

export default {
  name: 'LikedModal',
  emits: ['close-modal'],
  components: {
    ModalComponent,
    QuestBox,
  },
  props: {
    viewBox: {
      type: Number as PropType<TypeofQuest>,
      required: true,
    },
    rangeBox: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      faqData: {
        bronze: [
          'Bronze Box contains a random amount of Blast points up to',
          'The box can be claimed once a day after completing all 3 tasks.',
          'If you did all 3 tasks but forgot to claim the Box, don’t worry! You can claim it any other day.',
          'In the “Like and retweet today\'s Overnight post” task you will see a link to a post you need to retweet and a field for your nickname on Twitter. Click on the Arrow icon, retweet the post, leave us your nickname and that\'s it!',
          'Task “Mint at least 500 USD+ on Blast” indicates the smallest token amount to be invested to complete the task (500 USD). The task is considered completed if you mint USD+ during the time the task is active (24 hours). You can invest by following the link indicated next to the task.',
          'Task “Add at least $1000 to any USD+ pool on Blast” indicates the smallest token amount that must be invested to complete the task ($1000). The task is considered completed if you have invested in the pool during the time the task is active (24 hours).',
          'Also, you can get additional points by depositing Thruster LP in Hyperlock’s USD+/USDB and USD+/wETH pools. By doing this you will get <b>~22 points/$1K</b> for USD+/wETH and <b>~39 points/$1K</b> for USD+/USDB pool. The amount of points per $1K changes depending on different factors.',
          'You can invest in one of the following pools:',
        ],
        bronzePools: [
          {
            link: 'https://swapblast.finance/#/pools',
            text: 'USD+/USDB on SwapBlast',
          },
          {
            link: 'https://swapblast.finance/#/pools',
            text: 'USD+/USDC+ on SwapBlast',
          },
          {
            link: 'https://app.thruster.finance/add?token1=0x4300000000000000000000000000000000000003&token2=0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd&poolVersion=V3&fee=0.0005',
            text: 'USD+/USDB on Thruster',
          },
          {
            link: 'https://app.thruster.finance/add?token1=0x4300000000000000000000000000000000000004&token2=0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd&poolVersion=V3&fee=0.0005',
            text: 'USD+/wETH on Thruster',
          },
          {
            link: 'https://app.hyperlock.finance/#/',
            text: 'Hyperlock Link',
          },
        ],
        silver: [
          'Silver Box contains a random amount of points up to',
          'The box can be claimed once a day after completing all 3 tasks.',
          'If you did all 3 tasks but forgot to claim the Box, don’t worry! You can claim it any other day.',
          'Task “Mint at least 1000 USD+ on Blast” indicates the smallest token amount to be invested the task to complete the task ($1000). The task is considered completed if you mint USD+ during the time the task is active (24 hours).',
          'Task “Add at least $2000 liquidity to any USD+ pool on Thruster” indicates the smallest token amount that must be invested to complete the task ($2000). The task is considered completed if you have invested in the pool during the time the task is active (24 hours).',
          'Also, you can get additional points by depositing Thruster LP in Hyperlock’s USD+/USDB and USD+/wETH pools. By doing this you will get <b>~22 points/$1K</b> for USD+/wETH and <b>~39 points/$1K</b> for USD+/USDB pool. The amount of points per $1K changes depending on different factors.',
          'You can invest in one of the following pools:',
        ],
        silverPools: [
          {
            link: 'https://swapblast.finance/#/pools',
            text: 'USD+/USDB on SwapBlast',
          },
          {
            link: 'https://swapblast.finance/#/pools',
            text: 'USD+/USDC+ on SwapBlast',
          },
          {
            link: 'https://app.thruster.finance/add?token1=0x4300000000000000000000000000000000000003&token2=0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd&poolVersion=V3&fee=0.0005',
            text: 'USD+/USDB on Thruster',
          },
          {
            link: 'https://app.thruster.finance/add?token1=0x4300000000000000000000000000000000000004&token2=0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd&poolVersion=V3&fee=0.0005',
            text: 'USD+/wETH on Thruster',
          },
          {
            link: 'https://app.hyperlock.finance/#/',
            text: 'Hyperlock Link',
          },
        ],
        gold: [
          'Gold Box contains a random amount of Blast points up to',
          'The box can be claimed once a day after completing all 3 tasks.',
          'If you did all 3 tasks but forgot to claim the Box, don’t worry! You can claim it any other day.',
          'Task “Mint at least 2500 USD+ on Blast” indicates the smallest token amount to be invested to complete the task ($2500). The task is considered completed if you mint USD+ during the time the task is active (24 hours).',
          'Task “Add at least $5000 liquidity to any USD+ pool on Thruster” indicates the smallest token amount that must be invested to complete the task ($5000). The task is considered completed if you have invested in the pool during the time the task is active (24 hours).',
          'Task “Add at least $5000 to any USD+ SwapBlast” indicates the smallest token amount that must be invested to complete the task ($5000). The task is considered completed if you have invested in the pool during the time the task is active (24 hours).',
          'Also, you can get additional points by depositing Thruster LP in Hyperlock’s USD+/USDB and USD+/wETH pools. By doing this you will get <b>~22 points/$1K</b> for USD+/wETH and <b>~39 points/$1K</b> for USD+/USDB pool. The amount of points per $1K changes depending on different factors.',
          'You can invest in one of the following pools:',
        ],
        goldPools: [
          {
            link: 'https://swapblast.finance/#/pools',
            text: 'USD+/USDB on SwapBlast',
          },
          {
            link: 'https://swapblast.finance/#/pools',
            text: 'USD+/USDC+ on SwapBlast',
          },
          {
            link: 'https://app.thruster.finance/add?token1=0x4300000000000000000000000000000000000003&token2=0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd&poolVersion=V3&fee=0.0005',
            text: 'USD+/USDB on Thruster',
          },
          {
            link: 'https://app.thruster.finance/add?token1=0x4300000000000000000000000000000000000004&token2=0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd&poolVersion=V3&fee=0.0005',
            text: 'USD+/wETH on Thruster',
          },
          {
            link: 'https://app.hyperlock.finance/#/',
            text: 'Hyperlock Link',
          },
        ],
        diamond: [
          'Blast points: from 0.01 up to 50% from Jackpot',
          'Once a week you will be able to claim a Diamond Box. To do so, you need to complete 15 tasks in a week, doing 3 tasks a day. You can complete those 3 tasks any day during the week, joining the quest total of 5 days out of 7. ',
          'When you complete daily 3 tasks, you will see how your progress bar is filling, getting you closer to the claim of the Diamond box. After it is filled, the Box is yours, but you can open it only once a week on Sundays.',
          'If you collect all 3 boxes daily (Bronze Silver and Gold), you will complete 9 tasks total, but only one division of your progress bar will be filled. It is made to give all users equal opportunity to win weekly Diamond Box.',
        ],
      },
    };
  },
  computed: {
    getUlData() {
      if (this.viewBox === TypeofQuest.BRONZE) return this.faqData.bronze;
      if (this.viewBox === TypeofQuest.SILVER) return this.faqData.silver;
      if (this.viewBox === TypeofQuest.GOLD) return this.faqData.gold;
      if (this.viewBox === TypeofQuest.DIAMOND) return this.faqData.diamond;

      return [];
    },
    getUlPools() {
      if (this.viewBox === TypeofQuest.BRONZE) return this.faqData.bronzePools;
      if (this.viewBox === TypeofQuest.SILVER) return this.faqData.silverPools;
      if (this.viewBox === TypeofQuest.GOLD) return this.faqData.goldPools;

      return [];
    },
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },
  },
};
</script>

<style lang="scss" scoped>
.faq-content {
  width: 100%;
  max-width: 730px;
  padding: 20px;

  b {
    font-weight: 600;
  }
}

.faq-content__main-desc {
  margin-top: 20px;
}

.faq-content__ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style-type: dot;
  margin-top: 20px;
  padding: 0 20px;
}

.faq-content__ul-links {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  gap: 8px;

  a:last-child {
    margin-top: 10px;
  }
}
</style>
