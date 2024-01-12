<template>
  <div class='sidebar'>
    <ul class="sidebar__top">

      <router-link
        to="/homepage"
        :class="['sidebar__text-top', { 'dark-theme-text-top': isDarkTheme }]"
      >Homepage</router-link>

      <router-link
        to="/pools"
        :class="['sidebar__text-top', { 'dark-theme-text-top': isDarkTheme }]"
      >All pools</router-link>

      <div :class="['sidebar__divider-top', { 'dark-theme-divider-top': isDarkTheme }]" />

      <router-link
        to="/money-market"
        :class="['sidebar__text-top', { 'dark-theme-text-top': isDarkTheme }]"
      >Money market</router-link>

      <div :class="['sidebar__divider-top', { 'dark-theme-divider-top': isDarkTheme }]" />

      <router-link
        to="/insurance"
        :class="['sidebar__text-top', { 'dark-theme-text-top': isDarkTheme }]"
      >Insurance</router-link>

      <router-link
        to="/ovn-lp"
        :class="['sidebar__text-top ovn-lp', { 'dark-theme-text-top': isDarkTheme }]"
      >OVN LP</router-link>

      <div :class="['sidebar__divider-top', { 'dark-theme-divider-top': isDarkTheme }]" />

      <router-link
        to="/calculator"
        :class="['sidebar__text-top', { 'dark-theme-text-top': isDarkTheme }]"
      >Calculator</router-link>
    </ul>

    <ul class="sidebar__bottom">
      <a
        href="https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/"
        :class="['sidebar__text-bottom', { 'dark-theme-text-bottom': isDarkTheme }]"
        target="_blank"
        rel="noopener noreferrer"
      >Help Center</a>

      <a
        href="https://docs.overnight.fi/other/terms-of-service"
        :class="['sidebar__text-bottom', { 'dark-theme-text-bottom': isDarkTheme }]"
        target="_blank"
        rel="noopener noreferrer"
      >Terms of service</a>

      <a
        href="https://docs.overnight.fi/other/privacy-policy"
        :class="['sidebar__text-bottom', { 'dark-theme-text-bottom': isDarkTheme }]"
        target="_blank"
        rel="noopener noreferrer"
      >Privacy Policy</a>

      <a
        href="https://docs.overnight.fi/other/audits"
        :class="['sidebar__text-bottom', { 'dark-theme-text-bottom': isDarkTheme }]"
        target="_blank"
        rel="noopener noreferrer"
      >Audits</a>

      <a
        href="https://docs.overnight.fi/advanced/strategies/ets"
        :class="['sidebar__text-bottom', { 'dark-theme-text-bottom': isDarkTheme }]"
        target="_blank"
        rel="noopener noreferrer"
      >ABOUT ETS</a>

      <div :class="['sidebar__divider-bottom', { 'dark-theme-divider-bottom': isDarkTheme }]" />
      <div class="sidebar__icons-bottom">
        <a
          href="https://twitter.com/overnight_fi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <BaseIcon
            name="twitter"
            path="assets/icons/social/IconTwitter.vue"
            class="sidebar__icon-social"
            :fillColor="fillColorIcon"
          />
        </a>
        <a
          href="https://discord.gg/overnight-fi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
        >
          <BaseIcon
            name="discord"
            path="assets/icons/social/IconDiscord.vue"
            class="sidebar__icon-social"
            :fillColor="fillColorIcon"
          />
        </a>
      </div>
      <div :class="['sidebar__divider-bottom', { 'dark-theme-divider-bottom': isDarkTheme }]" />
      <div class="sidebar__icons-bottom">
        <SwitchBox
          :isChecked="isDarkTheme"
          @change="toggleTheme"
        />
        <button
          type="button"
          :class="['sidebar__button-switch-language', { 'dark-theme-switch-language': isDarkTheme }]"
        >ENG</button>
      </div>
    </ul>
  </div>

</template>
<script lang="ts">

import BaseIcon from '@/components/Icon/BaseIcon.vue';
import SwitchBox from '@/modules/main/components/SwitchBox.vue';
import { mapState } from 'vuex';

export default {
  components: {
    BaseIcon,
    SwitchBox,
  },
  name: 'SideBar',
  computed: {
    ...mapState({
      isDarkTheme: (state: any) => state.accountUI.isDarkTheme,
    }),
    themeClass() {
      return {
        'dark-theme': this.isDarkTheme,
        'light-theme': !this.isDarkTheme,
      };
    },
    iconLightThemeColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-2').trim();
    },
    iconDarkThemeColor() {
      return getComputedStyle(document.body).getPropertyValue('--color-19').trim();
    },
    fillColorIcon():string {
      return this.isDarkTheme ? this.iconDarkThemeColor : this.iconLightThemeColor;
    },
  },
  methods: {
    toggleTheme(isChecked:any) {
      console.log(isChecked);
      this.$store.commit('accountUI/setIsDarkTheme', isChecked);
    },
  },
};
</script>

<style scoped>

.sidebar,
.sidebar__top,
.sidebar__bottom {
  display: flex;
  flex-direction: column;
  max-width: 140px;
}

.sidebar__text-top {
  color: var(--color-1);
  font-size: 17px;
  font-weight: 600;
  margin-top:20px;
  transition: color 0.15s ease;
}

.sidebar__text-top:hover {
  cursor: pointer;
  color: #7f8695;
  transition: color 0.15s ease
}

.ovn-lp {
  margin-top: 10px;
}
.sidebar__text-top:first-child {
  margin-top: 0;
}

.sidebar__divider-top {
  margin-top: 20px;
  border: 1px solid var(--color-1);
  transition: border 0.15s ease;
}

.sidebar__bottom {
  margin-top: 252px;
}

.sidebar__text-bottom {
  margin-top: 10px;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 600;
}

.sidebar__text-bottom:hover {
  color: #050a17;
  cursor: pointer;
  transition: color 0.15s ease;
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
  background: var(--4, #FFF);
  color: var( --color-2);
  text-align: center;
  font-size: 14px;
}

.sidebar__text-top,
.sidebar__text-bottom {
  transition: color 0.15s ease;
}

.dark-theme-text-top {
  color: var(--color-5);
  transition: color 0.15s ease;
}
.dark-theme-divider-top {
  border: 1px solid var(--color-5);
  transition: border 0.15s ease;
}
.dark-theme-text-bottom {
  color: var(--color-19);
  transition: color 0.15s ease;
}
.dark-theme-text-bottom:hover {
  color: #7f8695;
  transition: color 0.15s ease;
}
.dark-theme-divider-bottom {
  color: var(--color-19);
  transition: color 0.15s ease;
}
.dark-theme-switch-language {
  border: 1px solid var(--color-19);
  background: var(--color-1);
  color: var(--color-19);
}


</style>
