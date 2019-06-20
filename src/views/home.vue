<template>
    <div class="home">首页</div>
</template>
<script>
import { getAllList } from '@/api/users.js'
export default {
  mounted () {
    getAllList({
      query: '',
      pagenum: 1,
      pagesize: 10
    }).then(res => {
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
