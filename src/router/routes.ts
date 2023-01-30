import { RouteRecordRaw } from 'vue-router'

const routes:Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Test',
    component: () => import('../views/Test.vue')
  }
]

export default routes
