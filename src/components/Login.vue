<template>
<div class="login">
  <el-form status-icon ref="form" :rules="rules" :model="form" label-width="80px">
    <img class="loginImg" src="../assets/user.jpg" alt="图片加载失败">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="login" class="loginBtn" type="primary">登录</el-button>
      <el-button @click="resetInputBox">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空!', trigger: ['blur', 'change'] },
          { min: 3, max: 6, message: '用户名必须在3-6位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空!', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '密码必须在6-12位', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    // 重置操作
    resetInputBox () {
      this.$refs.form.resetFields()
    },
    // 登录操作
    async login () {
      // 判断输入是否合理
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000
          })
          localStorage.setItem('token', data.token)
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
.login {
  overflow: hidden;
  height: 100%;
  background-color: #2d434c;
  .el-form {
    position: relative;
    width: 400px;
    padding: 20px;
    padding-top: 70px;
    margin: 0 auto;
    margin-top: 150px;
    background-color: #fff;
    border-radius: 20px;
    .loginBtn {
      margin-right: 100px;
    }
    .loginImg {
      position: absolute;
      right: -50px;
      top: -100px;
      width: 150px;
      border-radius: 50%;
    }
  }
}
</style>
