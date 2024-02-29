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
      <div class="sidebar__divider-bottom" />
      <div class="sidebar__icons-bottom">
        <SwitchBox
          :isChecked="isDarkTheme"
          @change="toggleTheme"
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
import SwitchBox from '@/components/Switch/Index.vue';
import SelectComponent from '@/components/Select/Index.vue';
import { delay } from 'lodash';

export default {
  components: {
    BaseIcon,
    SwitchBox,
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
    async triggerTranslate(val: any) {
      // const el = document.querySelector('.goog-te-combo');
      // if (el) el.value() = theLang;
      const index = Number(val) - 1;
      const langId = this.selectListDemo[index].code;
      localStorage.setItem('ovn-lang', langId);
      this.$router.push(`#googtrans(en|${langId})`);
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
  margin-top:20px;
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
  border: 1px solid var(--color-1);
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
.sidebar__icon-social:hover {
  cursor: pointer;
  transform: scale(1.2);
  transition: transform 0.15s ease;
}
.sidebar__icon-social {
  fill: var(--color-2);
  [data-theme="dark"] & {
    fill: var(--color-18);
  }
}

.icon-twitter:hover {
  fill: var(--color-3);
  [data-theme="dark"] & {
    fill: var(--color-8);
  }
}

.icon-discord:hover {
  fill: #5765f1;
}

.sidebar__divider-bottom {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--color-2);

  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.sidebar__icons-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.sidebar__button-switch-language:hover {
  cursor: pointer;
}

</style>
