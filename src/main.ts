import { createApp } from 'vue'
import router from './router'
import Sandbox from './components/sandbox/index.vue'
import './styles/common.less'
import './styles/hl_theme.less'
import App from './App.vue'
const app = createApp(App)

app.use(router)

app.component('SandBox', Sandbox)
app.mount('#app')
