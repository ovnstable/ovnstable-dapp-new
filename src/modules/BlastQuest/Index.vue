<template>
  <div
    v-if="false"
    class="spinner-wrap"
  >
    <Spinner />
  </div>
  <div v-else>
    <div class="page-wrap">
      <div class="blast-wrap__jackpot">
        <div class="blast-wrap__jackpot-main-wrapper">
          <div class="blast-wrap__jackpot-main">
            <h1>
              EVENT JACKPOT VAULT:
            </h1>
            <div
              class="spinner-container"
              v-if="!jackpotDataLoaded"
            >
              <Spinner />
            </div>
            <div
              v-else
              class="blast-wrap__jackpot-main-points"
            >
              <BaseIcon
                name="blastSidebar"
              />
              <div class="glitch-wrapper glitch-wrapper--title">
                <div
                  class="stack"
                  style="--stacks: 3;"
                >
                  <span style="--index: 0;">{{ jackpotData?.goldBlast }}</span>
                  <span style="--index: 1;">{{ jackpotData?.goldBlast }}</span>
                  <span style="--index: 2;">{{ jackpotData?.goldBlast }}</span>
                </div>
              </div>
              <BaseIcon
                name="blastSidebar"
              />
            </div>

            <p>Blast Gold</p>
          </div>
          <div class="blast-wrap__jackpot-main-wrapper-divider" />
          <div class="blast-wrap__jackpot-main">
            <h1>
              DAILY LOOT BOXES VAULT:
            </h1>
            <div
              class="spinner-container"
              v-if="!jackpotDataLoaded"
            >
              <Spinner />
            </div>
            <div
              v-else
              class="blast-wrap__jackpot-main-points"
            >
              <div class="glitch-wrapper glitch-wrapper--title">
                <div
                  class="stack"
                  style="--stacks: 3;"
                >
                  <span style="--index: 0;">{{ jackpotData?.amount }}</span>
                  <span style="--index: 1;">{{ jackpotData?.amount }}</span>
                  <span style="--index: 2;">{{ jackpotData?.amount }}</span>
                </div>
              </div>
            </div>

            <p>Blast Points</p>
          </div>

        </div>
        <div class="blast-wrap__jackpot-user">
          <div class="blast-wrap__jackpot-user-points">
            <h1>
              YOUR BLAST POINTS:
            </h1>
          <!-- <p>From 00 Jan ‘00</p> -->
          </div>

          <div class="blast-wrap__jackpot-user__data">
            <div class="blast-wrap__jackpot-user__data-divider" />
            <div class="blast-wrap__jackpot-user__data-i">
              <h3>
                Total:
              </h3>
              <p>
                {{ userData ? userData.totallyEarned : 0 }}
              </p>
            </div>
            <div class="blast-wrap__jackpot-user__data-divider" />
            <div class="blast-wrap__jackpot-user__data-i">
              <h3>
                Pending:
              </h3>
              <p>
                {{ userData ? userData.totallyPending : 0 }}
              </p>
            </div>
            <div class="blast-wrap__jackpot-user__data-divider" />
            <div class="blast-wrap__jackpot-user__data-i min-width">
              <h3>
                Airdrops:
              </h3>
              <p
                :class="{
                  gold: userData?.totallyAirdropGolds !== 0,
                }"
              >
                {{ userData ? userData?.totallyAirdropGolds : 0 }} golds
              </p>
            </div>
            <div class="blast-wrap__jackpot-user__data-divider" />
          </div>
        </div>
      </div>

      <div
        class="blast-wrap__content"
      >
        <div class="blast-wrap__item-col">
          <div class="blast-wrap__item-col-daily">
            <h1>
              DAILY LOOT BOX
            </h1>
            <p>DAILY LOOT BOX WILL UPDATE IN: {{ timeToDailyUpdate }}</p>
          </div>

          <p>
            Complete 1 daily tasks to get the Blast loot box! The boxes contain a random
            amount of <span>Blast points</span> within
            the range shown under the box. Good luck and have fun!
          </p>
        </div>
        <div class="blast-wrap__boxes">
          <div
            class="blast-wrap__boxes-col"
          >
            <div
              class="blast-wrap__boxes-content"
            >
              <BaseIcon
                name="tip"
                @click="showFaqModalTrigger(typeofBox.BRONZE)"
              />
              <h1>
                Bronze box
              </h1>

              <div
                class="spinner-box"
                v-if="!jackpotDataLoaded"
              >
                <Spinner />
              </div>
              <template v-else>
                <p>
                  Up to {{ buildPointsRange(typeofBox.BRONZE) }} points
                </p>
                <QuestBox
                  :prize-value="dailyPrize"
                  :open-box="openBronzeQuest"
                  :view-box="typeofBox.BRONZE"
                  @close="closeQuests"
                />
              </template>
            </div>

            <TasksData
              :view-box="0"
              :box-data="userData.bronzeBox"
              @check-quest="checkQuest"
              @check-twitter="checkTwitter"
            />

            <ButtonComponent
              full
              :disabled="isDisabledBtn(typeofBox.BRONZE)"
              v-if="isDisabledBtn(typeofBox.BRONZE)"
              class="blast-wrap__boxes-col-btn"
            >
              DO TASKS TO GET LOOTBOX
            </ButtonComponent>
            <ButtonComponent
              full
              @on-click="triggerBoxQuest(typeofBox.BRONZE)"
              :disabled="isDisabledBtn(typeofBox.BRONZE)"
              class="blast-wrap__boxes-col-btn"
              v-else-if="!claimLoading || isDisabledBtn(typeofBox.BRONZE)"
            >
              {{ isDisabledBtn(typeofBox.BRONZE) ? 'DO TASKS TO GET LOOTBOX' : `CLAIM (${userData.bronzeBoxAvailable} box)` }}
            </ButtonComponent>
            <ButtonComponent
              v-else
              loading
              class="blast-wrap__boxes-col-btn"
            >
              Loading
            </ButtonComponent>
          </div>
          <div
            class="blast-wrap__boxes-col"
          >
            <div
              class="blast-wrap__boxes-content"
            >
              <BaseIcon
                name="tip"
                @click="showFaqModalTrigger(typeofBox.SILVER)"
              />
              <h1>
                Silver box
              </h1>
              <div
                class="spinner-box"
                v-if="!jackpotDataLoaded"
              >
                <Spinner />
              </div>
              <template v-else>
                <p>
                  Up to {{ buildPointsRange(typeofBox.SILVER) }} points
                </p>
                <QuestBox
                  :prize-value="dailyPrize"
                  :open-box="openSilverQuest"
                  :view-box="typeofBox.SILVER"
                  :quest-data="userData"
                  @close="closeQuests"
                />
              </template>
            </div>

            <TasksData
              :view-box="1"
              :box-data="userData.silverBox"
              @check-quest="checkQuest"
            />

            <ButtonComponent
              full
              class="blast-wrap__boxes-col-btn"
              :disabled="isDisabledBtn(typeofBox.SILVER)"
              v-if="isDisabledBtn(typeofBox.SILVER)"
            >
              DO TASKS TO GET LOOTBOX
            </ButtonComponent>
            <ButtonComponent
              full
              @on-click="triggerBoxQuest(typeofBox.SILVER)"
              :disabled="isDisabledBtn(typeofBox.SILVER)"
              class="blast-wrap__boxes-col-btn"
              v-else-if="!claimLoading"
            >
              {{ isDisabledBtn(typeofBox.SILVER) ? 'DO TASKS TO GET LOOTBOX' : `CLAIM (${userData.silverBoxAvailable} box)` }}
            </ButtonComponent>
            <ButtonComponent
              v-else
              loading
              class="blast-wrap__boxes-col-btn"
            >
              Loading
            </ButtonComponent>
          </div>
          <div
            class="blast-wrap__boxes-col"
          >
            <div
              class="blast-wrap__boxes-content"
            >
              <BaseIcon
                name="tip"
                @click="showFaqModalTrigger(typeofBox.GOLD)"
              />
              <h1>
                Gold box
              </h1>

              <div
                class="spinner-box"
                v-if="!jackpotDataLoaded"
              >
                <Spinner />
              </div>
              <template v-else>
                <p>
                  Up to {{ buildPointsRange(typeofBox.GOLD) }} points
                </p>
                <QuestBox
                  :prize-value="dailyPrize"
                  :open-box="openGoldQuest"
                  :view-box="typeofBox.GOLD"
                  @close="closeQuests"
                />
              </template>
            </div>

            <TasksData
              :view-box="2"
              :box-data="userData.goldBox"
              @check-quest="checkQuest"
            />

            <ButtonComponent
              full
              :disabled="isDisabledBtn(typeofBox.GOLD)"
              v-if="isDisabledBtn(typeofBox.GOLD)"
              class="blast-wrap__boxes-col-btn"
            >
              DO TASKS TO GET LOOTBOX
            </ButtonComponent>
            <ButtonComponent
              full
              @on-click="triggerBoxQuest(typeofBox.GOLD)"
              :disabled="isDisabledBtn(typeofBox.GOLD)"
              class="blast-wrap__boxes-col-btn"
              v-else-if="!claimLoading"
            >
              {{ isDisabledBtn(typeofBox.GOLD) ? 'DO TASKS TO GET LOOTBOX' : `CLAIM (${userData.goldBoxAvailable} box)` }}
            </ButtonComponent>
            <ButtonComponent
              v-else
              loading
              class="blast-wrap__boxes-col-btn"
            >
              Loading
            </ButtonComponent>
          </div>
        </div>
      </div>

      <div class="blast-wrap__quests">
        <div class="blast-wrap__row">
          <h1>WEEKLY BONUS LOOT BOX QUEST</h1>
          <p>WEEKLY LOOT BOX WILL UPDATE IN: {{ timeToWeeklyUpdate }}</p>
        </div>
        <p class="blast-wrap__quests-jackpot-descr">
          Once a week you will be able to claim a Diamond Box.
          Having received Diamond Box you can try your luck and win the
          <span>Blast Gold Jackpot.</span>
          To do so, you need to complete a total of 15 tasks in a week but no more than 3 per day.
          Progress through completing 15 tasks of weekly quest and you will receive a
          Diamond Box that opens on Sunday,
          it will contain a random amount of Blast Gold of Jackpot!</p>
        <div class="blast-wrap__quests-daily-tasks">
          <img
            alt="navbar"
            src="/blastQuest/SlothBlastQuest.png"
          />
          <div class="blast-wrap__quests-diamond-box-wrapper">
            <div class="blast-wrap__quests-diamond-box">
              <div class="blast-wrap__quests-diamond-box-tip">
                <h1>DIAMOND BOX</h1>
                <BaseIcon
                  name="tip"
                  @click="showFaqModalTrigger(typeofBox.DIAMOND)"
                />
              </div>
              <div
                class="spinner-box"
                v-if="!jackpotDataLoaded"
              >
                <Spinner />
              </div>
              <template v-else>
                <p>
                  Up to {{ buildPointsRange(typeofBox.DIAMOND) }} GOLD BLAST
                </p>

                <QuestBox
                  :prize-value="dailyPrize"
                  :open-box="openDiamondQuest"
                  :view-box="3"
                  @close="closeQuests"
                />
              </template>
            </div>
            <ButtonComponent
              full
              :disabled="isDisabledBtn(typeofBox.DIAMOND)"
              v-if="isDisabledBtn(typeofBox.DIAMOND)"
              class="blast-wrap__boxes-col-btn"
            >
              DO TASKS TO GET LOOTBOX
            </ButtonComponent>
            <ButtonComponent
              @on-click="triggerBoxQuest(typeofBox.DIAMOND)"
              class="blast-wrap__boxes-col-btn"
              v-else-if="!claimLoading"
            >
              {{ `CLAIM (${userData.diamondBoxAvailable} box)` }}
            </ButtonComponent>
            <ButtonComponent
              v-else
              loading
              class="blast-wrap__boxes-col-btn"
            >
              Loading
            </ButtonComponent>
          </div>
          <div class="blast-wrap__quests-task-slider">

            <ul class="blast-wrap__quests-task-status">
              <li
                v-for="(task, index) in tasksData"
                :key="index"
                :class="{ completed: task.completed, incomplete: !task.completed }"
              >
                <div class="task-status-container">
                  <div
                    class="tasks-col__item-icon"
                    :class="{ 'completed-task': task.completed }"
                  >
                    <BaseIcon :name="task.completed ? 'CommonChecked' : 'CommonClose'" />
                  </div>
                </div>
              </li>
            </ul>

            <ul class="blast-wrap__quests-task-list">
              <li
                v-for="(task, index) in tasksData"
                :key="index"
                :class="{ completed: task.completed, incomplete: !task.completed }"
              >
                <span>{{ task.description }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <h1 class="table-title">
      TOP Dashboard
    </h1>
    <DashboardTable
      :users="usersDashboardList"
      :jackpot="jackpotData?.amount ?? 0"
    />
    <LikeRetweetModal
      v-if="likedQuest == null || retweetedQuest == null"
      :is-show="showModalLikeRetweet"
      :verify-tweet="tweetLoading"
      @twitter-submit="twitterSubmit"
    />
    <LikedModal
      v-if="likedQuest && retweetedQuest"
      v-model="showModalLikeRetweet"
      @close-modal="closeModalLikeRetweet"
    />
    <NotLikedModal
      v-if="likedQuest == false || retweetedQuest == false"
      v-model="showModalLikeRetweet"
      @close-modal="closeModalLikeRetweet"
    />
    <FAQModal
      v-model="showFaqModal"
      :view-box="showFaqModalBoxType"
      :range-box="buildPointsRange(showFaqModalBoxType)"
      @close-modal="showFaqModal = false"
    />
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { notify as notifyInst } from '@kyvg/vue3-notification';
import { getRandomString } from '@/utils/strings.ts';
import { OVN_QUESTS_API, awaitDelay, getImageUrl } from '@/utils/const.ts';
import axios from 'axios';
import ButtonComponent from '@/components/Button/Index.vue';
import QuestBox, { TypeofQuest } from '@/components/QuestBox/Index.vue';
import BN from 'bignumber.js';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import Spinner from '@/components/Spinner/Index.vue';
import dayjs from 'dayjs';
import LikeRetweetModal from '@/modules/BlastQuest/LikeRetweetModal.vue';
import LikedModal from '@/modules/BlastQuest/LikedModal.vue';
import FAQModal from '@/modules/BlastQuest/FAQModal.vue';
import DashboardTable from '@/modules/BlastQuest/Table.vue';
import NotLikedModal from '@/modules/BlastQuest/NotLikedModal.vue';
import { type TSignedMessage, BOX_RANGES } from './models.ts';
import TasksData from './TasksData.vue';

export default {
  name: 'BlastQuestModule',
  components: {
    ButtonComponent,
    QuestBox,
    TasksData,
    BaseIcon,
    Spinner,
    LikeRetweetModal,
    LikedModal,
    FAQModal,
    DashboardTable,
    NotLikedModal,
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
      typeofBox: TypeofQuest,
      showModal: false,
      showFaqModal: false,
      showFaqModalBoxType: TypeofQuest.BRONZE,
      isDarkTheme: false,
      openBronzeQuest: false,
      openSilverQuest: false,
      openGoldQuest: false,
      openDiamondQuest: false,
      showModalLikeRetweet: false,
      tweetLoading: false,
      userData: {
        bronzeBox: [] as any,
        silverBox: [] as any,
        goldBox: [] as any,
        totallyEarned: 0,
        totallyPending: 0,
        bronzeBoxAvailable: 0,
        silverBoxAvailable: 0,
        goldBoxAvailable: 0,
        diamondBoxAvailable: 0,
        totallyAirdropGolds: 0,
      },
      activeLevel: 0,
      dailyPrize: '',
      weeklyPrize: '',
      levelQuestList: [5, 30, 50, 100, 250],
      tasksData: this.createTasks(5),
      usersDashboardList: [],
      claimLoading: false,
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
    jackpotData(currVal: any) {
      if (!currVal?.amount) return;

      this.loadDashboard();
    },
  },
  mounted() {
    if (!this.account) return;
    this.updateUserQuestData(this.account);
  },
  computed: {
    ...mapGetters('web3', ['evmProvider', 'provider']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('jackpotData', ['jackpotData', 'jackpotDataLoaded', 'likedQuest', 'retweetedQuest']),

    timeToDailyUpdate() {
      if (!this.jackpotData || !this.jackpotData?.questDuration) return '00:00';
      const DAY_UNIX = 86400;
      const now = dayjs().unix();
      const nextUpdate = new BN(this.jackpotData?.questDuration?.dayStartUnix)
        .plus(DAY_UNIX).toNumber();
      const timeDifference = new BN(nextUpdate).minus(now).toNumber();

      if (timeDifference < 0) return '00:00 h:m';

      const hours = Math.floor(timeDifference / 3600);
      const minutes = Math.floor((timeDifference % 3600) / 60);

      return `${hours > 10 ? hours : `0${hours}`}:${minutes > 10 ? minutes : `0${minutes}`} h:m`;
    },
    timeToWeeklyUpdate() {
      if (!this.jackpotData || !this.jackpotData?.questDuration) return '00:00';
      const now = dayjs().unix();
      const ONE_DAY_UNIX = 86400;
      const nextUpdate = new BN(this.jackpotData?.questDuration?.weekStartUnix)
        .plus(ONE_DAY_UNIX * 7).toNumber();
      const timeDifference = new BN(nextUpdate).minus(now).toNumber();

      if (timeDifference < 0) return '00:00 h:m';

      const days = Math.floor(timeDifference / (3600 * 24));
      const hours = Math.floor((timeDifference % (3600 * 24)) / 3600);
      const minutes = Math.floor((timeDifference % 3600) / 60);

      return `${days}:${hours > 10 ? hours : `0${hours}`}:${minutes > 10 ? minutes : `0${minutes}`} d:h:m`;
    },
    buildPointsRange() {
      return (questType: TypeofQuest) => {
        if (!this.jackpotData?.amount) return '0';
        const data = BOX_RANGES.find((_) => _.quest === questType);
        if (!data) return '0';

        if (questType === TypeofQuest.DIAMOND) {
          return `${new BN(data?.max).times(this.jackpotData?.goldBlast).toFixed(0)}`;
        }

        return `${new BN(data?.max).times(this.jackpotData?.amount).toFixed(0)}`;
      };
    },
    isDisabledBtn() {
      return (questType: TypeofQuest) => {
        if (questType === TypeofQuest.BRONZE && this.userData.bronzeBoxAvailable > 0) return false;
        if (questType === TypeofQuest.SILVER && this.userData.silverBoxAvailable > 0) return false;
        if (questType === TypeofQuest.GOLD && this.userData.goldBoxAvailable > 0) return false;
        if (questType === TypeofQuest.DIAMOND && this.userData.diamondBoxAvailable > 0) {
          return false;
        }
        return true;
      };
    },

    bronzeCount() {
      const ONE_DAY_UNIX = 86400;
      let lastClaim = null;

      if (!this.userData) return null;
      if (this.userData && this.userData.bronzeBox?.length > 0) {
        const nowUnix = Math.floor(Date.now() / 1000);
        // eslint-disable-next-line no-unsafe-optional-chaining
        lastClaim = nowUnix - this.userData
          .bronzeBox[this.userData.bronzeBox.length - 1]?.time;
      }

      if (lastClaim && lastClaim < ONE_DAY_UNIX) {
        return new BN(ONE_DAY_UNIX).minus(lastClaim).div(3600).toFixed(0);
      }

      return null;
    },
  },
  methods: {
    getImageUrl,
    async loadDashboard() {
      // 16k points per 1 gold
      const SINGLE_GOLD = 16000;

      const resp = await axios.get(`${OVN_QUESTS_API}/blast/dashboard`);

      const filterData = resp.data.filter((_: any) => new BN(_?.claimed).gt(0));
      const mappedData = filterData.map((_: any) => {
        const goldPart = new BN(_.claimedGolds).times(SINGLE_GOLD);
        let partTotal = new BN(_.claimed).plus(goldPart);

        if (partTotal.eq(0) || this.jackpotData.amount === 0) partTotal = new BN(0);
        const totalJackpot = new BN(this.jackpotData.amount)
          .plus(new BN(this.jackpotData.goldBlast).times(SINGLE_GOLD));

        partTotal = new BN(partTotal).div(totalJackpot);

        return {
          ..._,
          jackpotShare: partTotal.gt(0.000001) ? partTotal.toFixed(6) : '0.000001',
        };
      });

      const sorted = mappedData
        .sort((a: any, b: any) => (new BN(a?.jackpotShare).gt(b?.jackpotShare) ? -1 : 1));

      this.usersDashboardList = sorted.slice(0, 50);
    },
    showFaqModalTrigger(type: TypeofQuest) {
      this.showFaqModal = true;
      this.showFaqModalBoxType = type;
    },
    toggleModalLikeRetweet() {
      this.showModalLikeRetweet = !this.showModalLikeRetweet;
    },
    closeModalLikeRetweet() {
      this.showModalLikeRetweet = false;
    },
    async updateUserQuestData(acc: string) {
      const resp = await axios.get(`${OVN_QUESTS_API}/blast/user/${acc}`);

      if (resp.data) this.userData = resp.data;
      this.tasksData = this.createTasks(5, resp.data);
    },
    closeQuests() {
      this.openBronzeQuest = false;
      this.openSilverQuest = false;
      this.openGoldQuest = false;
      this.openDiamondQuest = false;
      this.weeklyPrize = '';
      this.dailyPrize = '';
      this.activeLevel = 0;
    },
    async signEvmMessage(
      messageToSign: string,
      nonce: string,
    ): Promise<TSignedMessage | null> {
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
    async checkTwitter() {
      this.toggleModalLikeRetweet();
    },
    async twitterSubmit(id: string) {
      this.tweetLoading = true;
      const triggerCheck = await axios.post(`${OVN_QUESTS_API}/blast/checkquest`, {
        address: this.account,
        questId: '0',
        boxId: TypeofQuest.BRONZE,
        twitterId: id,
      });

      if (!triggerCheck?.data?.isChecked) {
        notifyInst({
          title: 'Task status',
          text: triggerCheck?.data?.error ?? 'Error: task not passed, or limit exceeded, please wait for 1 minute',
          type: 'error',
        });
      } else {
        notifyInst({
          title: 'Task status',
          text: 'Success - Like and Retweet counted!',
          type: 'success',
        });
        this.$store.commit('jackpotData/setIsLikedQuest', true);
        this.$store.commit('jackpotData/setIsRetweetedQuest', true);
      }

      this.updateUserQuestData(this.account);
      this.tweetLoading = false;
    },
    async checkQuest(id: string, boxType: TypeofQuest) {
      const triggerCheck = await axios.post(`${OVN_QUESTS_API}/blast/checkquest`, {
        address: this.account,
        questId: id,
        boxId: boxType,
      });

      if (!triggerCheck?.data?.isChecked) {
        notifyInst({
          title: 'Task status',
          text: triggerCheck?.data?.error ?? 'Error: task not passed',
          type: 'error',
        });
      }

      if (triggerCheck?.data?.isChecked) {
        notifyInst({
          title: 'Task status',
          text: 'Success - quest passed!',
          type: 'success',
        });
      }

      this.updateUserQuestData(this.account);
    },
    async triggerBoxQuest(boxType: TypeofQuest) {
      try {
        const nonce = getRandomString(24);
        this.claimLoading = true;

        const sign: TSignedMessage | null = await this.signEvmMessage(
          `Claim blast points on Overnight.fi, nonce: ${nonce}`,
          nonce,
        );

        const triggerClaim = await axios.post(`${OVN_QUESTS_API}/blast/claim`, {
          address: this.account,
          message: sign?.message,
          sign: sign?.signature,
          questType: boxType,
        });

        if (triggerClaim?.data?.error) {
          notifyInst({
            title: 'Claim error',
            text: triggerClaim?.data.error,
            type: 'error',
          });
          return;
        }

        this.dailyPrize = triggerClaim.data?.amount;

        if (boxType === TypeofQuest.BRONZE) this.openBronzeQuest = true;
        if (boxType === TypeofQuest.SILVER) this.openSilverQuest = true;
        if (boxType === TypeofQuest.GOLD) this.openGoldQuest = true;
        if (boxType === TypeofQuest.DIAMOND) this.openDiamondQuest = true;

        // waiting for animation
        await awaitDelay(2000);
        this.updateUserQuestData(this.account);
        this.claimLoading = false;
      } catch (e) {
        console.log(e);
        this.claimLoading = false;
      }
    },
    toggleTheme() {
      this.$store.dispatch('theme/switchTheme');
    },
    closeModal() {
      this.$emit('close-modal');
    },
    createTasks(numberOfDays: number, userData: any) {
      const streakNum = userData?.daysStreak?.streakNum ?? 0;
      const tasks = Array.from({ length: numberOfDays }).map((_, key) => ({
        description: `Do 3 tasks from daily loot box quest ${key + 1} day${key + 1 > 1 ? 's' : ''}`,
        completed: streakNum > key,
      }));

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
  margin-bottom: 40px;
  border: 1px solid var(--color-1);

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

  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.blast-wrap__jackpot {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 24px;
}
.blast-wrap__jackpot-main-wrapper-divider {
  height: 100%;
  border: 1px solid var(--color-4);
}
.blast-wrap__jackpot-main-wrapper {
  width: 70%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background-color: var(--color-3);
  font-weight: 700;
  border-radius: 10px;
  padding: 22px 12px;
  border: 1px solid var(--color-1);
  box-shadow: 0px 1px 0px 0px var(--color-1);
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}

.blast-wrap__jackpot-main {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  border-radius: 10px;

  h1, p {
    font-weight: 700;
    color: var(--color-4);
  }

  h1 {
    font-weight: 500;
    font-size: 17px;
    margin-bottom: 10px;
  }

  p {
    font-size: 21px;
  }

  [data-theme="dark"] & {
    box-shadow: none;
    border-color: var(--color-2);
    background-color: var(--color-7);
  }
}

.blast-wrap__jackpot-main p:last-child {
  font-size: 15px;
  font-weight: 500;
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
  box-shadow: 0px 1px 0px 0px var(--color-1);

  h1 {
    font-size: 17px;
  }
  [data-theme="dark"] & {
    box-shadow: none;
    border-color: var(--color-2);
  }
}
.blast-wrap__jackpot-user-points {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  p {
    font-size: 14px;
    color: var(--color-2);
    [data-theme="dark"] & {
      color: var(--color-18);
    }
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
  gap: 12px;
  text-align: center;
  width: 100%;

  &.min-width {
    min-width: 150px;
  }

  h3 {
    font-weight: 500;
    font-size: 15px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
  p {
    [data-theme="dark"] & {
      color: var(--color-4);
    }
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
  p {
    color: var(--color-2);
  }
}

.blast-wrap__item-col {
  display: flex;
  flex-direction: column;
  gap: 26px;
  span {
    text-decoration: underline;
  }
}

.blast-wrap__item-col p:last-child {
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.blast-wrap__item-col-daily {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  p {
    color: var(--color-2);
  }
  [data-theme="dark"] & {
    h1 {
      color: var(--color-4);
    }
    p {
      color: var(--color-18);
    }
  }
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
  margin-top: 26px;
  gap: 16px;
}

.blast-wrap__boxes-col-btn {
  margin-top: 20px;
  [data-theme="dark"] & {
    box-shadow: none;
    background-color: var(--color-17);
    color: var(--color-18);
  }
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
  position: relative;

  p {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-2);
    margin-top: 5px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
  svg {
    position: absolute;
    overflow: visible;
    left: 90%;
    top: 10%;
    cursor: pointer;
    [data-theme="dark"] & {
      fill: var(--color-4);
    }
  }

  [data-theme="dark"] & {
    background-color: var(--color-17);
  }

  h1 {
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.spinner-container {
  display: flex;
  transform: scale(0.5);
  margin-top: -20px;
}

.spinner-box {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-top: 20px;
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}

.blast-wrap__quests {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-top: 24px;
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
  padding-top: 4px;
  padding-bottom: 4px;
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
  border: 1px solid var(--color-6);
  [data-theme="dark"] & {
    background-color: var(--color-7);
    border-color: var(--color-2);
  }
}

.completed-task {
  border: none;
  border-radius: 50px 50px 0 0;
}

.blast-wrap__quests-diamond-box-wrapper
.blast-wrap__quests-diamond-box {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-2);
  }
}

.blast-wrap__quests-diamond-box-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 320px;
  margin-right: 30px;
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
  background-color: var(--color-4);
  border: 1px solid var(--color-6);
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 12px 20px 22px;
  position: relative;

  p {
    font-size: 16px;
    font-weight: 600;
    margin-top: 5px;
  }
  svg {
    position: absolute;
    overflow: visible;
    left: 90%;
    top: 10%;
    cursor: pointer;
  }
  [data-theme="dark"] & {
    background-color: var(--color-17);
    h1 {
      color: var(--color-4);
    }
    p {
      color: var(--color-18);
    }
    svg {
      fill: var(--color-4);
    }
  }

}
.blast-wrap__quests-diamond-box-tip {
  display: flex;
  flex-direction: row;
}

.blast-wrap__quests-task-slider {
  display: flex;
  flex-direction: row;
}

.blast-wrap__quests-task-status {
  display: flex;
  flex-direction: column;
  gap: 31px;
  margin-right: 10px;
  padding: 1px;
  border-radius: 100px;
  background-color: var(--color-5);
  position: relative;

  li {
    position: relative;
    z-index: 1;
     &.completed ~ li.completed::before {
      content: '';
      position: absolute;
      top: -140%;
      border-radius: 0 0 100px 100px;
      width: 22px;
      height: calc(100% + 40px);
      background-color: var(--color-4);
      z-index: -1;
      [data-theme="dark"] & {
        background-color: var(--color-7);
      }
    }
  }
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.blast-wrap__quests-daily-tasks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  img {
    object-fit: contain;
  }
}

.blast-wrap__jackpot-user__data-divider {
  height: 100%;
  border: 1px solid var(--color-2);
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.blast-wrap__jackpot-main-points {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  svg {
    fill: var(--color-4);
    stroke: var(--color-4);
  }
}

@media (max-width: 1200px) {
  .blast-wrap__quests-daily-tasks,
  .blast-wrap__boxes {
    flex-wrap: wrap;
    align-items: center;
  }
  .blast-wrap__quests-diamond-box,
  .blast-wrap__quests-diamond-box-wrapper {
    width: 100%;
  }
  .blast-wrap__quests-diamond-box-wrapper {
    margin-top: 24px;
    margin-bottom: 10px;
    margin-right: 0;
  }
}

@media (max-width: 1024px) {
  .page-wrap {
    margin-bottom: 80px;
  }
  .blast-wrap__jackpot {
    flex-direction: column;
  }
  .blast-wrap__jackpot-main-wrapper,
  .blast-wrap__jackpot-user {
    width: auto;
  }
}

@media (max-width: 640px) {
  .blast-wrap__jackpot {
    flex-direction: column;
  }
  .blast-wrap__jackpot-user,
  .blast-wrap__jackpot-main {
    width: 100%;
  }
  .blast-wrap__jackpot-user__data-divider {
    height: auto;
  }
  .blast-wrap__quests-diamond-box-wrapper {
    min-width: 0;
  }
}

@media (max-width: 458px) {
  .page-wrap {
    margin-top: 40px;
  }
  .blast-wrap__jackpot-user__data {
    flex-direction: column;
  }
  .blast-wrap__jackpot-user__data-i {
    flex-direction: row;
    justify-content: space-between;
  }
  .blast-wrap__quests-daily-tasks img {
    transform: scale(0.9);
  }
}

@media (max-width: 340px) {
  .blast-wrap__quests-diamond-box {
    width: 110%;
  }
}

.table-title {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-1);
}

.gold {
  position: relative;
  width: fit-content;
  margin: 0 auto;

  &::after {
    content: "";
    right: -10px;
    top: -8px;
    background-color: #fcfc06;
    width: 8px;
    height: 8px;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
  }
}
</style>
