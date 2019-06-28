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

// 凡是路由请求都会经过这个前置导航守卫---中间件
router.beforeEach((to, from, next) => {
  // 判断是否有token，如果有，则继续，否则重定向到登陆
  var token = localStorage.getItem('itcast_pro_token')
  console.log(to)
  if (token || to.path === '/login') {
    next()
  } else {
    next({ name: 'Login' })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
