<template>
  <div class="tasks-col">
    <div
      class="tasks-col__item"
      v-for="item in tasksDataInfo"
      :key="item.id"
    >
      <div class="tasks-col__item-icon">
        <BaseIcon name="CommonChecked" />
      </div>

      <p>
        {{ item.text }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { BOX_VIEW } from '@/components/QuestBox/Index.vue';
import { type PropType } from 'vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

const BRONZE_QUESTS = [
  {
    id: 1,
    text: 'Like and Retweet',
  },
  {
    id: 2,
    text: 'Write a tweet about @Overnightfinance',
  },
  {
    id: 3,
    text: 'Write a tweet with the amount of points you get from Overnight',
  },
];

const SILVER_QUESTS = [
  {
    id: 1,
    text: 'Swap $10-20',
  },
  {
    id: 2,
    text: 'Swap $20-50',
  },
  {
    id: 3,
    text: 'Swap $50',
  },
];

const GOLD_QUESTS = [
  {
    id: 1,
    text: 'Add liquidity to any Blast OVN pool, $10-100',
  },
  {
    id: 2,
    text: 'Add liquidity to any Blast OVN pool, $100-500',
  },
  {
    id: 3,
    text: 'Add liquidity to any Blast OVN pool, $500 or more',
  },
];

export default {
  name: 'TasksData',
  props: {
    viewBox: {
      type: Number as PropType<BOX_VIEW>,
      required: true,
    },
  },
  components: {
    BaseIcon,
  },
  computed: {
    tasksDataInfo() {
      if (this.viewBox === BOX_VIEW.BRONZE) return BRONZE_QUESTS;
      if (this.viewBox === BOX_VIEW.SILVER) return SILVER_QUESTS;
      if (this.viewBox === BOX_VIEW.GOLD) return GOLD_QUESTS;

      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
.tasks-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.tasks-col__item {
  display: flex;
  align-items: center;
  gap: 6px;
  text-align: left;

  p {
    word-break: break-word;
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
}
</style>
