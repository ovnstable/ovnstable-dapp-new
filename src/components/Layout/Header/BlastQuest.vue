<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
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
            You need to provider liquidity to at least one of OVN pools on Blast,
            with least amount of 10$
          </p>
        </div>
        <div>
          <div class="blast-modal__box-wrap">
            <QuestBox />
          </div>

          <ButtonComponent
            full
            @on-click="triggerDailyQuest"
          >
            CLAIM
          </ButtonComponent>
        </div>
      </div>

      <div class="blast-modal__row">
        <div class="blast-modal__item-col">
          <h1>
            DAILY BOX
          </h1>
          <p>To participate in this quest,
            You need to provider liquidity to at least one of OVN pools on Blast,
            with least amount of 10$
          </p>
        </div>
      </div>

      <div>
        <div class="blast-modal__box-wrap">
          <QuestBox />
        </div>

        <ButtonComponent
          full
          @on-click="triggerDailyQuest"
        >
          CLAIM
        </ButtonComponent>
      </div>
      <div class="blast-modal__div" />
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
  emits: ['close'],
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
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  computed: {
    ...mapGetters('web3', ['evmProvider', 'provider']),
    ...mapGetters('accountData', ['account']),
  },
  methods: {
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
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.blast-modal {
  max-width: 860px;
  width: 100%;
  padding: 30px;

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
</style>
