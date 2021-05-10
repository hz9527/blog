import { createRouter, createWebHistory } from 'vue-router'
import { RoutesConfig } from './data'

const routes = RoutesConfig.map((item) => ({
  path: `/${item.hash}`,
  component: () => import(`../${item.file}`)
}))

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior (to, from) {
    if (from && from.path === to.path) {
      return
    }
    if (to.hash) {
      const con = document.querySelector('.page-container')
      const el = document.getElementById(`${encodeURIComponent(to.hash.slice(1))}`)
      if (con && el) {
        con.scrollTo({ top: el.getBoundingClientRect().top })
      }
    }
  },
  routes: [
    ...routes,
    { path: '/:pathMatch(.*)*', redirect: routes[0].path }
  ]
})

export default router
