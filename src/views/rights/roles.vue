<template>
  <div class="role">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain>添加角色</el-button>
    <el-table :data="roleList" style="width: 100%">
      <!-- type="expand"：说明这列可以实现展开 -->
      <el-table-column type="expand">
        <!-- 展开的时候，template模板中的结构就是展开行的内容 -->
        <template slot-scope="scope">
          <el-row v-for="first in scope.row.children" :key="first.id" style='margin-bottom:15px'>
            <el-col :span="4">
              <el-tag closable type="success">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
                <el-row v-for='second in first.children' :key='second.id'>
                    <el-col :span='4'>
                        <el-tag closable type="info">{{second.authName}}</el-tag>
                    </el-col>
                    <el-col :span='20'>
                        <el-tag closable type="info" v-for='third in second.children' :key='third.id'>{{third.authName}}</el-tag>
                    </el-col>
                </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <!-- 插槽：匿名插槽，具名插槽，数据插槽 -->
        <template v-slot="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRoleList } from '@/api/roles.js'
export default {
  data () {
    return {
      roleList: []
    }
  },
  mounted () {
    getAllRoleList().then(res => {
      console.log(res)
      // 所有角色数据
      this.roleList = res.data.data
    })
  }
}
</script>
<style lang="less" scoped>
</style>
