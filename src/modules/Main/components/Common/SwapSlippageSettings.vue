<template>
  <div class="slippage-block">
    <div class="slippage-selector">
      <h3>
        Slippage Tolerance
      </h3>
      <TransitionGroup
        name="staggered-fade"
        tag="div"
        class="slippage-block__list"
        :css="false"
        @before-enter="beforeEnterList"
        @enter="onEnterList"
        @onLeave="onLeaveList"
        appear
      >
        <template v-if="showList">
          <template v-if="deviceSize.isMobile">
            <div class="slippage-block-modal">
              <ModalComponent
                type-modal="custom"
                v-model="showModal"
                @close="closeModal"
              >
                <p class="slippage-block-modal-title">SLIPPAGE TOLERANCE</p>

                <div class="slippage-block-modal-settings">
                  <div
                    v-for="(setting, key) in slippageSettings"
                    :key="slippageSettings.length - key"
                    class="slippage-block__item"
                    :class="currentSlippage && currentSlippage.type === setting.type ? 'slippage-block__item--selected' : ''"
                    :data-index="slippageSettings.length - key"
                    @click="newSlippageSettingModal(setting)"
                    @keydown="newSlippageSettingModal(setting)"
                  >
                    {{ setting.value }}%
                  </div>
                </div>
                <div class="slippage-block-modal-divider" />

                <div class="slippage-block__info">
                  <div
                    v-for="(setting, key) in slippageSettings"
                    :key="slippageSettings.length - key"

                    class="slippage-block__item-info"
                  >
                    <p v-if="key !== 0">{{ setting.value }}% - <span>{{ setting. name}}</span></p>
                    <p v-if="key !== 0">Recommended {{ setting.info }}</p>
                  </div>
                </div>
                <ButtonComponent
                  class="slippage-block-modal-btn-confirm"
                  @click="setSlippageCloseModal"
                >
                  <p>SELECT</p>
                </ButtonComponent>

              </ModalComponent>
            </div>

          </template>

          <template v-else>
            <div
              v-for="(setting, key) in slippageSettings"
              :key="slippageSettings.length - key"
              class="slippage-block__item"
              :class="currentSlippage && currentSlippage.type === setting.type ? 'slippage-block__item--selected' : ''"
              :data-index="slippageSettings.length - key"
              @click="newSlippageSetting(setting)"
              @keydown="newSlippageSetting(setting)"
            >
              {{ setting.value }}%
            </div>
          </template>
        </template>

        <div
          v-else
          class="slippage-block__item"
          @click="showSlippageModal"
          @keypress="showSlippageModal"
        >
          {{ currentSlippage.value }}%
          <BaseIcon name="CommonGear" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { mapGetters } from 'vuex';
import { onLeaveList, onEnterList, beforeEnterList } from '@/utils/animations.ts';
import { deviceType } from '@/utils/deviceType.ts';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import { checkIsEveryStableToken } from '@/store/views/main/pools/helpers.ts';

export default {
  name: 'SwapSlippageSettings',
  components: {
    BaseIcon,
    ModalComponent,
    ButtonComponent,
  },
  props: {
    selectedInputTokens: {
      type: Array,
      required: true,
    },
    selectedOutputTokens: {
      type: Array,
      required: true,
    },
    zapPoolData: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      showModal: false,
      currentSlippage: {} as any,
      showList: false,
      slippageSettings: [
        {
          id: 4, type: 'AUTO', name: 'Auto', value: 0.05, info: 'Automatic selection by current tokens',
        },
        {
          id: 2, type: 'LOW', name: 'Low', value: 0.1, info: 'For stablecoins only',
        },
        {
          id: 3, type: 'MEDIUM', name: 'Medium', value: 0.5, info: 'For mix of stablecoins and volatile assets',
        },
        {
          id: 1, type: 'HIGH', name: 'High', value: 1, info: 'For volatile assets',
        },
      ],
    };
  },
  mounted() {
    this.autoUpdateSlippage();
  },
  computed: {
    ...mapGetters('theme', ['light']),

    deviceSize() {
      return deviceType();
    },
    isStableTokens() {
      const allTokens = [...this.selectedInputTokens, ...this.selectedOutputTokens];
      return checkIsEveryStableToken(allTokens.map((_: any) => _?.selectedToken?.symbol));
    },
  },
  watch: {
    selectedInputTokens() {
      this.autoUpdateSlippage();
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
      this.showList = false;
    },
    newSlippageSetting(setting: any) {
      this.currentSlippage = setting;
      this.showList = false;
      // Emit an event when currentSlippage changes
      this.$emit('change-slippage', setting?.value);
    },
    newSlippageSettingModal(setting: any) {
      this.currentSlippage = setting;
    },
    setSlippageCloseModal() {
      this.$emit('change-slippage', this.currentSlippage?.value);
      this.showModal = false;
      this.showList = false;
    },
    showSlippageModal() {
      this.showList = true;
      this.showModal = true;
    },
    // method get setting by id
    getSlippageSettingById(id: any) {
      return this.slippageSettings.find((setting) => setting.id === id);
    },
    autoUpdateSlippage() {
      // if volatile tokens choosen by user, slippage should be higher
      if (!this.isStableTokens) {
        const newVal = this.getSlippageSettingById(1);
        this.newSlippageSetting(newVal);
        return;
      }

      const auto: any = this.getSlippageSettingById(4);
      this.currentSlippage = {
        ...auto,
        value: 0.1,
      };
      this.newSlippageSetting(auto);
    },
    onLeaveList,
    beforeEnterList,
    onEnterList,
  },
};
</script>

<style>
.zapin-block {
  &.v3 {
        .slippage-block {
          margin-top: 28px;
          .slippage-selector {
            justify-content: flex-start;
            gap: 20px;
            .slippage-block__list {
              max-height: 30px;
            }
          }
        }
      }
    }
</style>

<style lang="scss" scoped>
.slippage-block {
  display: flex;
  flex-direction: column;
  margin-top: 14px;
  .slippage-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-1);
      [data-theme="dark"] & {
        color: var(--color-4);
      }
    }
  }
}

.slippage-block__list {
  display: flex;
  gap: 6px;
}
.slippage-block__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  min-width: 80px;
  color: var(--color-2);
  background-color: var(--color-5);
  border-radius: 30px;
  cursor: pointer;
  transition: background-color .2s ease,
  color .2s ease,
  box-shadow .1s ease,
  opacity .2s ease,
  transform .3s ease;

  [data-theme="dark"] & {
    color: var(--color-4);
    background-color: var(--color-7);
  }

  &:hover {
    background-color: var(--color-6);
    color: var(--color-1);
    [data-theme="dark"] & {
      background-color: var(--color-4);
      color: var(--color-17);
      svg {
        fill: var(--color-17);
      }
    }
  }

  svg {
    // width: 16px;
    // height: 16px;
    transform: scale(.75);
    margin-left: 10px;
    path {
      fill: white;
    }
  }
  [data-theme="dark"] & {
    svg path {
      fill: var(--color-1);
    }
  }
}

.slippage-block__item--selected {
  box-shadow: 0 0 0px 2px var(--color-3);
}
@media (max-width: 640px) {
  .slippage-block__item {
    color: var(--color-1);
    font-size: 14px;
    font-weight: 500;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .slippage-block-modal {
    display: flex;
    flex-direction: column;
  }
  .slippage-block-modal-title {
    color: var(--color-1);
    font-size: 16px;
    font-weight: 600;
    margin-top: 20px;
    margin-bottom: 24px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
   .slippage-block-modal-settings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 10px;
    min-width: 300px;
  }
  .slippage-block-modal-divider {
    width: 100%;
    border: 1px solid var(--color-5);
    margin: 24px 0;
  }
  .slippage-block__info {
    margin: 0 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .slippage-block__item-info {
    display: flex;
    flex-direction: column;
    color: var(--color-2);
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
  .slippage-block__item-info :nth-child(1) {
    font-weight: 600;
  }
  .slippage-block-modal-btn-confirm {
    margin-bottom: 16px;
    margin-top: 24px;
    padding: 9px 0px;
    width: calc(100% - 14px);
    border: none;
    box-shadow: none;
    p {
      font-size: 17px;
    }
  }
}

</style>
