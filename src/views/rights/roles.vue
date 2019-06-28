<template>
  <div class="role">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click='adddialogFormVisible=true'>添加角色</el-button>
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
                @close="cnt=0;deleteright(scope.row,first.id)"
                v-if="first.children.length !== 0"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:10px;">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="cnt=0;deleteright(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="danger"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin:0 4px 4px 0"
                    @close="cnt=0;deleteright(scope.row,third.id)"
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
          ref="tree"
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="checkedArr"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="adddialogFormVisible">
      <el-form :model="roleForm"  :label-width="'120px'">
        <el-form-item label="角色名称"  v-focus>
          <el-input v-model="roleForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='add'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRoleList,
  deleteRightById,
  grantRightByRoleId,
  addRole
} from '@/api/roles.js'
import { getAllRightList } from '@/api/rights.js'
export default {
  data () {
    return {
      cnt: 0,
      // 标记角色对话框的显示和隐藏
      adddialogFormVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      roleId: '',
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
  directives: {
    'focus': {
      inserted (el) {
        el.focus()
      }
    }
  },
  methods: {
    // 实现角色的添加
    add () {
      addRole(this.roleForm)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 201) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.adddialogFormVisible = false
            this.init()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 实现角色授权提交
    grantSubmit () {
      // var arr = this.$refs.tree.getCheckedKeys()
      var arr = this.$refs.tree.getCheckedNodes()
      // [authName: "添加订单",id: 109,path: (...),pid: "107,102"]
      console.log(arr)
      // 我们需要的是每个权限所对应的id，同时包含它们的父级id
      // 1.遍历Arr,获取里面的两个值：id   pid  ,遍历：我需要遍历拼接后的结果["109,107,102",'154,107,102']
      // 它可以将回调函数的操作结果存储到map函数内部所创建的数组中，当遍历完之后再将其返回
      var temp = arr.map(value => {
        return value.id + ',' + value.pid
      })
      // ["109,107,102", "154,107,102"]
      console.log(temp)
      // 去除重复值--数组才能去重
      // 将数组拼接为字符串 “109,107,102,154,107,102"
      var str = temp.join(',')
      console.log(str)
      console.log(str.split(','))
      // 数组去重.new Set可以创建一个set对象，同时去除重复值
      var obj = new Set(str.split(','))
      console.log(obj)
      // 最终需要一个去除了重复值的数组,...可以将对象中的数据一个一个展开
      var final = [...obj]
      console.log(final.join(','))

      // 调用接口方法实现角色授权
      grantRightByRoleId(this.roleId, final.join(',')).then(res => {
        console.log(res)
      })
    },
    // 打开授权对话框
    showGrantDialog (row) {
      this.roleId = row.id
      this.grantdialogFormVisible = true
      // 获取所有权限数据
      getAllRightList('tree').then(res => {
        console.log(res)
        this.rightList = res.data.data
      })
      // 获取当前角色所拥有的所有权限id
      // 先将上一个角色的权限id数组清空
      this.checkedArr.length = 0
      row.children.forEach(first => {
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
        if (res.data.meta.status === 200) {
          if (this.cnt === 0) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.cnt++
          }

          console.log('--------------')
          console.log(res.data.data)
          console.log('--------------')
          // 新的需求：当删除完这个权限之后，应该判断这个权限还有没有兄弟权限，就应该也删除上一级权限
          // 我们需要对返回的数据(删除之后这个角色还拥有的权限)进行重新的遍历，判断某个权限是否还有子级权限，如果有，则不处理，如果没有，则也要删除没有任何子级权限的权限
          var data = res.data.data
          data.forEach((v1, i1) => {
            // 判断它有没有子级权限
            if (v1.children.length === 0) { // 说明没有子级权限了
              this.deleteright(row, v1.id)
            } else {
              v1.children.forEach((v2, i2) => {
                if (v2.children.length === 0) {
                  this.deleteright(row, v2.id)
                }
              })
            }
          })
          // 数据的刷新
          row.children = res.data.data
        }
      })
    },
    // 数据初始化
    init () {
      getAllRoleList().then(res => {
        console.log(res)
        // 所有角色数据
        this.roleList = res.data.data
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.box {
  height: 400px;
  overflow: scroll;
}
</style>
