<template>
  <div class="tasks-col">
    <div
      class="tasks-col__item"
      v-for="item in tasksDataInfo"
      :key="item.id"
      :class="{ checked: item.checked }"
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
        <BaseIcon
          name="PayoutArrow"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TypeofQuest } from '@/components/QuestBox/Index.vue';
import { type PropType } from 'vue';
import { mapGetters } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

const BRONZE_QUESTS = [
  {
    id: '0',
    text: 'Like&Retweet',
    checked: false,
    boxType: TypeofQuest.BRONZE,
  },
  {
    id: '1',
    text: 'Add at least $1000 liquidity to selected pool on Thruster (See (?) details for more info)',
    checked: false,
    boxType: TypeofQuest.BRONZE,
  },
  {
    id: '2',
    text: 'Add at least $1000 liquidity to selected pool on SwapBlast (See (?) details for more info)',
    checked: false,
    boxType: TypeofQuest.BRONZE,
  },
];

const SILVER_QUESTS = [
  {
    id: '0',
    text: 'Mint at least 1000 USD+ on Blast during the daily quest',
    checked: false,
    boxType: TypeofQuest.SILVER,
  },
  {
    id: '1',
    text: 'Add at least $2000 liquidity to selected pool on Thruster (See (?) details for more info)',
    checked: false,
    boxType: TypeofQuest.SILVER,
  },
  {
    id: '2',
    text: 'Add at least $2000 liquidity to selected pool on SwapBlast (See (?) details for more info)',
    checked: false,
    boxType: TypeofQuest.SILVER,
  },
];

const GOLD_QUESTS = [
  {
    id: '0',
    text: 'Mint at least 2500 USD+ on Blast',
    checked: false,
    boxType: TypeofQuest.GOLD,
  },
  {
    id: '1',
    text: 'Add at least $5000 liquidity to selected pool on Thruster (See (?) details for more info)',
    checked: false,
    boxType: TypeofQuest.GOLD,
  },
  {
    id: '2',
    text: 'Add at least $5000 liquidity to selected pool on SwapBlast (See (?) details for more info)',
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
  emits: ['check-quest', 'check-twitter'],
  data() {
    return {
      showModalLikeRetweet: false,
    };
  },
  props: {
    viewBox: {
      type: Number as PropType<TypeofQuest>,
      required: true,
    },
    boxData: {
      type: Array as PropType<BOX_DATA[]>,
      required: true,
    },
  },
  components: {
    BaseIcon,
  },
  methods: {
    filterByBoxData(questData: typeof GOLD_QUESTS) {
      if (!this.boxData || this.boxData?.length === 0) return questData;

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
      if (!item.checked && item.id === '0' && item.boxType === 0) {
        this.$emit('check-twitter');
        return;
      }
      if (item.checked) return;
      this.$emit('check-quest', item.id, item.boxType);
    },
  },
  computed: {
    ...mapGetters('jackpotData', ['likedQuest', 'retweetedQuest']),
    tasksDataInfo() {
      if (this.viewBox === TypeofQuest.BRONZE) return this.filterByBoxData(BRONZE_QUESTS);
      if (this.viewBox === TypeofQuest.SILVER) return this.filterByBoxData(SILVER_QUESTS);
      if (this.viewBox === TypeofQuest.GOLD) return this.filterByBoxData(GOLD_QUESTS);

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
}

.tasks-col__item {
  display: flex;
  align-items: center;
  gap: 6px;
  text-align: left;
  transition: color .1s ease;
  cursor: pointer;

  p {
    word-break: break-word;
    color: var(--color-1);
    font-size: 14px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }

  &:hover {
    p {
      color: var(--color-3);
    }

    .tasks-col__arr {
      transform: translate(2px, -2px);
    }

    .completed-task {
      color: unset;
    }
  }

  .completed-task {
    color: var(--color-2);
    text-decoration: line-through;

    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }

  &.checked {
    pointer-events: none;

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
  border: 1px solid var(--color-6);
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
    fill: var(--color-2);
    [data-theme="dark"] & {
      fill: var(--color-18);
    }
  }
}
</style>
