import '@/styles/main.scss';

import { createApp } from 'vue';
import { createAuth0 } from '@auth0/auth0-vue';
import Popper from 'vue3-popper';
import Notifications from '@kyvg/vue3-notification';

import router from '@/router/index.ts';
import store from '@/store/index.ts';
import App from '@/App.vue';

const app = createApp(App);

app.config.globalProperties.$store = store;
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

async function initNetwork() {
  try {
    if (!window?.ethereum.chainId) return;
    const chainId = Number(window.ethereum.chainId)?.toString();
    store.dispatch('theme/initTheme');
    store.dispatch('network/saveNetworkToLocalStore', chainId, { root: true });
  } catch (e) {
    console.log('Error when init network:', e);
    // ignore
  }
}

initNetwork().then(() => {
  app.mount('#app');
});
