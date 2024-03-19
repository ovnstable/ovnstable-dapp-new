<template>
  <div
    class="container-main pa-2"
  >
    <div v-if="false">
      <div
        align="center"
        justify="center"
        class="py-15"
      >
        <Spinner size="60px" />
      </div>
    </div>
    <template v-if="false">
      <div
        v-if="false"
        class="container-title mt-1 mb-1"
      >
        <div class="title">
          Best APR of the day
        </div>
      </div>
      <div class="container-subtitle mt-2">
        <div class="subtitle">
          See all pools here
        </div>
        <!-- <div>
          <v-img
            class="arrow-icon"
            :src="require('@/assets/icon/arrow-right.svg')"
          />
        </div> -->
      </div>
    </template>
  </div>
</template>

<script>
// import PoolLabel from '@/components/zap/PoolLabel';
// import { pool } from '@/components/mixins/pool';
import Spinner from '@/components/Spinner/Index.vue';

export default {
  name: 'BestAprPromotion',
  //   mixins: [pool],
  components: {
    Spinner,
  },

//   mounted() {
//     this.loadPools();
//   },
};

</script>

<style scoped>
.container-main {
    display: flex;
    flex-direction: column;
    box-shadow: none;
    background-color: transparent;
    border-radius: 12px;
    cursor: pointer;
}

.container-main:hover {
    box-shadow: 0 2px 3px 0px rgba(0, 0, 0, 0.2);
}

.container-title {
    text-align: center;
}

.container-subtitle {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

.title {
    font-weight: 700;
    font-size: 24px;
    line-height: 36px;
    color: var(--main-gray-text);
}

.subtitle {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: var(--links-blue);
    cursor: pointer;
}

.arrow-icon {
    cursor: pointer;
}
</style>
