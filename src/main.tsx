import { createApp } from 'vue'
import router from './router'
import Sandbox from './components/Sandbox/index.vue'
import Headlines from './components/Headlines/index.vue'
import MindMap from './components/MindMap/index.vue'
import InnerLink from './components/InnerLink/index.vue'
import Preview from './components/common/preview.vue'
import { timeFormat } from './utils/utils'
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

app.config.globalProperties.$modal = {
  show () {
    console.warn('modal component not installed')
  },
  hide () {}
}

document.body.addEventListener('click', (e) => {
  eventBus.emit('bodyClick', e)
}, true)

eventBus.on('bodyClick', (e) => {
  const target = e.target as HTMLImageElement
  if (target.nodeName === 'IMG' && target.dataset.type === 'preview') {
    app.config.globalProperties.$modal.show(<Preview src={target.src} />)
  }
})

app.mount('#app')
