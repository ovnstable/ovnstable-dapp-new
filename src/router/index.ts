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
      path: '/positions',
      name: 'positions',
      component: () => import('@/views/Positions/Index.vue'),
    },
    // {
    //   path: '/blastquest',
    //   name: 'blastquest',
    //   component: () => import('@/views/BlastQuest/Index.vue'),
    // },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
