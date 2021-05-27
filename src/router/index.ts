import { createRouter, createWebHistory } from 'vue-router'
import Config from './config'
import { RoutesConfig, init } from './data'

init(Config)

const routes = RoutesConfig.map((item) => ({
  path: `/${item.hash}`,
  component: () => import(`../${item.file}`)
}))

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_ROUTER_PATH), // 项目 basic path
  scrollBehavior (to, from) {
    if (from && from.path === to.path) {
      return
    }
    if (to.hash) {
      const con = document.querySelector('.page-container') as HTMLElement
      const el = document.getElementById(`${encodeURIComponent(to.hash.slice(1))}`)
      if (con && el) {
        con.style.scrollBehavior = 'auto'
        con.scrollTop = el.getBoundingClientRect().top
        requestAnimationFrame(() => {
          con.style.removeProperty('scroll-behavior')
        })
      }
    }
  },
  routes: [
    ...routes,
    { path: '/:pathMatch(.*)*', redirect: routes[0].path }
  ]
})

export default router
