<template>
  <div
    class="routing-wrap__content-col"
  >
    <div class="routing-wrap__row routing-wrap__row--liq">
      <div class="routing-wrap__row-item">
        {{ title }}
      </div>
      <div class="routing-wrap__row-item">
        {{ nftInfo }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: 'NFTRowSegment',
  components: {
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'LP',
    },
    nftInfo: {
      type: String,
      required: true,
      default: 'Unavailable',
    },
  },
};
</script>
  <style src="../styles.scss" lang="scss" scoped />
