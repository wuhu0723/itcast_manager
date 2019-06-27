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
      <el-input
        placeholder="请输入内容"
        v-model="userKey"
        class="input-with-select"
        style="width:300px;margin-right:15px"
        @keyup.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click='init'></el-button>
      </el-input>
      <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="300"></el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateStatus(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 插槽：匿名插槽，具名插槽，数据插槽 -->
        <template v-slot="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" @click='grantuserrole(scope.row)'></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total-0"
    ></el-pagination>

    <!-- 新增用户对话框 -->
    <el-dialog title="新增用户" :visible.sync="addDialogFormVisible">
      <el-form ref="addForm" :model="addForm" :rules="rules" :label-width="'120px'">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false;$refs.addForm.resetFields()">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form ref="editForm" :model="editForm" :rules="rules" :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false;$refs.editForm.resetFields()">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form ref="grantForm" :model="grantForm" :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="grantForm.username" auto-complete="off" disabled style='width:200px'></el-input>
        </el-form-item>
        <!-- 添加下拉列表 -->
        <el-form-item label="角色列表">
          <el-select v-model="grantForm.rid" placeholder="请选择" @change="roleChange">
            <!-- 能够唯一的标识这个节点，后期如果对这个节点进行操作，可以提高操作效率 -->
            <!-- 虚拟dom -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false;">取 消</el-button>
        <el-button type="primary" @click='grantrolesubmit'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllList,
  addUser,
  editUser,
  deleteUser,
  updateUserStatus,
  grantUserRole
} from '@/api/users.js'
import { getAllRoleList } from '@/api/roles.js'
export default {
  data () {
    return {
      roleList: [],
      myvalue: '',
      // 控制角色分配对话框的显示和隐藏
      grantDialogFormVisible: false,
      // 分配角色对应数据
      grantForm: {
        id: '',
        rid: '',
        username: ''
      },
      // 控制编辑用户对话框的显示和隐藏
      editDialogFormVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 控制新增用户对话框的显示和隐藏
      addDialogFormVisible: false,
      // 新增数据的表单数据绑定对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 新增用户和编辑用户数据验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          // wuhu0723@126.com
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            message: '请输入合法的邮箱',
            pattern: /\w+[@]\w+[.]\w+/,
            trigger: 'blur'
          }
        ],
        mobile: [
          // wuhu0723@126.com
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            message: '请输入正确的手机号',
            pattern: /^1\d{10}$/,
            trigger: 'blur'
          }
        ]
      },
      // 总记录数
      total: '',
      query: '',
      //   当前页码
      pagenum: 1,
      //   每页显示的记录数
      pagesize: 4,
      // 搜索关键字
      userKey: '',
      userList: []
    }
  },
  methods: {
    // 分配角色提交
    grantrolesubmit () {
      if (this.grantForm.rid) {
        grantUserRole(this.grantForm.id, this.grantForm.rid)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this.grantDialogFormVisible = false
            }
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择一个角色'
        })
      }
    },
    // 分配指定用户的角色弹出交互框
    grantuserrole (row) {
      this.grantForm.rid = row.rid

      this.grantDialogFormVisible = true
      // 调用接口方法
      // 接口方法需要两个参数：当前用户id,当前所选择的角色id
      this.grantForm.id = row.id
      this.grantForm.username = row.username
    },
    // 下拉列表切换
    roleChange (value) {
      this.grantForm.rid = value
    },
    // 修改用户状态
    updateStatus (id, type) {
      updateUserStatus(id, type).then(res => {
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
        }
      })
    },
    // 根据id删除用户
    del (id) {
      // 弹出删除确认框
      this.$confirm(`此操作将永久删除id号为${id}的数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 发起删除请求
          deleteUser(id)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.init()
              } else if (res.data.meta.status === 401) {
                this.$message({
                  type: 'warning',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑用户
    edit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUser(this.editForm)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 数据刷新
                this.editDialogFormVisible = false
                // 表单元素的数据重置
                this.$refs.editForm.resetFields()
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(() => {
            })
        } else {
          return false
        }
      })
    },
    // 新增用户
    add () {
      // 再次进行用户数据的验证
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 发起新增用户请求
          addUser(this.addForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 数据刷新
                this.addDialogFormVisible = false
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: 'err'
              })
            })
        } else {
          // 中止本次请求
          return false
        }
      })
    },
    //   切换每页显示记录数时触发
    handleSizeChange (val) {
      //   val就是当前设置之后的每页的记录数，我们只需要重置pagesize
      this.pagesize = val
      this.init()
    },
    //   切换当前页码时触发
    handleCurrentChange (val) {
      this.pagenum = val
      this.init()
    },
    // 单击编辑弹出对话框，加载默认数据
    handleEdit (obj) {
      // 让弹出框显示
      this.editDialogFormVisible = true
      // 表单元素实现的双向数据绑定，所以我们只需要为表单元素的双向绑定数据对象有数据就行
      this.editForm.id = obj.id
      this.editForm.username = obj.username
      this.editForm.email = obj.email
      this.editForm.mobile = obj.mobile
    },
    // 获取数据
    init () {
      getAllList({
        query: this.userKey,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  // 页面加载完成就去获取用户列表数据
  mounted () {
    this.init()
    // 加载角色列表数据
    getAllRoleList()
      .then(res => {
        this.roleList = res.data.data
      })
  }
}
</script>

<style lang="less" scoped>
</style>
