<template>
  <ModalComponent
    v-model="showModal"
    :custom-class="'mob-menu'"
    type-modal="custom"
  >
    <div class="mob-menu__header">
      <div
        class="mob-menu__header-arr"
        @click="closeModal"
        @keypress="closeModal"
      >
        <BaseIcon
          class="mob-menu__arr"
          name="ArrowLeft"
        />
      </div>
    </div>

    <div
      v-if="balancesEmpty"
      class="swap-form__loader"
    >
      <Spinner />
    </div>

    <MintRedeemForm
      v-else
      :balance-list="balanceList"
    />
  </ModalComponent>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import MintRedeemForm from '@/modules/Main/components/MintRedeem/Index.vue';
import { defineComponent } from 'vue';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import { isEmpty } from 'lodash';
import Spinner from '@/components/Spinner/Index.vue';

export default defineComponent({
  name: 'MobileMintRedeemMenu',
  components: {
    BaseIcon,
    ModalComponent,
    MintRedeemForm,
    Spinner,
  },
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['close'],
  setup: () => {
    const {
      data: balanceList,
    } = useTokensQuery();

    return {
      balanceList,
    };
  },
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    balancesEmpty() {
      return isEmpty(this.balanceList);
    },
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss" scoped>
.mob-menu__header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  min-height: 40px;
}

.mob-menu__socials {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.mob-menu__header-arr {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  min-width: 32px;
  min-height: 32px;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.mob-menu__socials-row {
  display: flex;
  gap: 20px;
}

@media (max-width: 640px) {
  .mob-menu__header {
    margin-top: 16px;
    h1 {
      font-size: 16px;
      color: var(--color-1);
      text-transform: uppercase;
      font-weight: 600;
      [data-theme="dark"] & {
        color: var(--color-4);
      }
    }
  }
  .mob-menu__header-arr {
    svg {
      fill: var(--color-1);
      [data-theme="dark"] & {
        fill: var(--color-4);
      }
    }
  }
}

</style>
