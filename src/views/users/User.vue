<template>
  <div class="users">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="userKey" class="input-with-select" style='width:300px;margin-right:15px'>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </div>
  </div>
</template>
<script>
import { getAllList } from '@/api/users.js'
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 10,
      // 搜索关键字
      userKey: ''
    }
  },
  // 页面加载完成就去获取用户列表数据
  mounted () {
    getAllList({
      query: this.query,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })
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
