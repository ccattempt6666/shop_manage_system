<template>
<div class="users">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 权限列表 -->
  <el-table :data="rightData">
    <!-- 索引 -->
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column label="权限名称" prop="authName"></el-table-column>
    <el-table-column label="路径"  prop="path"></el-table-column>
    <el-table-column label="层级">
      <template v-slot:default="{ row }">
        <span v-if="row.level === '0'">一级</span>
        <span v-else-if="row.level === '1'">二级</span>
        <span v-else>三级</span>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  data () {
    return {
      rightData: []
    }
  },
  async created () {
    // 发送ajax 获取数据
    try {
      const { meta, data } = await this.$axios.get('rights/list')
      if (meta.status === 200) {
        this.rightData = data
      } else {
        this.$message.error(meta.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  // 面包屑导航
  .el-breadcrumb {
    padding: 10px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
}
</style>
