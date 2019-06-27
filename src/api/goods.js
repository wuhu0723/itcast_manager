import axios from '@/utils/myaxios.js'

// 获取所有商品数据列表
export const getAllGoodsList = (obj) => {
  return axios({
    method: 'get',
    url: 'goods',
    params: obj
  })
}
