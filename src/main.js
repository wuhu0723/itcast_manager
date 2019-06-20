import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 下面这个样式文件中已经包含重置样式和图标样式
import '@/styles/index.less'
// 引入路由模块
import router from '@/router.js'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
