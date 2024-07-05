<template>
  <div class="app-footer">
    <div class="app-footer__container">
      <router-link
        to="/"
        class="app-footer__logo"
      >
        <BaseIcon
          class="app-header__content__logo-svg"
          name="IconLogo"
        />

        <h1>
          OVERNIGHT
        </h1>
      </router-link>
      <ul>
        <li
          v-for="link in bottomLinks"
          :key="link.name"
        >
          <a
            :href="link.url"
            class="footer__text-bottom"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.name }}
          </a>
        </li>
      </ul>

      <div class="app-footer__icons-bottom">
        <a
          href="https://twitter.com/overnight_fi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          Twitter
        </a>
        <a
          href="https://discord.gg/overnight-fi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
        >
          Discord
        </a>
        <a
          href="https://t.me/overnight_fi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          Telegram
        </a>
        <a
          href="https://overnightdefi.medium.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Medium"
        >
          Medium
        </a>
      </div>
      <div class="app-footer__icons-bottom">
        <SwitchComponent
          :is-checked="isDarkTheme"
          @change-switch="toggleTheme"
        />
        <div style="position: relative;">
          <div
            id="google_translate_element"
            style="position: relative; opacity: 0;"
          />

          <SelectComponent
            :value="selectModel"
            :list="selectListDemo"
            select-styles="secondary"
            class="notranslate"
            value-field="title"
            id-field="id"
            @change="triggerTranslate"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import SwitchComponent from '@/components/Switch/Index.vue';
import SelectComponent from '@/components/Select/Index.vue';
import { delay } from 'lodash';

export default {
  name: 'FooterDesktop',
  components: {
    BaseIcon,
    SwitchComponent,
    SelectComponent,
  },
  data() {
    return {
      selectModel: {
        id: 1,
        title: 'EN',
      },
      isDarkTheme: false,
      selectListDemo: [
        { id: 1, title: 'EN', code: 'en' },
        { id: 2, title: 'RU', code: 'ru' },
        { id: 3, title: 'AR', code: 'ar' },
        { id: 4, title: 'ZH-CN', code: 'zh-CN' },
        { id: 5, title: 'ZH-TW', code: 'zh-TW' },
        { id: 6, title: 'KO', code: 'ko' },
        { id: 7, title: 'TH', code: 'th' },
        { id: 8, title: 'FR', code: 'fr' },
        { id: 9, title: 'DE', code: 'de' },
        { id: 10, title: 'TR', code: 'tr' },
        { id: 11, title: 'HI', code: 'hi' },
      ],
      bottomLinks: [
        { name: 'Docs', url: 'https://docs.overnight.fi' },
        { name: 'Help Center', url: 'https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/' },
        { name: 'Audits', url: 'https://docs.overnight.fi/other/audits' },
      ],
    };
  },
  mounted() {
    const currLang = localStorage.getItem('ovn-lang');
    if (!currLang) return;

    const item = this.selectListDemo.map((_) => _.code).indexOf(currLang);

    if (item !== -1) this.selectModel = this.selectListDemo[item];
  },
  methods: {
    toggleTheme() {
      this.$store.dispatch('theme/switchTheme');
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
.app-footer {
  a {
    text-transform: uppercase;
    color: var(--color-2);
    font-size: 16px;
    font-weight: 600;

    &:hover {
      color: var(--color-3);
    }
  }
}

.app-footer__icons-bottom {
  display: flex;
  gap: 24px;
}

.app-footer__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1360px;
  padding: 0 20px;
  margin: 0 auto;
}

.app-footer__logo {
  display: flex;
  align-items: center;
  h1 {
    color: var(--color-1);
    font-size: 15px;
    font-weight: 700;
    margin-left: 8px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.app-footer ul {
  display: flex;
  gap: 40px;
}

.app-footer {
  display: flex;
  width: 100%;
  padding: 30px 0;
  margin-top: auto;

  @media (max-width: 1024px) {
    display: none;
  }
}

@media (max-height: 880px) {
  .footer__top {
    margin-bottom: 24px;
  }
}

.footer__bottom li {
  margin-top: 10px;
}

.footer__bottom li:first-child {
  margin-top: 0;
}

.active-link {
  text-decoration: underline;
}

.footer__text-market {
  color: var(--color-1);
  font-size: 17px;
  margin-bottom: 10px;
  font-weight: 600;
}

.footer__text-market:last-child {
  margin-bottom: 0;
}
.market-container {
  display: flex;
  flex-direction: column;
}
.market-container .footer__text-market:last-child {
  margin-bottom: 0;
}

.footer__divider-top {
  margin-top: 20px;
  border: 0.6px solid var(--color-1);
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.footer__bottom {
  margin-top: auto;
  margin-bottom: 50px;
}

.footer__text-bottom {
  color: var(--color-2);
  font-size: 15px;
  font-weight: 600;

  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.footer__icons-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}

.footer__button-switch-language:hover {
  cursor: pointer;
}
</style>
