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
    <div class="mob-menu__links">
      <h1>
        HELPFUL LINKS
      </h1>
      <li
        class="mob-menu__links-array"
        v-for="link in bottomLinks"
        :key="link.name"
      >
        <a
          :href="link.url"
          class="sidebar__text-info"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ link.name }}
        </a>
      </li>
    </div>
    <div class="sidebar__divider" />
    <div class="mob-menu__mode">
      <h1>LIGHT MODE</h1>
      <SwitchComponent
        :isChecked="isDarkTheme"
        @change-switch="toggleTheme"
      />
    </div>
    <div class="sidebar__divider" />
    <div class="mob-menu__language">
      <h1>LANGUAGE</h1>
      <div style="position: relative;">
        <div
          id="google_translate_element"
          style="position: relative; opacity: 0;"
        />

        <SelectComponent
          :value="selectModel"
          :list="selectListDemo"
          class="notranslate"
          value-field="title"
          id-field="id"
          @change="triggerTranslate"
        />
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import SwitchComponent from '@/components/Switch/Index.vue';
import SelectComponent from '@/components/Select/Index.vue';
import { delay } from 'lodash';

export default {
  name: 'MobileMenu',
  components: {
    BaseIcon,
    ModalComponent,
    SwitchComponent,
    SelectComponent,
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
      selectModel: {
        id: 1,
        title: 'EN',
      },
      selectListDemo: [
        { id: 1, title: 'EN', code: 'en' },
        { id: 2, title: 'RU', code: 'ru' },
        { id: 3, title: 'AR', code: 'ar' },
        { id: 4, title: 'ZH-CN', code: 'zh-CN' },
      ],
      showModal: false,
      isDarkTheme: false,
      bottomLinks: [
        { name: 'Help Center', url: 'https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/' },
        { name: 'Terms of service', url: 'https://docs.overnight.fi/other/terms-of-service' },
        { name: 'Privacy Policy', url: 'https://docs.overnight.fi/other/privacy-policy' },
        { name: 'Audits', url: 'https://docs.overnight.fi/other/audits' },
        { name: 'ABOUT ETS', url: 'https://docs.overnight.fi/advanced/strategies/ets' },
      ],
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  mounted() {
    const currLang = localStorage.getItem('ovn-lang');
    if (!currLang) return;

    const item = this.selectListDemo.map((_) => _.code).indexOf(currLang);

    if (item !== -1) this.selectModel = this.selectListDemo[item];
  },
  methods: {
    toggleTheme() {
      console.log('CHANGE2');
      this.$store.dispatch('theme/switchTheme');
    },
    closeModal() {
      console.log('closeModal');
      this.$emit('close');
    },
    setCookie(key: string, value: string) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
      document.cookie = `${key}=${value};expires=${expires.toUTCString()}`;
    },
    async triggerTranslate(val: any) {
      // const el = document.querySelector('.goog-te-combo');
      // if (el) el.value() = theLang;
      const index = Number(val) - 1;
      const langId = this.selectListDemo[index].code;
      localStorage.setItem('ovn-lang', langId);
      this.$router.push(`#googtrans(${langId})`);
      this.setCookie('googtrans', `/en/${langId}`);
      this.selectModel = this.selectListDemo[index];
      delay(() => window.location.reload(), 500);
    },
  },
};
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
.mob-menu__header {
  margin-top: 16px;
}

.sidebar__text-info {
  margin-top: 14px;
  margin-bottom: 14px;
}
.mob-menu__mode,
.mob-menu__language {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.mob-menu__header,
.mob-menu__socials,
.mob-menu__mode,
.mob-menu__language,
.mob-menu__links {
  h1 {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.mob-menu__links {
  width: 100%;
  text-align: left;
  h1 {
    margin-bottom: 26px;
  }
   ul, ol {
    padding-left: 0;
    margin-left: 0;
    list-style-type: none;
  }

  .sidebar__text-info {
    display: block;
    text-align: left;
    margin-top: 14px;
    margin-bottom: 14px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}
.mob-menu__links-array {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

</style>
