import '@/styles/main.scss';

import { createApp } from 'vue';
import { createAuth0 } from '@auth0/auth0-vue';
import Popper from 'vue3-popper';
import Notifications from '@kyvg/vue3-notification';

import router from '@/router/index.ts';
import store from '@/store/index.ts';
import App from '@/App.vue';
import VueApexCharts from 'vue3-apexcharts';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createContext } from '@/context.ts';

const app = createApp(App);

app.config.globalProperties.$store = store;
app.use(VueQueryPlugin);
app.use(VueApexCharts);
app.use(router);
app.use(store);
app.use(Notifications);
app.use(
  createAuth0({
    domain: import.meta.env.VITE_APP_AUTH_TWITTER_DOMAIN,
    clientId: import.meta.env.VITE_APP_AUTH_TWITTER_CLIENTID,
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  }),
);
app.component('PopperComponent', Popper);

const ctx = createContext();
app.provide('poolService', ctx.PoolService);
app.provide('tokenService', ctx.TokenService);
app.provide('balanceService', ctx.BalanceService);
app.provide('posthogService', ctx.PosthogService);

// TODO: solve without setting instance directly
store.dispatch('accountData/initPosthog', ctx.PosthogService);

app.mount('#app');
