import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './assets/css/reset.css'
import './assets/css/style.css'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

app.use(router)
app.mount('#app')

app.config.errorHandler = (err) => {
  console.log('Error', err)
}
