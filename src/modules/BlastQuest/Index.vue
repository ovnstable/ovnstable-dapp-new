<template>
  <div
    v-if="false"
    class="spinner-wrap"
  >
    <Spinner />
  </div>
  <div
    v-else
    class="page-wrap"
  >
    <div class="blast-wrap__jackpot">
      <div class="blast-wrap__jackpot-main">
        <h1>
          BLAST POINTS JACKPOT:
        </h1>
        <p>
          {{ jackpotData }}
        </p>
      </div>
      <div class="blast-wrap__jackpot-user">
        <h1>
          YOUR BLAST POINTS:
        </h1>
        <div class="blast-wrap__jackpot-user__data">
          <div class="blast-wrap__jackpot-user__data-i">
            <h3>
              TOTAL CLAIMED
            </h3>
            <p>
              000
            </p>
          </div>
          <div class="blast-wrap__jackpot-user__data-i">
            <h3>
              TOTAL PENDING
            </h3>
            <p>
              000
            </p>
          </div>
          <div class="blast-wrap__jackpot-user__data-i">
            <h3>
              MONTLY FREE DROPS
            </h3>
            <p>
              000
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="blast-wrap__content"
    >
      <div class="blast-wrap__item-col">
        <h1>
          DAILY BOX
        </h1>
        <p>
          Complete daily tasks to get Blast loot boxes!
          Each loot box contains a different amount of points that are guaranteed to drop out.
        </p>
      </div>
      <div class="blast-wrap__boxes">
        <div
          class="blast-wrap__boxes-col"
        >
          <div
            class="blast-wrap__boxes-content"
          >
            <h1>
              Bronze box
            </h1>
            <QuestBox
              :prize-value="dailyPrize"
              :open-box="openDailyQuest"
              :view-box="0"
              @close="closeQuests"
            />
          </div>

          <TasksData
            :view-box="0"
          />

          <ButtonComponent
            full
            :disabled="!!dailyQuestCount"
            @on-click="triggerDailyQuest"
            class="blast-wrap__boxes-col-btn"
          >
            {{ dailyQuestCount ? `WILL OPEN IN ${dailyQuestCount}h` : 'CLAIM' }}
          </ButtonComponent>
        </div>
        <div
          class="blast-wrap__boxes-col"
        >
          <div
            class="blast-wrap__boxes-content"
          >
            <h1>
              Silver box
            </h1>
            <QuestBox
              :prize-value="dailyPrize"
              :open-box="openDailyQuest"
              :view-box="1"
              @close="closeQuests"
            />
          </div>

          <TasksData
            :view-box="1"
          />

          <ButtonComponent
            full
            :disabled="!!dailyQuestCount"
            @on-click="triggerDailyQuest"
            class="blast-wrap__boxes-col-btn"
          >
            {{ dailyQuestCount ? `WILL OPEN IN ${dailyQuestCount}h` : 'CLAIM' }}
          </ButtonComponent>
        </div>
        <div
          class="blast-wrap__boxes-col"
        >
          <div
            class="blast-wrap__boxes-content"
          >
            <h1>
              Gold box
            </h1>
            <QuestBox
              :prize-value="dailyPrize"
              :open-box="openDailyQuest"
              :view-box="2"
              @close="closeQuests"
            />
          </div>

          <TasksData
            :view-box="2"
          />

          <ButtonComponent
            full
            :disabled="!!dailyQuestCount"
            @on-click="triggerDailyQuest"
            class="blast-wrap__boxes-col-btn"
          >
            {{ dailyQuestCount ? `WILL OPEN IN ${dailyQuestCount}h` : 'CLAIM' }}
          </ButtonComponent>
        </div>
      </div>
    </div>

    <!-- <div class="progress-steps-scroll">
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
      <div class="blast-wrap__row blast-wrap__row--scroll">
        <div
          v-for="(item, key) in Array.from({ length: 5 })"
          class="blast-wrap__box-col"
          :key="key"
        >
          <QuestBox
            :prize-value="weeklyPrize"
            :open-box="key === activeLevel && openWeeklyQuest ? true : false"
            :view-box="0"
            @close="closeQuests"
          />

          <ButtonComponent
            full
            :disabled="!(getHighestLevel >= key) || !!weeklyQuestCount"
            @on-click="triggerWeeklyQuest"
          >
            {{ getWeeklyBtn(key) }}
          </ButtonComponent>
        </div>
      </div>
    </div> -->

    <div class="blast-wrap__quests">
      <div class="blast-wrap__row">
        <h1>WEEKLY BONUS LOOT BOX QUEST</h1>
        <p>WEEKLY LOOT BOX WILL UPDATE IN: 23:59H</p>
      </div>
      <p class="blast-wrap__quests-jackpot-descr">
        Complete 4 daily tasks 5 times a week to get the legendary Diamond bonus loot box.
        The diamond loot box can contain both<br>
        the main prize and 3 regular boxes. Take part in a weekly quest and get a chance to win the
        <span>Jackpot!</span></p>
      <div class="blast-wrap__quests-daily-tasks blast-wrap__row">
        <img
          alt="navbar"
          :src="getImageUrl(`assets/blastQuest/SlothBlastQuest.png`)"
        />
        <ul class="blast-wrap__quests-task-list">
          <li
            v-for="(task, index) in tasks"
            :key="index"
            :class="{ completed: task.completed, incomplete: !task.completed }"
          >
            <div class="blast-wrap__quests-task">
              <div class="tasks-col__item-icon">
                <BaseIcon :name="task.completed ? 'CommonChecked' : 'CommonClose' " />
              </div>
              <span class="task-description">{{ task.description }}</span>
            </div>

          </li>
        </ul>
        <div class="blast-wrap__quests-diamond-box-wrapper">
          <div class="blast-wrap__quests-diamond-box">
            <div class="blast-wrap__quests-diamond-box-tip">
              <p>DIAMOND BOX</p>
              <BaseIcon
                name="tip"
              />
            </div>

            <QuestBox
              :prize-value="dailyPrize"
              :open-box="openDailyQuest"
              :view-box="3"
              @close="closeQuests"
            />
          </div>
          <p>DO TASKS TO GET LOOTBOX</p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-shadow -->
<script lang="ts">
import { mapGetters } from 'vuex';
import { getRandomString } from '@/utils/strings.ts';
import { OVN_QUESTS_API, awaitDelay, getImageUrl } from '@/utils/const.ts';
import axios from 'axios';
import ButtonComponent from '@/components/Button/Index.vue';
import QuestBox from '@/components/QuestBox/Index.vue';
import BN from 'bignumber.js';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import TasksData from './TasksData.vue';

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
  name: 'BlastQuestModule',
  components: {
    ButtonComponent,
    QuestBox,
    TasksData,
    BaseIcon,
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
      openWeeklyQuest: false,
      userData: null as any,
      activeLevel: 0,
      dailyPrize: '',
      weeklyPrize: '',
      levelQuestList: [5, 30, 50, 100, 250],
      tasks: this.createTasks(5),
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
    account(currVal: string) {
      if (!currVal) return;
      this.updateUserQuestData(currVal);
    },
  },
  computed: {
    ...mapGetters('web3', ['evmProvider', 'provider']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('jackpotData', ['jackpotData']),

    getWeeklyBtn() {
      return (level: number) => {
        if (level < this.getHighestLevel) return 'Claimed';
        return this.weeklyQuestCount ? `WILL OPEN IN ${this.weeklyQuestCount}h` : 'CLAIM';
      };
    },
    getHighestLevel() {
      if (!this.userData || this.userData?.levelQuestHistory?.length === 0) return 0;

      console.log(this.userData, '---this.userData');
      return Math.max(this.userData?.levelQuestHistory.map((_: any) => _.level));
    },

    weeklyQuestCount() {
      const ONE_DAY_UNIX = 86400;
      let lastClaim = null;
      console.log(this.userData, 'DATA');
      if (!this.userData || this.userData?.levelQuestHistory?.length === 0) return null;
      if (this.userData && this.userData.levelQuestHistory?.length > 0) {
        const nowUnix = Math.floor(Date.now() / 1000);
        // eslint-disable-next-line no-unsafe-optional-chaining
        lastClaim = nowUnix - this.userData
          .levelQuestHistory[this.userData.levelQuestHistory.length - 1]?.time;
      }

      if (lastClaim && lastClaim < ONE_DAY_UNIX * 7) {
        return new BN(ONE_DAY_UNIX * 7).minus(lastClaim).div(3600).toFixed(0);
      }

      return null;
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
    getImageUrl,
    async updateUserQuestData(acc: string) {
      const resp = await axios.get(`${OVN_QUESTS_API}/blast/user/${acc}`);
      console.log(resp, 're-sp');
      this.userData = resp.data;
    },
    closeQuests() {
      this.openDailyQuest = false;
      this.openWeeklyQuest = false;
      this.weeklyPrize = '';
      this.dailyPrize = '';
      this.activeLevel = 0;
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
    async triggerWeeklyQuest() {
      console.log('CLAIM WEKK');
      const nonce = getRandomString(24);
      const sign: TSignedMessage | null = await this.signEvmMessage(
        `Claim blast points on Overnight.fi, nonce: ${nonce}`,
        nonce,
      );

      const triggerClaim = await axios.post(`${OVN_QUESTS_API}/blast/claim`, {
        address: this.account,
        message: sign?.message,
        sign: sign?.signature,
        questType: TypeofQuest.LEVELQUEST,
      });

      this.activeLevel = this.getHighestLevel;
      this.openWeeklyQuest = true;
      this.weeklyPrize = triggerClaim.data?.amount;

      // waiting for animation
      await awaitDelay(2000);
      this.updateUserQuestData(this.account);
      console.log(triggerClaim, '---triggerClaim');
    },
    async triggerDailyQuest() {
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

      this.dailyPrize = triggerClaim.data?.amount;
      this.openDailyQuest = true;

      // waiting for animation
      await awaitDelay(2000);
      this.updateUserQuestData(this.account);
      console.log(triggerClaim, '---triggerClaim');
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
    createTasks(numberOfDays: any) {
      const tasks = [];
      for (let day = 1; day <= numberOfDays; day++) {
        tasks.push({
          description: `Do 4 tasks from daily loot box quest ${day} day${day > 1 ? 's' : ''}`,
          completed: false,
        });
      }
      if (tasks.length) tasks[0].completed = true;
      return tasks;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-wrap {
  width: 100%;
  overflow-x: hidden;
  background-color: var(--color-4);
  padding: 30px;
  border-radius: 30px;

  h1 {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-1);
  }

  p {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-1);
  }
}

.blast-wrap__jackpot {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.blast-wrap__jackpot-main {
  width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: var(--color-3);
  font-weight: 700;
  border-radius: 10px;
  padding: 24px;

  h1, p {
    font-weight: 700;
    color: var(--color-4);
  }

  h1 {
    font-size: 17px
  }

  p {
    font-size: 21px;
  }
}

.blast-wrap__jackpot-user {
  width: 75%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 21px;
  border-radius: 10px;
  padding: 24px;
  border: 1px solid var(--color-1);

  h1 {
    font-size: 17px;
  }
}

.blast-wrap__jackpot-user__data {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.blast-wrap__jackpot-user__data-i {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  width: 100%;

  h3 {
    font-weight: 500;
    font-size: 15px;
  }
}

.blast-wrap__div {
  height: 1px;
  width: 100%;
  margin: 20px 0;
  background-color: var(--color-7);
}

.blast-wrap__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 50px;
}

.blast-wrap__item-col {
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

.blast-wrap__boxes {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 16px;
}

.blast-wrap__boxes-col-btn {
  margin-top: 20px;
}

.blast-wrap__boxes-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  width: 100%;
}

.blast-wrap__boxes-content {
  text-align: center;
  width: 100%;
  padding: 12px 0;
  background-color: var(--color-4);
  margin-bottom: 20px;
  border: 1px solid var(--color-6);
  border-radius: 10px;
}

.blast-wrap__row--scroll {
  overflow-x: scroll;
  min-width: 800px;
}

.blast-wrap__content {
  border-radius: 30px;
  padding: 24px;
  background-color: var(--color-8);
  font-size: 16px;
  font-weight: 600;
}

.blast-wrap__quests {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-top: 20px;
  background-color: var(--color-8);
  border-radius: 30px;
  [data-theme="dark"] & {
    background-color: var(--color-7);
    p {
      color: var(--color-4);
    }
  }
}
.blast-wrap__quests-jackpot-descr {
  font-size: 14px;
  margin-top: 24px;
  margin-bottom: 24px;
  span {
    text-decoration: underline;
  }
}

.blast-wrap__quests-task-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--color-1);
  font-size: 14px;
  .completed {
    color: var(--color-2);
    text-decoration: line-through;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
  .incomplete {
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.blast-wrap__quests-task-list li {
  margin-bottom: 18px;
}

.blast-wrap__quests-task-list li:last-child {
  margin-bottom: 0;
}

.blast-wrap__quests-task {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.task-status-icon {
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
  background-color: var(--color-4);
  border: 1px solid var(--color-6);
}

.tasks-col__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  min-width: 22px;
  min-height: 22px;
  border-radius: 50%;
  background-color: var(--color-4);
  border: 1px solid var(--color-3);
  margin-right: 10px;
}

.blast-wrap__quests-diamond-box-wrapper
.blast-wrap__quests-diamond-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.blast-wrap__quests-diamond-box-wrapper p:last-child {
  text-align: center;
  font-size: 14px;
  color: var(--color-2);
  font-weight: 500;
  padding: 5px 30px;
  background-color: var(--color-5);
  border: 1px solid var(--color-6);
  border-radius: 30px;
  [data-theme="dark"] & {
    color: var(--color-4);
    background-color: var(--color-6);
  }
}

.blast-wrap__quests-diamond-box {
  gap: 20px;
  background-color: var(--color-4);
  border: 1px solid var(--color-6);
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 12px 20px 22px;
  p {
    font-size: 16px;
    font-weight: 600;
  }

}
.blast-wrap__quests-diamond-box-tip {
  display: flex;
  flex-direction: row;
  margin-left: 38px;
  svg {
    margin-left: 38px;
    overflow: visible;
    cursor: pointer;
  }
}

@media screen and (max-width: 1024px) {
  .page-wrap {
    margin-bottom: 80px;
  }
  .blast-wrap__quests-daily-tasks {
    flex-wrap: wrap;
    align-items: center;
  }
  .blast-wrap__quests-diamond-box,
  .blast-wrap__quests-diamond-box-wrapper {
    width: 100%;
  }
}

</style>
