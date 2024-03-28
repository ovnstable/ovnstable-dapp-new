<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div class="blast-modal">
      <div class="blast-modal__header">
        <h1>
          LOOT BOX EVENTS
        </h1>
      </div>
      <div class="blast-modal__div" />

      <div class="blast-modal__row">
        <div class="blast-modal__item-col">
          <h1>
            DAILY BOX
          </h1>
          <p>To participate in this quest,
            You need to provide liquidity to any OVN pool on Blast,
            with least amount of 10$
          </p>
        </div>
        <div>
          <div
            class="blast-modal__box-wrap"
          >
            <QuestBox
              prize-value="100"
              :open-box="openDailyQuest"
              @close="closeQuests"
            />
          </div>

          <ButtonComponent
            full
            :disabled="!!dailyQuestCount"
            @on-click="triggerDailyQuest"
          >
            {{ dailyQuestCount ? `WILL OPEN IN ${dailyQuestCount}h` : 'CLAIM' }}
          </ButtonComponent>
        </div>
      </div>

      <div class="blast-modal__div" />

      <div class="blast-modal__row">
        <div class="blast-modal__item-col">
          <h1>
            WEEKLY BOX
          </h1>
          <p>
            This quest is differ from previous one, it't harder to achieve,
            but can bring more point to You!
          </p>
          <p>
            Here, You can see 5 levels of chests, which You can unlock one by one,
            by finishing certain amount of liquidity in OVN Blast pools
          </p>
        </div>
      </div>

      <div class="progress-steps-scroll">
        <div class="progress-steps-wrap">
          <span>START</span>
          <ul class="progress-steps">
            <li
              v-for="(item, key) in levelQuestList"
              :key="key"
              class="progress-steps__li"
              :class="{ 'quest-completed': getHighestLevel > key ? true : false }"
            >
              <div class="progress-step-item" />
              <span>{{ item }}$</span>
            </li>
          </ul>
          <span>FINISH</span>
        </div>
        <div class="blast-modal__row blast-modal__row--scroll">
          <div
            v-for="(item, key) in Array.from({ length: 5 })"
            class="blast-modal__box-wrap"
            :key="key"
          >
            <QuestBox />

            <ButtonComponent
              full
              :disabled="!(getHighestLevel >= key)"
              @on-click="triggerDailyQuest"
            >
              CLAIM
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  </ModalComponent>
</template>

<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-shadow -->
<script lang="ts">
import { mapGetters } from 'vuex';
import ModalComponent from '@/components/Modal/Index.vue';
import { getRandomString } from '@/utils/strings.ts';
import { OVN_QUESTS_API } from '@/utils/const.ts';
import axios from 'axios';
import ButtonComponent from '@/components/Button/Index.vue';
import QuestBox from '@/components/QuestBox/Index.vue';
import BN from 'bignumber.js';

type TSignedMessage = {
  pubKey: string;
  signature: string;
  message: string;
  nonce: string;
};

enum TypeofQuest {
  LEVELQUEST,
  DAILY,
}
export default {
  name: 'BlastQuestModal',
  components: {
    ModalComponent,
    ButtonComponent,
    QuestBox,
  },
  emits: ['close-modal'],
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
      isDarkTheme: false,
      openDailyQuest: false,
      userData: null as any,
      levelQuestList: [5, 30, 50, 100, 250],
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
    async account(currVal: string) {
      if (!currVal) return;
      const resp = await axios.get(`${OVN_QUESTS_API}/blast/user/${currVal}`);
      this.userData = resp.data;
    },
  },
  computed: {
    ...mapGetters('web3', ['evmProvider', 'provider']),
    ...mapGetters('accountData', ['account']),

    getHighestLevel() {
      if (!this.userData) return 0;

      return Math.max(this.userData?.levelQuestHistory.map((_: any) => _.level));
    },

    dailyQuestCount() {
      const ONE_DAY_UNIX = 86400;
      let lastClaim = null;
      console.log(this.userData, 'DATA');
      if (!this.userData) return null;
      if (this.userData && this.userData.dailyQuest?.length > 0) {
        const nowUnix = Math.floor(Date.now() / 1000);
        // eslint-disable-next-line no-unsafe-optional-chaining
        lastClaim = nowUnix - this.userData
          .dailyQuest[this.userData.dailyQuest.length - 1]?.time;
      }

      if (lastClaim && lastClaim < ONE_DAY_UNIX) {
        return new BN(ONE_DAY_UNIX).minus(lastClaim).div(3600).toFixed(0);
      }

      return null;
    },
  },
  methods: {
    closeQuests() {
      this.openDailyQuest = false;
    },
    async signEvmMessage(
      messageToSign: string,
      nonce: string,
    ): Promise<TSignedMessage | null> {
      console.log(this.evmProvider, this.account, '--this.evmProvider');
      const msg = `${Buffer.from(messageToSign, 'utf8').toString('hex')}`;
      const params = [msg, this.account];

      try {
        const response = await this.provider.request({
          method: 'personal_sign',
          params,
        });

        return {
          pubKey: this.account,
          signature: response ?? '',
          message: messageToSign,
          nonce,
        };
      } catch (error) {
        return null;
      }
    },
    async triggerDailyQuest() {
      console.log('CLAIM');
      this.openDailyQuest = true;
      console.log(this.openDailyQuest, 'CLAIM2');
      const nonce = getRandomString(24);
      const sign: TSignedMessage | null = await this.signEvmMessage(
        `Claim blast points on Overnight.fi, nonce: ${nonce}`,
        nonce,
      );

      const triggerClaim = await axios.post(`${OVN_QUESTS_API}/blast/claim`, {
        address: this.account,
        message: sign?.message,
        sign: sign?.signature,
        questType: TypeofQuest.DAILY,
      });
      console.log(triggerClaim, '---triggerClaim');
      console.log(sign, '---sign');
      console.log(sign, '---sign');
    },
    toggleTheme() {
      console.log('CHANGE2');
      this.$store.dispatch('theme/switchTheme');
    },
    closeModal() {
      console.log('closeModal');
      this.$emit('close-modal');
    },
  },
};
</script>

<style lang="scss" scoped>
.blast-modal {
  max-width: 860px;
  width: 100%;
  padding: 30px;
  overflow-x: hidden;

  h1 {
    font-size: 16px;
    font-weight: 600;
  }

  p {
    font-size: 15;
  }
}

.blast-modal__div {
  height: 1px;
  width: 100%;
  margin: 20px 0;
  background-color: var(--color-7);
}

.blast-modal__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 50px;
}

.blast-modal__item-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-steps {
  display: flex;
  width: 100%;
  margin: 10px 0;
  height: 12px;
  border-radius: 50px;
  background-color: var(--color-5);
}

.progress-steps__li {
  position: relative;
  width: 100%;
  height: 12px;

  span {
    font-size: 14px;
    font-weight: 500;
    position: absolute;
    bottom: -15px;
    right: -15px;
  }

  &:first-child {
    span {
      right: -5px;
    }
  }

  &.quest-completed {
    background-color: var(--color-3);
    z-index: 2;

    &:first-child {
      border-radius: 30px 0 0 30px;
    }

    &:last-child {
      border-radius: 0 30px 30px 0;
    }
  }
}

.progress-step-item {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: var(--color-6);
}

.progress-steps-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
}

.blast-modal__box-wrap {
  width: 100%;
  height: 100%;
  max-width: 200px;
}

.progress-steps-scroll {
  overflow-x: scroll;
}

.blast-modal__row--scroll {
  overflow-x: scroll;
  min-width: 900px;
}
</style>
