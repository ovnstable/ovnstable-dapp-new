<template>
  <div class="app-sidebar">
    <ul class="sidebar__top">

      <router-link
        to="/"
        class="sidebar__text-top"
        active-class="active-link"
      >Homepage</router-link>

      <div class="sidebar__divider-top" />

      <p
        class="sidebar__text-top sidebar__text-top--markets"
      >MONEY MARKETS</p>

      <div class="market-container">
        <router-link
          v-for="link in linksData"
          :key="link.name"
          :to="link.to"
          class="sidebar__text-market"
          active-class="active-link"
        >
          {{ link.name }}
        </router-link>
      </div>
      <div class="sidebar__divider-top" />

      <p
        class="sidebar__text-top sidebar__text-top--ovn"
      >OVN</p>

      <router-link
        v-for="(link, index) in ovnAndInsuranceLinks"
        :key="index"
        :to="link.to"
        class="sidebar__text-top"
        active-class="active-link"
      >
        {{ link.name }}
      </router-link>
      <div class="sidebar__divider-top" />
      <p
        class="sidebar__text-top sidebar__text-top--ovn"
      >EVENTS</p>
      <router-link
        to="/blastquest"
        class="sidebar__text-top"
        active-class="active-link"
      >
        <div class="sidebar__text-top-blast">
          <BaseIcon
            name="blastSidebar"
          />
          <div class="glitch-wrapper">
            <div
              class="glitch"
              data-glitch="Blast lootbox"
            >Blast lootbox</div>
          </div>
        </div>

      </router-link>
    </ul>

    <ul class="sidebar__bottom">
      <li
        v-for="link in bottomLinks"
        :key="link.name"
      >
        <a
          :href="link.url"
          class="sidebar__text-bottom"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ link.name }}
        </a>
      </li>

      <div class="sidebar__divider-bottom" />
      <div class="sidebar__icons-bottom">
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
      <div class="sidebar__divider" />
      <div class="sidebar__icons-bottom">
        <SwitchComponent
          :isChecked="isDarkTheme"
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
            class="notranslate"
            value-field="title"
            id-field="id"
            @change="triggerTranslate"
          />
        </div>
      </div>
    </ul>
  </div>

</template>
<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import SwitchComponent from '@/components/Switch/Index.vue';
import SelectComponent from '@/components/Select/Index.vue';
import { delay } from 'lodash';

export default {
  components: {
    BaseIcon,
    SwitchComponent,
    SelectComponent,
  },
  name: 'SideBar',
  data() {
    return {
      selectModel: {
        id: 1,
        title: 'EN',
      },
      isDarkTheme: false,
      linksData: [
        { name: 'USD+', to: '/market/usd' },
        { name: 'USDC+', to: '/market/usdc' },
        { name: 'ETH+', to: '/market/eth' },
        { name: 'USDT+', to: '/market/usdt' },
        { name: 'DAI+', to: '/market/dai' },
      ],
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
        { name: 'Help Center', url: 'https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/' },
        { name: 'Terms of service', url: 'https://docs.overnight.fi/other/terms-of-service' },
        { name: 'Privacy Policy', url: 'https://docs.overnight.fi/other/privacy-policy' },
        { name: 'Audits', url: 'https://docs.overnight.fi/other/audits' },
        { name: 'ABOUT ETS', url: 'https://docs.overnight.fi/advanced/strategies/ets' },
      ],
      ovnAndInsuranceLinks: [
        { name: 'OVN overview', to: '/ovn' },
        { name: 'Insurance', to: '/insurance' },
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
.app-sidebar {
  position: sticky;
  top: 0;
  height: calc(100vh - 100px);
}

.app-sidebar,
.sidebar__top,
.sidebar__bottom {
  display: flex;
  flex-direction: column;
  min-width: 140px;

  @media (max-width: 1024px) {
    display: none;
  }
}

@media (max-height: 880px) {
  .sidebar__top {
    margin-bottom: 24px;
  }
}

.sidebar__bottom li {
  margin-top: 10px;
}

.sidebar__bottom li:first-child {
  margin-top: 0;
}
.sidebar__text-top {
  color: var(--color-1);
  font-size: 17px;
  font-weight: 600;
  margin-top: 20px;
  &:last-child {
    margin-top: 10px;
  }
}

.active-link {
  text-decoration: underline;
}
.sidebar__text-top--markets,
.sidebar__text-top--ovn {
  color: var(--color-2);
  font-size: 15px;
  font-weight: 600;
   [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.sidebar__text-top--markets {
  margin-bottom: 20px;
}

.sidebar__text-market {
  color: var(--color-1);
  font-size: 17px;
  margin-bottom: 10px;
  font-weight: 600;
}

.sidebar__text-market:last-child {
  margin-bottom: 0;
}
.market-container {
  display: flex;
  flex-direction: column;
}
.market-container .sidebar__text-market:last-child {
  margin-bottom: 0;
}

.sidebar__text-top--insurance {
  margin-top: 20px;
}
.sidebar__text-top:first-child {
  margin-top: 0;
}

.sidebar__divider-top {
  margin-top: 20px;
  border: 0.6px solid var(--color-1);
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.sidebar__bottom {
  margin-top: auto;
  margin-bottom: 50px;
}

.sidebar__text-bottom {
  color: var(--color-2);
  font-size: 15px;
  font-weight: 600;

  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.sidebar__text-bottom:first-child {
  margin-top: 0;
}

.sidebar__icons-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}

.sidebar__button-switch-language:hover {
  cursor: pointer;
}

.sidebar__text-top-blast {
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  margin-top: 14px;
  svg {
    [data-theme="dark"] & {
      stroke: var(--color-4);
    }
  }
}

.glitch-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: var(--color-5);
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}

.glitch {
  position: relative;
  font-size: 17px;
  font-weight: 600;
  color: var(--color-1);
  z-index: 1;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.glitch:before,
.glitch:after {
  display: block;
  content: attr(data-glitch);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
}

.glitch:before {
  animation: glitch-color 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
  color: #007acc;;
  z-index: -1;
  [data-theme="dark"] & {
    animation: glitch-color-dark 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
    color: #5f4361;
  }
}

.glitch:after {
 animation: glitch-color 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
 color: #e06c75;
  z-index: -2;
  [data-theme="dark"] & {
    animation: glitch-color-dark 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
    color: #b93db9;
  }
}

@keyframes glitch-color {
  0% {
    transform: translate(0);
  }

  20% {
    transform: translate(-0.6px, 0.6px);
  }

  40% {
    transform: translate(-0.6px, -0.6px);
  }

  60% {
    transform: translate(0.6px, 0.6px);
  }

  80% {
    transform: translate(0.6px, -0.6px);
  }

  to {
    transform: translate(0);
  }
}
@keyframes glitch-color-dark {
  0% {
    transform: translate(0);
  }

  20% {
    transform: translate(-1px, 1px);
  }

  40% {
    transform: translate(-1px, -1px);
  }

  60% {
    transform: translate(1px, 1px);
  }

  80% {
    transform: translate(1px, -1px);
  }

  to {
    transform: translate(0);
  }
}
</style>
