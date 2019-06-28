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
      </el-steps>
      <!-- 添加标签页 -->
      <el-form style="margin-top:15px" label-width="80px">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="基本参数" name="0">
            <el-form-item label="商品名称">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodsForm.goods_price" max="100" min="0" step="0.1" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 添加级联选择器 -->
              <el-cascader :options="cateList" :props="cateprops" clearable @change="getcatid"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="1">
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :headers='getToken()'
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success='handleSuccess'
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品描述" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品参数" name="3">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getCategoriesList } from '@/api/category.js'
export default {
  data () {
    return {
      fileList: [],
      // 所有分类数据
      cateList: [],
      cateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: '0',
      goodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        atts: []
      }
    }
  },
  methods: {
    // 设置请求头传递token
    getToken () {
      var token = localStorage.getItem('itcast_pro_token')
      return { 'Authorization': token }
    },
    // 上传成功之后的处理函数
    handleSuccess () {},
    // 预览
    handlePreview () {},
    // 移除
    handleRemove () {},
    // 获取当前级联选择器的value
    getcatid (value) {
      // console.log(value.join(','))
      this.goodsForm.goods_cat = value.join(',')
    }
  },
  mounted () {
    getCategoriesList([3])
      .then(res => {
        console.log(res)
        this.cateList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
</style>
