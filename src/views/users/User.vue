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
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
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
          <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 插槽：匿名插槽，具名插槽，数据插槽 -->
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
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
      <el-form ref='addForm' :model="addForm" :rules='rules' :label-width="'120px'">
        <el-form-item label="用户名" prop='username'>
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false;$refs.addForm.resetFields()">取 消</el-button>
        <el-button type="primary" @click='add'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllList, addUser } from '@/api/users.js'
export default {
  data () {
    return {
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
          { message: '请输入合法的邮箱', pattern: /\w+[@]\w+[.]\w+/, trigger: 'blur' }
        ],
        mobile: [
          // wuhu0723@126.com
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { message: '请输入正确的手机号', pattern: /^1\d{10}$/, trigger: 'blur' }
        ]
      },
      // 总记录数
      total: '',
      value2: true,
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
    // 新增用户
    add () {
      // 再次进行用户数据的验证
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 发起新增用户请求
          addUser(this.addForm)
            .then(res => {
              if (res.data.meta.staus === 201) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 数据刷新
                this.addDialogFormVisible = false
                // 表单元素的数据重置
                this.$refs.addForm.resetFields()
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
      console.log(`每页 ${val} 条`)
      //   val就是当前设置之后的每页的记录数，我们只需要重置pagesize
      this.pagesize = val
      this.init()
    },
    //   切换当前页码时触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    },
    handleEdit (obj) {
      console.log(obj)
    },
    // 获取数据
    init () {
      getAllList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
          console.log(res)
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
  }
}
</script>

<style lang="less" scoped>
</style>
