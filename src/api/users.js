import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

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
