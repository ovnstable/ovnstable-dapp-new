<template>
  <div>
    <div v-if="isShow">
      <div>
        <div>
          <div>
            <div class="title-modal">
              Zap in
            </div>
            <div
              @click="setShowFunc(false)"
              @keypress="setShowFunc(false)"
            >
              CLOSE
            </div>
          </div>

          <div>
            <ZapForm
              :zap-pool="zapPool"
              :pool-tokens-for-zap-map="poolTokensForZapMap"
              :type-of-pool="typeOfPool"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ZapForm from '@/modules/Main/components/ZapModal/ZapForm.vue';

export default {
  name: 'ZapModal',
  components: {
    ZapForm,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    setShowFunc: {
      type: Function,
      required: true,
    },
    zapPool: {
      type: Object,
      required: false,
      default: null,
    },
    poolTokensForZapMap: {
      type: Object,
      required: true,
    },
    typeOfPool: { // OVN or ALL
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>

.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.airdrop-body {
    z-index: 48 !important;
}

</style>
