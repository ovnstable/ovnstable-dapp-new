import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: import('@/views/Main/Index.vue'),
    },
  ],
});

export default router;
