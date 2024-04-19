<template>
  <div class="footer-mobile">
    <router-link
      class="footer-mobile__btn"
      v-for="item in linksData"
      :class="{ insurance: item.icon === 'FooterOvn' }"
      active-class="active-link"
      :key="item.icon"
      :to="item.link"
    >
      <div class="footer-mobile-descr">
        <BaseIcon
          :name="item.icon"
        />
        <p>{{item.descr}}</p>
      </div>

    </router-link>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'FooterMobile',
  components: {
    BaseIcon,
  },
  data() {
    return {
      linksData: [
        {
          icon: 'FooterNotify',
          link: '/notify',
          descr: 'NOTIFICATIONS',
        },
        {
          icon: 'FooterOvn',
          link: '/insurance',
          descr: 'OVN & INS',
        },
        {
          icon: 'FooterHome',
          link: '/',
          descr: 'HOMEPAGE',
        },
        {
          icon: 'FooterPlus',
          link: '/market/usd',
          descr: 'MONEY MARKETS',
        },
        {
          icon: 'FooterSettings',
          link: '/dashboard',
          descr: 'DASHBOARD',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.footer-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: var(--color-4);
  border-top: 1px solid var(--color-1);
  z-index: 200;
}

.footer-mobile__btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding: 20px 0 30px 0;
  transition: background-color .2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:nth-child(1) {
    pointer-events: none;
    opacity: .5;
  }

  &.active-link {
    p {
      color: var(--color-3);
    }
    svg {
      width: 25px;
      height: 25px;
    }

    svg * {
      fill: var(--color-3);
      stroke: var(--color-3);
      [data-theme="dark"] & {
        fill: var(--color-17);
        stroke: var(--color-17);
      }
    }

    &:nth-child(2) {
      svg * {
        stroke: initial;
        fill: initial;
      }
      svg rect, svg path {
        fill: var(--color-3);
      }
    }

  }
}

.ovn-hover {
  &:hover {
    svg path, svg rect {
      fill: var(--color-3);
    }
  }
}

.basic-hover {
  &:hover {
    svg * {
      fill: var(--color-3);
      stroke: var(--color-3);
    }
  }
}

.footer-mobile-descr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  p {
    font-size: 8px;
    color: var(--color-7);
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}
</style>
