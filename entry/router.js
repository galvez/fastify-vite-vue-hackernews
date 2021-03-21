import {
  createMemoryHistory,
  createRouter,
  createWebHistory
} from 'vue-router'

export function getRouter () {
  return createRouter({
    history: import.meta.env.SSR
      ? createMemoryHistory()
      : createWebHistory(),
    routes: [{
      path: '/',
      redirect: '/top'
    }, {
      path: '/user/:id',
      component: () => import('../views/user.vue')
    }, {
      path: '/item/:id',
      component: () => import('../views/item.vue')
    }, {
      path: '/:feed/:page?',
      component: () => import('../views/feed.vue')
    }]
  })
}
