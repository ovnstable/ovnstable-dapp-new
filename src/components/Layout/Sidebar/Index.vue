<template>
  <div class="app-sidebar">
    <ul class="sidebar__top">

      <router-link
        to="/homepage"
        class="sidebar__text-top homepage"
      >Homepage</router-link>

      <div class="sidebar__divider-top" />

      <p
        class="sidebar__text-top markets"
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
        to="/insurance"
        class="sidebar__text-top ovn"
      >OVN</p>

      <router-link
        to="/insurance"
        class="sidebar__text-top"
      >OVN overview</router-link>

      <router-link
        to="/insurance"
        class="sidebar__text-top insurance"
      >Insurance</router-link>
    </ul>

    <ul class="sidebar__bottom">
      <a
        href="https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/"
        class="sidebar__text-bottom"
        target="_blank"
        rel="noopener noreferrer"
      >Help Center</a>

      <a
        href="https://docs.overnight.fi/other/terms-of-service"
        class="sidebar__text-bottom"
        target="_blank"
        rel="noopener noreferrer"
      >Terms of service</a>

      <a
        href="https://docs.overnight.fi/other/privacy-policy"
        class="sidebar__text-bottom"
        target="_blank"
        rel="noopener noreferrer"
      >Privacy Policy</a>

      <a
        href="https://docs.overnight.fi/other/audits"
        class="sidebar__text-bottom"
        target="_blank"
        rel="noopener noreferrer"
      >Audits</a>

      <a
        href="https://docs.overnight.fi/advanced/strategies/ets"
        class="sidebar__text-bottom"
        target="_blank"
        rel="noopener noreferrer"
      >ABOUT ETS</a>

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
            class="sidebar__icon-social"
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
            class="sidebar__icon-social"
          />
        </a>
      </div>
      <div class="sidebar__divider-bottom" />
      <div class="sidebar__icons-bottom">
        <SwitchBox
          :isChecked="isDarkTheme"
          @change="toggleTheme"
        />
        <button
          type="button"
          class="sidebar__button-switch-language"
        >ENG</button>
      </div>
    </ul>
  </div>

</template>
<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import SwitchBox from '@/components/Switch/Index.vue';

export default {
  components: {
    BaseIcon,
    SwitchBox,
  },
  name: 'SideBar',
  data() {
    return {
      isDarkTheme: false,
      linksData: [
        { name: 'USD+', to: '/market/usd' },
        { name: 'USDC+', to: '/market/usdc' },
        { name: 'ETH+', to: '/market/eth' },
        { name: 'USDT+', to: '/market/usdt' },
        { name: 'DAI+', to: '/market/dai' },
      ],
    };
  },
  methods: {
    toggleTheme() {
      console.log('-toggleTheme');
      this.$store.dispatch('theme/switchTheme');
    },
  },
};
</script>

<style lang="scss" scoped>
.app-sidebar {
  height: calc(100vh - 100px);
}
.app-sidebar,
.sidebar__top,
.sidebar__bottom {
  display: flex;
  flex-direction: column;
  max-width: 140px;
}
.homepage {
  text-decoration: underline;
}
.sidebar__text-top {
  color: var(--color-1);
  font-size: 17px;
  font-weight: 600;
  margin-top:20px;

  [data-theme="dark"] & {
      color: var(--color-4);
  }
}
.active-link {
  text-decoration: underline;
}
.markets,
.ovn {
  color: var(--color-2);
  font-size: 15px;
  font-weight: 600;
}

.markets {
  margin-bottom: 20px;
}

.sidebar__text-top:hover,
.sidebar__text-bottom:hover {
  cursor: pointer;
  color: #7f8695;
  transition: color 0.15s ease
}
.markets:hover {
  cursor: default;
  color: var(--color-2);
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
.sidebar__text-market:hover {
  cursor: pointer;
  color: var(--color-3);
}
.market-container {
  display: flex;
  flex-direction: column;
}
.market-container .sidebar__text-market:last-child {
  margin-bottom: 0;
}

.insurance {
  margin-top: 20px;
}
.sidebar__text-top:first-child {
  margin-top: 0;
}

.sidebar__divider-top {
  margin-top: 20px;
  border: 1px solid var(--color-1);
}

.sidebar__bottom {
  margin-top: auto;
  margin-bottom: 50px;
}

.sidebar__text-bottom {
  margin-top: 10px;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 600;

  [data-theme="dark"] & {
      color: var(--color-3);
  }
}

.sidebar__text-bottom:first-child {
  margin-top: 0;
}
.sidebar__icon-social:hover {
  cursor: pointer;
  transform: scale(1.2);
  transition: transform 0.15s ease
}

.sidebar__divider-bottom {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--color-2);

  [data-theme="dark"] & {
      color: var(--color-3);
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

.sidebar__button-switch-language {
  margin-left: 40px;
  padding: 0px 14px 0px 6px;
  border-radius: 12px;
  border: 1px solid var( --color-2);
  background: var(--color-5);
  color: var( --color-2);
  text-align: center;
  font-size: 14px;

  [data-theme="dark"] & {
    border: 1px solid var(--color-3);
    background: var(--color-17);
    color: var( --color-4);
  }
}
</style>
