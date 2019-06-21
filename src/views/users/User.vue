<template>
    <div class="users">用户列表</div>
</template>
<script>
import { getAllList } from '@/api/users.js'
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 10
    }
  },
  // 页面加载完成就去获取用户列表数据
  mounted () {
    getAllList({ query: this.query, pagenum: this.pagenum, pagesize: this.pagesize })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
</style>
