import { createApp } from 'vue'
import router from './router'
import Sandbox from './components/Sandbox/index.vue'
import Headlines from './components/Headlines/index.vue'
import MindMap from './components/MindMap/index.vue'
import InnerLink from './components/InnerLink/index.vue'
import { timeFormat } from './utils/utils'
import { setGlobal, MODAL_KEY } from './utils/hook'
import eventBus from './utils/event'
import './styles/common.less'
import './styles/hl_theme.less'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use({
  install (app) {
    app.mixin({
      beforeCreate () {
        if (typeof this.$options.customProps === 'function') {
          const res = this.$options.customProps.call(this)
          res && res.constructor === Object && Object.assign(this, res)
        }
      }
    })
  }
})

app.component('Sandbox', Sandbox)
app.component('Headlines', Headlines)
app.component('MindMap', MindMap)
app.component('InnerLink', InnerLink)

app.config.globalProperties.$filters = {
  timeFormat
}

setGlobal(app, MODAL_KEY, {
  show () {
    console.warn('modal component not installed')
  },
  hide () {}
})

document.body.addEventListener('click', (e) => {
  eventBus.emit('bodyClick', e)
}, true)

app.mount('#app')
