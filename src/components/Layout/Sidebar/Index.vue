<template>
  <div class="app-sidebar">
    <ul class="sidebar__top">
      <div class="market-container">
        <div class="sidebar__divider-top" />

        <p
          class="sidebar__text-top sidebar__text-top--markets"
        >
          MONEY MARKETS
        </p>

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
    </ul>
  </div>
</template>
<script lang="ts">

export default {
  name: 'SideBar',
  data() {
    return {
      linksData: [
        { name: 'USD+', to: '/market/usd' },
        { name: 'USDC+', to: '/market/usdc' },
        { name: 'ETH+', to: '/market/eth' },
        { name: 'USDT+', to: '/market/usdt' },
        { name: 'DAI+', to: '/market/dai' },
      ],
    };
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

// GLITCH ANIMATION

.stack {
  display: grid;
  grid-template-columns: 1fr;
}

.stack span {
  font-weight: bold;
  grid-row-start: 1;
  grid-column-start: 1;
  font-size: 17px;
  font-weight: 500;
  --stack-height: calc(100% / var(--stacks) - 1px);
  --inverse-index: calc(calc(var(--stacks) - 1) - var(--index));
  --clip-top: calc(var(--stack-height) * var(--index));
  --clip-bottom: calc(var(--stack-height) * var(--inverse-index));
  clip-path: inset(var(--clip-top) 0 var(--clip-bottom) 0);
  animation: stack 340ms cubic-bezier(.46,.29,0,1.24) 1 backwards calc(var(--index) * 120ms), glitch 4s ease infinite 2s alternate-reverse;
}

.stack span:nth-child(odd) { --glitch-translate: 2px; }
.stack span:nth-child(even) { --glitch-translate: -2px; }

@keyframes stack {
  0% {
    opacity: 0;
    transform: translateX(-50%);
    text-shadow: -2px 3px 0 red, 2px -3px 0 blue;
  };
  60% {
    opacity: 0.5;
    transform: translateX(50%);
  }
  80% {
    transform: none;
    opacity: 1;
    text-shadow: 2px -3px 0 red, -2px 3px 0 blue;
  }
  100% {
    text-shadow: none;
  }
}

@keyframes glitch {
  0% {
    text-shadow: -1px 1px 0 rgba(255, 0, 0, 0.205), 1px -1px 0 rgba(0, 0, 255, 0.205);
    transform: translate(var(--glitch-translate));
  }
  3% {
    text-shadow: 1px -1px 0 rgba(255, 0, 0, 0.205)red, -1px 1px 0 rgba(0, 0, 255, 0.205);
    transform: translate(-1px);
  }
  7% {
    text-shadow: -1px 1px 0 rgba(255, 0, 0, 0.205), 1px -1px 0 rgba(0, 0, 255, 0.205);
    transform: translate(var(--glitch-translate));
  }
  8%, 100% {  text-shadow: none; transform: none; }
}
</style>
