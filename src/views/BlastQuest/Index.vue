<template>
  <BlastQuestModule />
</template>

<script lang="ts">
import BlastQuestModule from '@/modules/BlastQuest/Index.vue';

export default {
  name: 'BlastQuest',
  components: {
    BlastQuestModule,
  },
  async mounted() {
    await this.fetchDataForBlastQuest();
  },
  methods: {
    async fetchDataForBlastQuest() {
      try {
        await Promise.all([
          this.$store.dispatch('jackpotData/fetchJackpotData'),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
};
</script>
