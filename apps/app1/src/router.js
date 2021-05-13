import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  base: window.__POWERED_BY_QIANKUN__ ? '/dashboard/welcome' : '/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/view1.vue'),
      children: [
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/user.vue'),
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/about.vue'),
        }
      ]
    }
  ]
});

export default router;
