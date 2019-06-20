import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入登陆组件
// 在项目中引入资源，一般使用绝对路径
// 在配置文件中，已经进行根目录的配置。@符合就代码src根目录
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
Vue.use(VueRouter)

// 创建路由模块
var router = new VueRouter({
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/home',
      component: Home
    }
  ]
})

// module.exports = router
export default router
