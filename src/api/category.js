import axios from '@/utils/myaxios.js'

export const getCategoriesList = (level) => {
  return axios({
    url: 'categories',
    params: { type: level }
  })
}
