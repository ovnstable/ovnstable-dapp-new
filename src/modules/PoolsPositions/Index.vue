<template>
  <div>
    <div>
      PoolsPositions
    </div>
    <PositionsTable />
  </div>
</template>

<script lang="ts">
import PositionsTable from '@/modules/PoolsPositions/Positions/Index.vue';

export default {
  name: 'PoolsPositions',
  components: {
    PositionsTable,
  },
  data() {
  },
  watch: {

  },
  methods: {
  },
};
</script>
