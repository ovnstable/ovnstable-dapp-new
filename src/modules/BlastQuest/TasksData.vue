<template>
  <div class="tasks-col">
    <div
      class="tasks-col__item"
      v-for="item in tasksDataInfo"
      :key="item.id"
      :class="{ completed: item.checked }"
      @click="checkItem(item)"
      @keypress="checkItem(item)"
    >
      <div
        class="tasks-col__item-icon"
      >
        <BaseIcon :name="item.checked ? 'CommonChecked' : 'CommonClose' " />
      </div>

      <p :class="{ 'completed-task': item.checked }">
        {{ item.text }}
      </p>
      <div class="tasks-col__arr">
        <ButtonComponent
          v-if="!item.checked && item.id === '0' && item.boxType === 0"
          @click="toggleModalLikeRetweet"
          @keydown.enter="toggleModalLikeRetweet"
        >
          <BaseIcon
            name='PayoutArrow'
          />
        </ButtonComponent>
        <BaseIcon
          v-else
          name="PayoutArrow"
        />
      </div>
    </div>
  </div>
  <LikeRetweetModal
    v-model="showModalLikeRetweet"
  />
</template>

<script lang="ts">
import { BOX_VIEW } from '@/components/QuestBox/Index.vue';
import { type PropType } from 'vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import LikeRetweetModal from '@/modules/BlastQuest/LikeRetweetModal.vue';
import { TypeofQuest } from './models.ts';

const BRONZE_QUESTS = [
  {
    id: '0',
    text: "Like and retweet today's Overnight post",
    checked: false,
    boxType: TypeofQuest.BRONZE,
  },
  {
    id: '1',
    text: 'Mint at least 10 USD+ on Blast',
    checked: false,
    boxType: TypeofQuest.BRONZE,
  },
  {
    id: '2',
    text: 'Add at least 20$ to any USD+ pool on SwapBlast',
    checked: false,
    boxType: TypeofQuest.BRONZE,
  },
];

const SILVER_QUESTS = [
  {
    id: '0',
    text: 'Mint at least 25 USD+ on Blast',
    checked: true,
    boxType: TypeofQuest.SILVER,
  },
  {
    id: '1',
    text: 'Add at least $50 liquidity to any USD+ pool on Thruster ',
    checked: false,
    boxType: TypeofQuest.SILVER,
  },
  {
    id: '2',
    text: 'Add at least $50 to any USD+ SwapBlast',
    checked: false,
    boxType: TypeofQuest.SILVER,
  },
];

const GOLD_QUESTS = [
  {
    id: '0',
    text: 'Mint at least 50 USD+ on Blast',
    checked: false,
    boxType: TypeofQuest.GOLD,
  },
  {
    id: '1',
    text: 'Add at least $100 liquidity to any USD+ pool on Thruster',
    checked: false,
    boxType: TypeofQuest.GOLD,
  },
  {
    id: '2',
    text: 'Add at least $100 to any USD+ pool on SwapBlast',
    checked: false,
    boxType: TypeofQuest.GOLD,
  },
];

// eslint-disable-next-line no-shadow
export interface BOX_DATA {
  batchId: string;
  amount: string;
  time: number;
  questId: string;
}

export default {
  name: 'TasksData',
  data() {
    return {
      showModalLikeRetweet: false,
    };
  },
  props: {
    viewBox: {
      type: Number as PropType<BOX_VIEW>,
      required: true,
    },
    boxData: {
      type: Array as PropType<BOX_DATA[]>,
      required: true,
    },
  },
  components: {
    BaseIcon,
    ButtonComponent,
    LikeRetweetModal,
  },
  methods: {
    filterByBoxData(questData: typeof GOLD_QUESTS) {
      if (this.boxData.length === 0) return questData;

      return questData.map((_) => {
        const questComp = this.boxData.find((item) => item.questId === _.id);

        if (questComp) {
          return {
            ..._,
            checked: true,
          };
        }

        return _;
      });
    },
    checkItem(item: typeof SILVER_QUESTS[0]) {
      this.$emit('check-quest', item.id, item.boxType);
    },
    toggleModalLikeRetweet() {
      this.showModalLikeRetweet = !this.showModalLikeRetweet;
    },
  },
  computed: {
    tasksDataInfo() {
      if (this.viewBox === BOX_VIEW.BRONZE) return this.filterByBoxData(BRONZE_QUESTS);
      if (this.viewBox === BOX_VIEW.SILVER) return this.filterByBoxData(SILVER_QUESTS);
      if (this.viewBox === BOX_VIEW.GOLD) return this.filterByBoxData(GOLD_QUESTS);

      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
.tasks-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: auto;
  cursor: pointer;
}

.tasks-col__item {
  display: flex;
  align-items: center;
  gap: 6px;
  text-align: left;
  transition: color .1s ease;

  p {
    word-break: break-word;
    color: var(--color-1);
    font-size: 14px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .completed-task {
    color: var(--color-2);
    text-decoration: line-through;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }

  &:hover {
    color: var(--color-3);

    .tasks-col__arr {
      transform: translate(2px, -2px);
    }
  }

  &.checked {
    &:hover {
      color: initial;

      .tasks-col__arr {
        transform: initial;
      }
    }
  }

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
  [data-theme="dark"] & {
    background-color: var(--color-7);
    border-color: var(--color-2);
  }
}

.tasks-col__arr {
  border: 1px solid var(--color-6);
  background-color: var(--color-4);
  padding: 5px 10px;
  border-radius: 30px;
  margin-left: auto;
  transition: transform .2s ease;
  [data-theme="dark"] & {
    background-color: var(--color-7);
    border-color: var(--color-2);
  }
  svg {
    [data-theme="dark"] & {
      fill: var(--color-18);
    }
  }
  button {
    background: none;
    box-shadow: none;
    border: none;
    padding: 0;
  }
}
</style>
