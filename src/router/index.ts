import {createRouter, createWebHistory} from 'vue-router'
import Config from './config'

interface Item {
  updateTime: number;
  file: string;
}
const routes = Config.map((item: Item) => ({
  path: `/${item.updateTime}`,
  component: () => import(`../${item.file}`)
}))

export default createRouter({
  history: createWebHistory(),
  routes: [
    ...routes,
    { path: '/:pathMatch(.*)*', redirect: routes[0].path }
  ],
})