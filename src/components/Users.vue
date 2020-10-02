<template>
<div class="users">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索区域 -->
  <el-input placeholder="请输入内容" v-model="query" class="searchBox">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
  <el-button type="success" plain class="addRole" @click="showAddDialog">添加用户</el-button>
  <!-- 显示列表区域 -->
  <el-table
    class="showList"
    :data="userList"
    style="width: 100%">
    <el-table-column
      prop="username"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话">
    </el-table-column>
    <el-table-column
      label="用户状态">
      <template v-slot:default="{ row }">
        <el-switch
          @change="changeRoleState(row)"
          v-model="row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template v-slot:default="{ row }">
        <el-button @click="showEditDialog(row)" size="small" plain type="primary" icon="el-icon-edit"></el-button>
        <el-button @click="delRole(row.id)" size="small" plain type="danger" icon="el-icon-delete"></el-button>
        <el-button size="small" plain type="success" icon="el-icon-check">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
  <!-- 添加用户弹出框 -->
  <el-dialog
    @close="closeAddDialog"
    title="添加用户"
    :visible.sync="addVisible"
    width="40%">
    <span>
      <el-form ref="form" status-icon :rules="rules" :model="newRoleData" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="newRoleData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="newRoleData.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="newRoleData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="newRoleData.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRole">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 修改用户信息 -->
  <el-dialog
    title="修改信息"
    :visible.sync="editVisible"
    width="40%">
    <span>
      <el-form ref="form" status-icon :rules="rules" :model="newRoleData" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ newRoleData.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="newRoleData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="newRoleData.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editVisible = false">取 消</el-button>
      <el-button type="primary" @click="editRole">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    // var checkMobile = (rule, value, callback) => {
    //   const rep = /^1[1-9]\d{9}$/
    //   if (!rep.test(value)) return callback(new Error('请输入正确的手机号码'))
    //   callback()
    // }
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      addVisible: false,
      editVisible: false,
      userList: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      newRoleData: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        id: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 6, message: '用户名必须为3-6位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '密码必须为6-12位', trigger: ['blur', 'change'] }
        ],
        email: { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
        // mobile: { validator: checkMobile, trigger: ['blur', 'change'] }
        mobile: { pattern: /^1[1-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
      }
    }
  },
  // 监视搜索框
  watch: {
    query () {
      // 先让当前页处于第一页 从第一页开始搜索
      this.pagenum = 1
      this.getUserList()
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      try {
        const { meta, data } = await this.$axios.get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        if (meta.status === 200) {
          this.userList = data.users
          this.total = data.total
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 改变分页的每页的条数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    // 改变当前页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    // 添加用户
    showAddDialog () {
      // 弹出添加用户的框
      this.addVisible = true
    },
    closeAddDialog () {
      // 关闭弹出框后清空input框
      this.$refs.form.resetFields()
    },
    async addRole () {
      try {
        // 检验格式是否正确
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.newRoleData)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      // 关闭弹出框(必须要在发送ajax后才关闭，否则input会清空)
      this.addVisible = false
    },
    // 修改用户信息
    showEditDialog (row) {
      // 显示修改对话框
      this.editVisible = true
      this.newRoleData.username = row.username
      this.newRoleData.email = row.email
      this.newRoleData.mobile = row.mobile
      this.newRoleData.id = row.id
    },
    async editRole (id) {
      // 提交修改后的用户信息
      try {
        await this.$refs.form.validate()
        const id = this.newRoleData.id
        const email = this.newRoleData.email
        const mobile = this.newRoleData.mobile
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      this.editVisible = false
    },
    // 删除用户
    async delRole (id) {
      try {
        await this.$confirm('您确认要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 修改用户状态
    async changeRoleState (row) {
      const id = row.id
      const state = row.mg_state
      try {
        const { meta } = await this.$axios.put(`users/${id}/state/${state}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
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
  // 搜索框部分
  .searchBox {
      width: 300px;
      margin-right: 20px;
  }
  // 显示列表部分
  .showList {
    margin-top: 10px;
  }
}
</style>
