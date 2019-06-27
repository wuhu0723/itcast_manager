// import axios from 'axios'
// // 设置基准路径
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// // 添加请求拦截器
// // axios如果发现用户请求，就会调用use中的函数进行处理， 同时为这个函数传入一个config参数
// // 请求相关数据--请求报文
// // config有请求头
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   // 获取可能有的token数据，进行请求头的设置，格式Authorization:token
//   var token = localStorage.getItem('itcast_pro_token')
//   // 判断有没有token，有则传递
//   if (token) {
//     // console.log(config)
//     config.headers['Authorization'] = token
//   }

//   return config
// }, function (error) {
//   // 对请求错误做些什么
//   // return new Promise({})
//   // 终止当前请求，最终axios.catch来响应
//   return Promise.reject(error)
// })
import axios from '@/utils/myaxios.js'

// 添加登陆验证方法
// 在vue中，暴露成员可以使用export
export const userlogin = (data) => {
  // 我们不希望通过回调的方式在这边进行操作之后的方法调用，因为post方法返回一个promise,所以可以以后在方法调用的时候进行then和catch
//   return axios.post(url, data)
  return axios({
    url: 'login',
    method: 'post',
    data: data
  })
}

// 获取所有用户数据
export const getAllList = (params) => {
  return axios({
    url: 'users',
    params: params
  })
}

// 新增用户
export const addUser = (data) => {
  return axios({
    method: 'post',
    url: 'users',
    data
  })
}

// 编辑用户
/**
 * 这个方法可以实现用户数据的编辑
 * @param {object} data-用户对象
 */
export const editUser = (data) => {
  return axios({
    method: 'put',
    url: `users/${data.id}`,
    data
  })
}

// 删除用户
export const deleteUser = (id) => {
  return axios({
    method: 'delete',
    url: `users/${id}`
  })
}

// 修改用户状态
export const updateUserStatus = (id, type) => {
  return axios({
    method: 'put',
    url: `users/${id}/state/${type}`
  })
}

// 分配用户角色
// id:就是id号
// rid:也是一个id号
export const grantUserRole = (id, rid) => {
  return axios({
    method: 'put',
    url: `users/${id}/role`,
    data: { rid: rid }
  })
}
