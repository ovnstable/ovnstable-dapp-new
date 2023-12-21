<template>
  <div class="sidebar">
    <ul class="sidebar__top">
      <p class="sidebar__text-top">Homepage</p>
      <p class="sidebar__text-top">All pools</p>
      <hr class="sidebar__divider-top" />
      <p class="sidebar__text-top">Money market</p>
      <hr class="sidebar__divider-top" />
      <p class="sidebar__text-top ovn">OVN</p>
      <p class="sidebar__text-top">Insurance</p>
      <p class="sidebar__text-top ovn-lp">OVN LP</p>
      <hr class="sidebar__divider-top" />
      <p class="sidebar__text-top">Calculator</p>
    </ul>
    <ul class="sidebar__bottom">
      <p class="sidebar__text-bottom">Help Center</p>
      <p class="sidebar__text-bottom">Terms of service</p>
      <p class="sidebar__text-bottom">Privacy Policy</p>
      <p class="sidebar__text-bottom">Audits</p>
      <p class="sidebar__text-bottom">ABOUT ETS</p>
      <hr class="sidebar__divider-bottom" />
      <div class="sidebar__icons-bottom">
        <IconTwitter class="sidebar__icon-social" />
        <IconDiscord class="sidebar__icon-social" />
      </div>
      <hr class="sidebar__divider-bottom" />
      <div class="sidebar__icons-bottom">
        <IconSwitchTheme class="sidebar__button-switch-theme" />
        <button
          type="button"
          class="sidebar__button-switch-language"
        >ENG</button>
      </div>
    </ul>
  </div>
</template>
<script lang="ts">

import IconDiscord from '@/assets/icons/social/IconDiscord.vue';
import IconTwitter from '@/assets/icons/social/IconTwitter.vue';
import IconSwitchTheme from '@/assets/icons/theme/IconSwitchTheme.vue';

export default {
  components: {
    IconDiscord,
    IconTwitter,
    IconSwitchTheme,
  },
  name: 'SideBar',
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  max-width: 140px;
}

.sidebar__text-top {
  color: var(--1, #0F172A);
  font-size: 17px;
  font-weight: 600;
  margin-top:20px;
}

.sidebar__text-top:not(.ovn):hover {
  cursor: pointer;
  color: #7f8695;
  transition: color .15s ease
}

.ovn {
  color: var(--2, #687386);
  font-size: 15px;
  font-weight: 700;
}

.ovn-lp {
  margin-top: 10px;
}
.sidebar__text-top:first-child {
  margin-top: 0;
}

.sidebar__divider-top {
  margin-top: 20px;
  border: 1px solid #0F172A;;
}

.sidebar__bottom {
  margin-top: 252px;
}

.sidebar__text-bottom {
  margin-top: 10px;
  color: var(--2, #687386);
  font-size: 15px;
  font-weight: 600;
}

.sidebar__text-bottom:hover {
  color: #050a17;
  cursor: pointer;
  transition: color .15s ease;

}

.sidebar__text-bottom:first-child {
  margin-top: 0;
}
.sidebar__icon-social:hover {
  cursor: pointer;
  transform: scale(1.2);
  transition: transform .15s ease
}

.sidebar__divider-bottom {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #687386;
}

.sidebar__icons-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.sidebar__button-switch-theme:hover,
.sidebar__button-switch-language{
  cursor: pointer;
}

.sidebar__button-switch-language {
  margin-left: 40px;
  padding: 0px 14px 0px 6px;
  border-radius: 12px;
  border: 1px solid var(--2, #687386);
  background: var(--4, #FFF);
  color: var(--2, #687386);
  text-align: center;
  font-size: 14px;
}

</style>
