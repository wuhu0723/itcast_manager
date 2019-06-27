<template>
  <div class="list">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
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
        <el-button type="success" plain @click='$router.push({name: "Add"})'>添加商品</el-button>
      </div>
      <!-- 表格展示 -->
      <el-table :data="goodsList" border style="width: 100%;margin-top:15px">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="580"></el-table-column>
        <el-table-column prop="goods_price" label="价格" width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getAllGoodsList } from '@/api/goods.js'
export default {
  data () {
    return {
      // 所有商品列表数据
      goodsList: [],
      // 用户搜索关键字
      userKey: '',
      // 当前页码
      pagenum: 1,
      // 每页所展示的记录数
      pagesize: 10
    }
  },
  mounted () {
    //   获取所有商品列表数据
    getAllGoodsList({
      query: this.userKey,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })
      .then(res => {
        console.log(res)
        this.goodsList = res.data.data.goods
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
</style>
