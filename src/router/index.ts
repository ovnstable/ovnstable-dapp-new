import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/Main/Index.vue'),
    },
    {
      path: '/market/eth',
      name: 'market',
      component: () => import('@/views/Market/Index.vue'),
    },
  ],
});

export default router;
