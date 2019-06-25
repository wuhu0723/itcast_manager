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
          <!-- 遍历数据行对象的children -->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:10px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="deleteright(scope.row,first.id)"
                v-if="first.children.length !== 0"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:10px;">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="deleteright(scope.row,second.id)"
                    v-if="second.children.length !== 0"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="danger"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin:0 4px 4px 0"
                    @close="deleteright(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-if="scope.row.children.length === 0">没有任何的权限数据，请先添加</el-col>
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
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限弹出框 -->
    <el-dialog title="角色授权" :visible.sync="grantdialogFormVisible">
      <div class="box">
        <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all='true'
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, deleteRightById } from '@/api/roles.js'
import { getAllRightList } from '@/api/rights.js'
export default {
  data () {
    return {
      // 当前角色权限id数组
      checkedArr: [],
      // 所有权限数据
      rightList: [],
      // 树形组件节点配置
      defaultProps: {
        // 如果找下一级数据
        children: 'children',
        // 设置用于展示的标签属性
        label: 'authName'
      },
      grantdialogFormVisible: false,
      roleList: []
    }
  },
  methods: {
    // 打开授权对话框
    showGrantDialog (row) {
      this.grantdialogFormVisible = true
      // 获取所有权限数据
      getAllRightList('tree')
        .then(res => {
          console.log(res)
          this.rightList = res.data.data
        })
      // 获取当前角色所拥有的所有权限id
      // 先将上一个角色的权限id数组清空
      this.checkedArr.length = 0
      row.children.forEach((first) => {
        if (first.children.length > 0) {
          // 遍历二级权限
          first.children.forEach(second => {
            if (second.children.length > 0) {
              // 遍历三级权限
              second.children.forEach(third => {
                this.checkedArr.push(third.id)
              })
            }
          })
        }
      })
    },
    // 删除指定权限
    deleteright (row, rightid) {
      deleteRightById(row.id, rightid).then(res => {
        console.log('--------------')
        console.log(res)
        console.log('--------------')
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
          // 数据的刷新
          row.children = res.data.data
        }
      })
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
.box{
  height: 400px;
  overflow: scroll;
}
</style>
