<template>
  <div class="pos">
    <ManagePosition />
  </div>
</template>

<script lang="ts">
import ManagePosition from '@/modules/ManagePosition/Index.vue';

export default {
  name: 'ManagePos',
  components: {
    ManagePosition,
  },
};
</script>

<style>
.pos {
  width: 100%;
  margin-top: 20px;
}
</style>
