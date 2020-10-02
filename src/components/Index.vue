<template>
<div class="index">
  <el-container>
    <!-- 顶部 -->
    <el-header>
      <div class="loginImg">
        <img src="../assets/logo.png" alt="加载失败">
      </div>
      <div class="title">
        <h2>电商后台管理系统</h2>
      </div>
      <div class="logout">
        欢迎光临~<a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
export default {
  methods: {
    async logout () {
      try {
        // 弹出对话框确认是否要退出
        await this.$confirm('您真的要退出吗？', '温馨提示', {
          type: 'warning'
        })
        // 清除token
        localStorage.removeItem('token')
        // 跳转到登录页
        this.$router.push('/login')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  background-color: #ecf0f1;
  .el-container {
    height: 100%;
    .el-header {
      display: flex;
      background-color: #d8d8d8;
      .loginImg {
        width: 180px;
        img {
          height: 40px;
          margin: 10px 0;
        }
      }
      .title {
        flex: 1;
        h2 {
          height: 60px;
          line-height: 60px;
          text-align: center;
        }
      }
      .logout {
        width: 180px;
        line-height: 60px;
        text-align: right;
        font-weight: 700;
        a {
          color: orangered;
        }
      }
    }
    .el-menu {
      height: 100%;
      border: 0;
    }
  }
}
</style>
