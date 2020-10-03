<template>
<div class="users">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 添加角色按钮 -->
  <el-button @click="showAddDialog" class="addRole" type="success" plain>添加角色</el-button>
  <!-- 角色列表 -->
  <el-table :data="rolesData">
    <el-table-column type="expand">
      <template v-slot:default="{ row }">
        <p v-show="row.children.length === 0">暂无权限</p>
        <el-row class="role" v-for="l_1 in row.children" :key="l_1.id">
          <el-col :span="4">
            <el-tag @close="delRight(row, l_1.id)" closable>{{ l_1.authName }}</el-tag>
            <i class="el-icon-arrow-right"></i>
          </el-col>
          <el-col :span="20">
            <el-row v-for="l_2 in l_1.children" :key="l_2.id">
              <el-col :span="4">
                <el-tag  @close="delRight(row, l_2.id)" closable type="success">{{ l_2.authName }}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-tag  @close="delRight(row, l_3.id)" closable type="warning" v-for="l_3 in l_2.children" :key="l_3.id">{{ l_3.authName }}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作">
      <template v-slot:default="{ row }">
        <el-button @click="showEditDialog(row)" size="small" type="primary" plain icon="el-icon-edit"></el-button>
        <el-button @click="delRole(row.id)" size="small" type="danger" plain icon="el-icon-delete"></el-button>
        <el-button @click="showDesignDialog(row)" size="small" type="success" plain icon="el-icon-check">分配权限</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加角色和编辑角色 -->
  <el-dialog
  @close="closeDialog"
  :title="title"
  :visible.sync="isAddVisible"
  width="40%">
  <el-form status-icon ref="form" :rules="rules" :model="form" label-width="80px">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="form.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="form.roleDesc"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isAddVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 分配权限 -->
  <el-dialog
  title="分配权限"
  :visible.sync="isAssignVisible"
  width="40%">
    <el-tree
    node-key="id"
    ref="tree"
    show-checkbox
    default-expand-all
    :data="data"
    :props="defaultProps"></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isAssignVisible = false">取 消</el-button>
      <el-button @click="assignRight" type="primary">分 配</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      rolesData: [],
      isAddVisible: false,
      isAssignVisible: false,
      title: '添加角色',
      roleId: '',
      form: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      rules: {
        roleName: { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] },
        roleDesc: { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
      },
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      try {
        const { meta, data } = await this.$axios.get('roles')
        if (meta.status === 200) {
          this.rolesData = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除角色的指定权限
    async delRight (row, rightid) {
      try {
        const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightid}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          // 局部更新 数据改变视图自动更新
          row.children = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 添加角色
    showAddDialog () {
      // 显示添加角色对话框
      this.isAddVisible = true
      this.title = '添加角色'
    },
    closeDialog () {
      // 关闭对话框后清空input框
      this.$refs.form.resetFields()
    },
    // 修改角色
    showEditDialog (row) {
      // 显示修改角色对话框
      this.isAddVisible = true
      this.title = '修改角色'
      this.$nextTick(() => {
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
        this.form.id = row.id
      })
    },
    async addRole () {
      try {
        await this.$refs.form.validate()
        const isAddRole = (this.title === '添加角色')
        const method = isAddRole ? 'post' : 'put'
        const id = isAddRole ? '' : ('/' + this.form.id)
        const url = 'roles' + id
        const roleName = this.form.roleName
        const roleDesc = this.form.roleDesc
        const { meta } = await this.$axios[method](url, { roleName, roleDesc })
        if (meta.status === 201 || meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      this.isAddVisible = false
    },
    // 删除角色
    async delRole (id) {
      try {
        await this.$confirm('您确认要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分配权限
    async showDesignDialog (row) {
      // 注意要先将模态框显示后面才能获取到ref
      this.isAssignVisible = true
      console.log(row)
      // 将角色id存储起来备用
      this.roleId = row.id
      try {
        const { meta, data } = await this.$axios.get('rights/tree')
        if (meta.status === 200) {
          this.data = data
          // 获取所有三级权限
          const choosedRights = []
          row.children.forEach(level1 => {
            level1.children.forEach(level2 => {
              level2.children.forEach(level3 => {
                choosedRights.push(level3.id)
              })
            })
          })
          // 选中所有三级权限
          this.$refs.tree.setCheckedKeys(choosedRights)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 确认分配权限
    async assignRight () {
      this.isAssignVisible = false
      try {
        // 获取所有被选中的id和半选中的id
        const ids = this.$refs.tree.getCheckedKeys()
        const halfs = this.$refs.tree.getHalfCheckedKeys()
        const rids = [...ids, ...halfs].join(',')
        const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
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
  // 添加角色按钮
  .addRole {
    margin-bottom: 10px;
  }
  // 每个角色权限
  .role {
    border-bottom: 1px dotted #ccc;
    padding: 10px 0;
    &:last-child {
      border: 0;
    }
    .el-tag {
      margin: 5px;
    }
  }
}
</style>
