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
              <el-cascader :options="cateList" :props="cateprops" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="1">配置管理</el-tab-pane>
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
