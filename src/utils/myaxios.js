import axios from 'axios'
// 设置基准路径
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
var myaxios = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/'
})

myaxios.interceptors.request.use(function (config) {
  var token = localStorage.getItem('itcast_pro_token')
  if (token) {
    config.headers['Authorization'] = token
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

// 暴露成员
export default myaxios
// module.exports = myaxios
