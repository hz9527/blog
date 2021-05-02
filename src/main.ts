import { createApp } from 'vue'
import router from './router'
import Sandbox from './components/Sandbox/index.vue'
import Headlines from './components/Headlines/index.vue'
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
app.mount('#app')
