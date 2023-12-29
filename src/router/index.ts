import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: import('@/views/Main/Index.vue'),
    },
    {
      path: '/performance',
      name: 'performance',
      component: import('@/views/Performance/Index.vue'),
    },
  ],
});

export default router;
