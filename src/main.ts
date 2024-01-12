import '@/styles/main.css';

import { createApp } from 'vue';
import router from '@/router/index.ts';
import store from '@/store/index.ts';
import App from '@/App.vue';

console.log(process, 'PROCESS');

const app = createApp(App);
app.config.globalProperties.$store = store;

app.use(router);
app.use(store);

async function initNetwork() {
  try {
    if (!window?.ethereum.chainId) return;
    const chainId = Number(window.ethereum.chainId)?.toString();
    store.dispatch('network/saveNetworkToLocalStore', chainId, { root: true });
    console.log('main created networkId: ', chainId);
  } catch (e) {
    console.log('Error when init network:', e);
    // ignore
  }
}

initNetwork().then(() => {
  app.mount('#app');
});
