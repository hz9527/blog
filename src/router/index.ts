import { createRouter, createWebHistory } from 'vue-router'
import { RoutesConfig } from './data'

const routes = RoutesConfig.map((item) => ({
  path: `/${item.hash}`,
  component: () => import(`../${item.file}`)
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes,
    { path: '/:pathMatch(.*)*', redirect: routes[0].path }
  ]
})

export default router
