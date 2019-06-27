<template>
  <div class="add">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加步骤条 -->
      <el-steps :active="activeName - 0" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
        <el-step title="步骤 4"></el-step>
        <el-step title="步骤 5"></el-step>
      </el-steps>
      <!-- 添加标签页 -->
      <el-tabs v-model="activeName" tab-position='left' style='margin-top:15px'>
        <el-tab-pane label="用户管理" name="0">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="1">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="2">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="3">定时任务补偿</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="4">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: '0'
    }
  }
}
</script>
<style lang="less" scoped>
</style>
