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
      path: '/market/:id',
      name: 'market',
      component: () => import('@/views/Market/Index.vue'),
    },
    {
      path: '/insurance',
      name: 'insurance',
      component: () => import('@/views/Insurance/Index.vue'),
    },
    {
      path: '/ovn',
      name: 'ovn',
      component: () => import('@/views/Ovn/Index.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard/Index.vue'),
    },
    {
      path: '/pools',
      name: 'pools',
      component: () => import('@/views/Pools/Index.vue'),
    },
    {
      path: '/pools/zapin/:platform',
      name: 'zapinPool',
      component: () => import('@/views/Zapin/Index.vue'),
    },
    {
      path: '/positions',
      name: 'positions',
      component: () => import('@/views/Positions/Index.vue'),
    },
    {
      path: '/positions/:id',
      name: '/positions/:id',
      component: () => import('@/views/Manage/Index.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
