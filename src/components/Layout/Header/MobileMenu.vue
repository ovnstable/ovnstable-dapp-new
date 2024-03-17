<template>
  <ModalComponent
    :customClass="'mob-menu'"
    type-modal="custom"
    v-model="showModal"
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
      <h1>
        HELP AND SETTINGS
      </h1>
    </div>
    <div class="sidebar__divider" />
    <div class="mob-menu__socials">
      <h1>
        OUR SOCIALS MEDIA
      </h1>
      <div class="mob-menu__socials-row">
        <a
          href="https://twitter.com/overnight_fi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <BaseIcon
            name="IconTwitter"
            class="sidebar__icon-social icon-twitter"
          />
        </a>
        <a
          href="https://discord.gg/overnight-fi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
        >
          <BaseIcon
            name="IconDiscord"
            class="sidebar__icon-social icon-discord"
          />
        </a>
      </div>
    </div>
    <div class="sidebar__divider" />
  </ModalComponent>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ModalComponent from '@/components/Modal/Index.vue';

export default {
  name: 'MobileMenu',
  components: {
    BaseIcon,
    ModalComponent,
  },
  emits: ['close'],
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  methods: {
    closeModal() {
      console.log('closeModal');
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
.mob-menu {
  justify-content: flex-end!important;
  align-items: flex-start!important;
  min-height: 100%;

  .modal__close {
    display: none;
  }
}

.mob-menu .modal--custom {
  min-height: 100vh;
  border-radius: 0!important;
  max-width: 350px;
  width: 100%;
  padding: 0 20px!important;
  border: unset!important;
}
</style>

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
  transition: background-color .2s ease;

  &:hover {
    background-color: var(--color-5);
  }
}

.mob-menu__socials-row {
  display: flex;
  gap: 20px;
}
</style>
