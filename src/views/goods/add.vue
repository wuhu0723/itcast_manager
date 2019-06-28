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
              :headers="getToken()"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-upload='bu'
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品描述" name="2">
            <quill-editor v-model="goodsForm.goods_introduce" ref="myQuillEditor" :options="editorOption" style='height:300px;border-bottom:1px solid #ccc;'></quill-editor>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="3">定时任务补偿</el-tab-pane>
        </el-tabs>
        <el-button type="primary" style='float:right;margin:20px 0' @click='addGoods'>添加商品</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getCategoriesList } from '@/api/category.js'
import { addGoodsInfo } from '@/api/goods.js'
export default {
  data () {
    return {
      // 富文本的配置，主要用来配置样式按钮
      editorOption: {},
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
    bu (file) {
      console.log(file)
      if (file.type.indexOf('image/') !== 0) {
        this.$message({
          type: 'warning',
          message: '请选择图片格式的文件'
        })
        // return false会触发handleRemove操作
        return false
      }
    },
    // 添加商品信息
    addGoods () {
      console.log(this.goodsForm)
      addGoodsInfo(this.goodsForm)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 201) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.$router.push({ name: 'List' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 设置请求头传递token
    getToken () {
      var token = localStorage.getItem('itcast_pro_token')
      return { Authorization: token }
    },
    // 上传成功之后的处理函数
    handleSuccess (response, file, fileList) {
      // console.log(response, file, fileList)
      // 数据就存储在reponse中
      this.goodsForm.pics.push({ pic: response.data.tmp_path })
      console.log(this.goodsForm.pics)
    },
    // 预览
    handlePreview () {},
    // 移除
    handleRemove (file, fileList) {
      console.log(file)
      if (!file.response) {
        return
      }
      // file就是当前你移除的文件
      var filename = file.response.data.tmp_path
      // 我们要根据 file里面的数据删除this.goodsForm.pics中的数据
      for (var i = 0; i < this.goodsForm.pics.length; i++) {
        if (this.goodsForm.pics[i].pic === filename) {
          this.goodsForm.pics.splice(i, 1)
          break
        }
      }
    },
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
