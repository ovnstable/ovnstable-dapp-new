<template>
  <div class="sidebar">
    <ul class="sidebar__top">

      <router-link
        to="/homepage"
        class="sidebar__text-top"
      >Homepage</router-link>

      <router-link
        to="/pools"
        class="sidebar__text-top"
      >All pools</router-link>

      <div class="sidebar__divider-top" />

      <router-link
        to="/performance"
        class="sidebar__text-top"
      >Money market</router-link>

      <div class="sidebar__divider-top" />

      <router-link
        to="/insurance"
        class="sidebar__text-top"
      >Insurance</router-link>

      <router-link
        to="/ovn-lp"
        class="sidebar__text-top ovn-lp"
      >OVN LP</router-link>

      <div class="sidebar__divider-top" />

      <router-link
        to="/calculator"
        class="sidebar__text-top"
      >Calculator</router-link>
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
import SwitchBox from '@/modules/main/components/SwitchBox.vue';

export default {
  components: {
    BaseIcon,
    SwitchBox,
  },
  name: 'SideBar',
  data() {
    return {
      isDarkTheme: false,
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
.sidebar,
.sidebar__top,
.sidebar__bottom {
  display: flex;
  flex-direction: column;
  max-width: 140px;
}

.sidebar__text-top {
  color: var(--color-4);
  font-size: 17px;
  font-weight: 600;
  margin-top:20px;

  [data-theme="dark"] & {
      color: var(--color-2);
  }
}

.sidebar__text-top:hover,
.sidebar__text-bottom:hover {
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
  border: 1px solid var(--color-black);
}

.sidebar__bottom {
  margin-top: 252px;
}

.sidebar__text-bottom {
  margin-top: 10px;
  color: var(--color-dark-grey);
  font-size: 15px;
  font-weight: 600;
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
  border: 1px solid var(--color-dark-grey);
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
  border: 1px solid var( --color-dark-grey);
  background: var(--4, #FFF);
  color: var( --color-dark-grey);
  text-align: center;
  font-size: 14px;
}
</style>
